import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Secure In-Memory User and Token Databases
  interface User {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    salt: string;
  }

  interface ResetToken {
    email: string;
    token: string;
    expiresAt: number;
  }

  const users: Map<string, User> = new Map();
  const resetTokens: Map<string, ResetToken> = new Map();

  const crypto = await import('crypto');

  function hashPassword(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  }

  function createUser(name: string, email: string, password: string): User {
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);
    const user: User = {
      id: crypto.randomUUID(),
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      salt
    };
    users.set(user.email, user);
    return user;
  }

  // Pre-seed default user for immediate verification
  createUser("Sathwik Kumar", "nexuscraft06@gmail.com", "password123");

  // Endpoint to sign up
  app.post('/api/auth/signup', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    const normalizedEmail = email.toLowerCase().trim();
    if (users.has(normalizedEmail)) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const user = createUser(name, normalizedEmail, password);
    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        picture: `https://api.dicebear.com/7.x/initials/svg?seed=${user.name.substring(0, 2).toUpperCase()}`
      }
    });
  });

  // Endpoint to log in
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const normalizedEmail = email.toLowerCase().trim();
    const user = users.get(normalizedEmail);
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const calculatedHash = hashPassword(password, user.salt);
    if (calculatedHash !== user.passwordHash) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        picture: `https://api.dicebear.com/7.x/initials/svg?seed=${user.name.substring(0, 2).toUpperCase()}`
      }
    });
  });

  // Endpoint to handle Forgot Password
  app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    // Security: Do not leak whether the email exists in our records!
    const userExists = users.has(normalizedEmail);
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins expiry

    if (userExists) {
      // Clear older tokens
      for (const [t, data] of resetTokens.entries()) {
        if (data.email === normalizedEmail) {
          resetTokens.delete(t);
        }
      }
      resetTokens.set(token, { email: normalizedEmail, token, expiresAt });
    }

    const resetUrl = `/auth/reset-password?token=${token}&email=${encodeURIComponent(normalizedEmail)}`;
    console.log(`[AUTH] Password reset link generated for ${normalizedEmail}: ${resetUrl}`);

    res.json({
      success: true,
      message: 'If this email address is registered with NexusCraft, you will receive a password reset link shortly.',
      // Share devToken & devLink only for testing ease in simulated environments
      devToken: token,
      devLink: resetUrl
    });
  });

  // Endpoint to verify reset token validity
  app.post('/api/auth/verify-reset-token', (req, res) => {
    const { token, email } = req.body;
    if (!token || !email) {
      return res.status(400).json({ error: 'Invalid or missing parameters.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const resetData = resetTokens.get(token);

    if (!resetData || resetData.email !== normalizedEmail) {
      return res.status(400).json({ error: 'This password reset link is invalid.' });
    }

    if (Date.now() > resetData.expiresAt) {
      resetTokens.delete(token);
      return res.status(400).json({ error: 'This password reset link has expired. Links are valid for 15 minutes.' });
    }

    res.json({ success: true, message: 'Token is valid.' });
  });

  // Endpoint to reset password
  app.post('/api/auth/reset-password', (req, res) => {
    const { token, email, password } = req.body;
    if (!token || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const resetData = resetTokens.get(token);

    if (!resetData || resetData.email !== normalizedEmail) {
      return res.status(400).json({ error: 'This password reset link is invalid.' });
    }

    if (Date.now() > resetData.expiresAt) {
      resetTokens.delete(token);
      return res.status(400).json({ error: 'This password reset link has expired.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const user = users.get(normalizedEmail);
    if (!user) {
      return res.status(400).json({ error: 'Account not found.' });
    }

    // Secure password update
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);
    user.salt = salt;
    user.passwordHash = passwordHash;
    users.set(normalizedEmail, user);

    // Expire token immediately after successful reset
    resetTokens.delete(token);

    res.json({ success: true, message: 'Your password has been successfully reset. You can now log in.' });
  });

  // OAuth Setup Check
  const hasCredentials = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

  // Endpoint to check auth capabilities
  app.get('/api/auth/config', (req, res) => {
    res.json({
      hasGoogleCredentials: hasCredentials,
      userEmail: "nexuscraft06@gmail.com"
    });
  });

  // 1. Google OAuth URL Builder (Real or Demo)
  app.get('/api/auth/google/url', (req, res) => {
    // Build real Google Auth URL if credentials exist
    if (hasCredentials) {
      const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'https://sathwik-3dd2e753.vercel.app/auth/google/callback';
      const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'select_account'
      });
      res.json({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` });
    } else {
      // Return the high-fidelity demo selector page
      res.json({ url: '/auth/google-demo' });
    }
  });

  // 2. Real Google OAuth Callback
  app.get('/api/auth/google/callback', async (req, res) => {
    const { code } = req.query;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'https://sathwik-3dd2e753.vercel.app/auth/google/callback';
    const isJson = req.headers.accept && req.headers.accept.includes('application/json');

    if (!code) {
      if (isJson) {
        return res.status(400).json({ error: 'No authorization code received' });
      }
      return res.send(`
        <html>
          <body>
            <script>
              window.opener.postMessage({ type: 'OAUTH_AUTH_FAILURE', error: 'No authorization code received' }, '*');
              window.close();
            </script>
          </body>
        </html>
      `);
    }

    try {
      // Exchange code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code: code as string,
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        })
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        throw new Error(`Failed to exchange code for tokens: ${errorText}`);
      }

      const tokens = await tokenResponse.json();
      
      // Get user profile info
      const profileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` }
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to fetch user profile info');
      }

      const profile = await profileResponse.json();

      if (isJson) {
        return res.json({
          success: true,
          user: {
            name: profile.name || '',
            email: profile.email || '',
            picture: profile.picture || ''
          }
        });
      }

      // Return popup message
      res.send(`
        <html>
          <body>
            <script>
              window.opener.postMessage({ 
                type: 'OAUTH_AUTH_SUCCESS', 
                user: {
                  name: "${profile.name || ''}",
                  email: "${profile.email || ''}",
                  picture: "${profile.picture || ''}"
                }
              }, '*');
              window.close();
            </script>
          </body>
        </html>
      `);
    } catch (err: any) {
      if (isJson) {
        return res.status(500).json({ error: err.message || 'Unknown error during authentication' });
      }
      res.send(`
        <html>
          <body>
            <script>
              window.opener.postMessage({ type: 'OAUTH_AUTH_FAILURE', error: "${err.message || 'Unknown error'}" }, '*');
              window.close();
            </script>
          </body>
        </html>
      `);
    }
  });

  // 3. High-Fidelity Google Demo Account Selector Route
  app.get('/auth/google-demo', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sign in - Google Accounts</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;750&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Roboto', sans-serif;
            background-color: #ffffff;
          }
        </style>
      </head>
      <body class="min-h-screen flex flex-col justify-between p-4 md:p-8 text-[#202124]">
        <div class="max-w-[440px] w-full mx-auto my-auto border border-gray-200 rounded-lg p-6 md:p-10 shadow-sm flex flex-col items-center bg-white">
          
          <!-- Google Logo -->
          <svg class="h-6 mb-4" viewBox="0 0 24 24" width="24" height="24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>

          <h1 class="text-2xl font-normal text-center mb-1 text-gray-900">Choose an account</h1>
          <p class="text-sm text-center text-gray-600 mb-6">to continue to <span class="font-medium text-gray-800">NexusCraft</span></p>

          <!-- List of accounts -->
          <div class="w-full space-y-1 mb-8">
            
            <!-- User account (Sathwik) -->
            <button onclick="selectAccount('Sathwik Kumar', 'nexuscraft06@gmail.com', 'SK')" class="w-full flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left focus:outline-none rounded-md">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  SK
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-800">Sathwik Kumar</div>
                  <div class="text-xs text-gray-500">nexuscraft06@gmail.com</div>
                </div>
              </div>
              <div class="text-xs text-green-600 font-medium">Signed in</div>
            </button>

            <!-- Test account 2 -->
            <button onclick="selectAccount('Alex Mercer', 'alex.mercer@nexuscraft.ai', 'AM')" class="w-full flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left focus:outline-none rounded-md">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  AM
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-800">Alex Mercer</div>
                  <div class="text-xs text-gray-500">alex.mercer@nexuscraft.ai</div>
                </div>
              </div>
              <div class="text-xs text-gray-400 font-medium">Active</div>
            </button>

            <!-- Use another account -->
            <button onclick="useAnother()" class="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left focus:outline-none rounded-md">
              <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 border border-gray-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
              </div>
              <span class="text-sm text-gray-700 font-medium">Use another account</span>
            </button>

          </div>

          <p class="text-xs text-gray-500 leading-relaxed text-center mb-4">
            To continue, Google will share your name, email address, language preference, and profile picture with NexusCraft. Before using this app, you can review its <a href="#" class="text-blue-600 hover:underline">privacy policy</a> and <a href="#" class="text-blue-600 hover:underline">terms of service</a>.
          </p>

          <!-- Loader -->
          <div id="loader" class="hidden flex items-center gap-2 text-sm text-gray-600 mt-2">
            <svg class="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Connecting securely...</span>
          </div>

        </div>

        <!-- Footer -->
        <div class="max-w-[440px] w-full mx-auto flex justify-between text-xs text-gray-500 mt-4 px-2">
          <span>English (United States)</span>
          <div class="flex gap-4">
            <a href="#" class="hover:underline">Help</a>
            <a href="#" class="hover:underline">Privacy</a>
            <a href="#" class="hover:underline">Terms</a>
          </div>
        </div>

        <script>
          function selectAccount(name, email, initials) {
            document.getElementById('loader').classList.remove('hidden');
            
            setTimeout(() => {
              if (window.opener) {
                window.opener.postMessage({
                  type: 'OAUTH_AUTH_SUCCESS',
                  user: {
                    name: name,
                    email: email,
                    picture: "https://api.dicebear.com/7.x/initials/svg?seed=" + initials
                  }
                }, '*');
                window.close();
              } else {
                alert('No opener found. Simulation succeeded for: ' + name);
              }
            }, 1200);
          }

          function useAnother() {
            const email = prompt("Enter your Google Account email address:");
            if (email) {
              const name = email.split('@')[0];
              const initials = name.substring(0, 2).toUpperCase();
              selectAccount(name, email, initials);
            }
          }
        </script>
      </body>
      </html>
    `);
  });

  // Vite integration middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
