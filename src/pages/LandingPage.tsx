import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Terminal,
  Play,
  Trophy,
  Users,
  Clock,
  ChevronRight,
  Github,
  Twitter,
  Linkedin,
  Mail,
} from 'lucide-react';
import { mockData } from '@/utils/mockData';
import { useAuth } from '@/contexts/AuthContext';
import aiInnovationImg from '@/assets/ai-innovation.jpg';
import '@/styles/landing.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // If a user is already signed in, route them straight to their dashboard
  // so reloads land back where they were working instead of the marketing page.
  useEffect(() => {
    if (loading) return;
    if (!user) return;
    navigate('/student/dashboard', { replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const goToSignup = () => navigate('/signup');
  const goToLogin = () => navigate('/login');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmail('');
    }
  };

  return (
    <div className="landing-page">
      {/* Animated Background */}
      <div className="particle-container">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${15 + Math.random() * 20}s`,
              animationDelay: `${-Math.random() * 20}s`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className={`nav-container ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="nav-content">
          <div className="nav-logo">
            <div className="logo-image bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <Terminal className="text-white w-6 h-6" />
            </div>
            <span className="logo-text">EcoLearn</span>
          </div>
          <div className="nav-links">
            <button className="nav-link" onClick={() => scrollToSection('innovations')}>Innovations</button>
            <button className="nav-link" onClick={() => scrollToSection('challenges')}>Challenges</button>
            <button className="nav-link" onClick={() => scrollToSection('community')}>Community</button>
            <button className="nav-link" onClick={() => scrollToSection('workshops')}>Workshops</button>
            <button className="nav-link" onClick={goToLogin}>Sign In</button>
            <button className="cta-button-nav" onClick={goToSignup}>Get Started</button>
          </div>
        </div>
      </nav>

      <main>
      {/* Hero */}
      <section className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-badge">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            Next-Gen AI Learning Platform
          </div>
          <h1 className="hero-title">
            Transform Your Future with <span className="gradient-text">AI & Environmental</span> Innovation
          </h1>
          <p className="hero-description">
            Master practical AI skills through real-world environmental projects.
            Build, innovate, and contribute to global sustainability goals.
          </p>
          <div className="hero-cta-group">
            <button className="cta-button cta-primary" onClick={goToSignup}>
              Launch Learning Track <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button className="cta-button cta-secondary" onClick={goToSignup}>
              Explore Projects <Play className="ml-2 w-5 h-5" />
            </button>
          </div>
          <div className="hero-stats">
            {mockData.stats.map((stat, i) => (
              <div key={i} className="stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Hero visual removed per request */}
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="section-header">
          <div className="section-badge">Core Pillars</div>
          <h2 className="section-title">Everything you need to innovate</h2>
          <p className="section-description">
            Our platform combines advanced AI learning modules with practical
            ecological challenges for a comprehensive experience.
          </p>
        </div>

        <div className="features-grid">
          {mockData.features.map((feature, i) => (
            <motion.div
              key={i}
              className="feature-card glass-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <span className="feature-badge">{feature.badge}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Innovation */}
      <section className="innovation-section" id="innovations">
        <div className="innovation-grid">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="section-badge">Innovation Track</div>
            <h2 className="section-title">Master AI Innovation</h2>
            <p className="innovation-text">
              Practical learning paths designed to take you from fundamentals
              to deploying production-ready AI solutions for complex problems.
            </p>
            <div className="innovation-benefits">
              {mockData.aiTrack.map((benefit, i) => (
                <div key={i} className="benefit-item">
                  <div className="bg-cyan-400/20 rounded-full p-1">
                    <ChevronRight className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="floating-image-card glass-card"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img
              src={aiInnovationImg}
              alt="AI Innovation"
              referrerPolicy="no-referrer"
            />
            <div className="innovation-overlay">
              <div className="overlay-stat">
                <div className="overlay-value">95%</div>
                <div className="overlay-label">Module Completion Rate</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Challenges */}
      <section className="gamification-section" id="challenges">
        <div className="section-header">
          <div className="section-badge">Quiz Battles</div>
          <h2 className="section-title">Gamified Challenges</h2>
          <p className="section-description">
            Test your knowledge and earn credits through competitive learning challenges.
          </p>
        </div>

        <div className="challenges-container">
          {mockData.challenges.map((challenge, i) => (
            <motion.div
              key={i}
              className={`challenge-card glass-card ${challenge.level}`}
              whileHover={{ scale: 1.05 }}
            >
              <div className="challenge-header">
                <span className="challenge-level-badge">{challenge.level}</span>
                <span className="challenge-points">+{challenge.points} XP</span>
              </div>
              <h3 className="challenge-title">{challenge.title}</h3>
              <p className="challenge-description">{challenge.description}</p>
              <div className="challenge-footer">
                <div className="challenge-duration">
                  <Clock className="w-4 h-4" /> {challenge.duration}
                </div>
                <button className="challenge-button" onClick={goToSignup}>Start Battle</button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Community */}
      <section className="community-section" id="community">
        <div className="community-grid">
          <div>
            <div className="section-badge">Global Hub</div>
            <h2 className="section-title">Join the Community</h2>
            <p className="community-text">
              Network with fellow learners and AI builders, share progress, and
              collaborate on real environmental and AI projects.
            </p>
            <div className="community-features">
              {mockData.communityFeatures.map((feature, i) => (
                <div key={i} className="community-feature-item">
                  <div className="feature-icon-small">{feature.icon}</div>
                  <div>
                    <div className="feature-name">{feature.name}</div>
                    <div className="feature-desc">{feature.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials / Member Reviews */}
      <section className="testimonials-section">
        <div className="section-header">
          <div className="section-badge">Member Reviews</div>
          <h2 className="section-title">Loved by learners worldwide</h2>
          <p className="section-description">
            See how EcoLearn is helping innovators build real skills and make an impact.
          </p>
        </div>

        <div className="testimonials-grid">
          {mockData.testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              className="testimonial-card glass-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="testimonial-header">
                <div className="testimonial-avatar">{testimonial.avatar}</div>
                <div>
                  <div className="testimonial-name">{testimonial.name}</div>
                  <div className="testimonial-role">{testimonial.role}</div>
                </div>
              </div>
              <p className="testimonial-text">{testimonial.text}</p>
              <div className="testimonial-achievement">{testimonial.achievement}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta-section" id="cta">
        <motion.div className="cta-card glass-card" whileHover={{ scale: 1.02 }}>
          <h2 className="cta-title">Ready to shape a sustainable future?</h2>
          <p className="cta-description">
            Join thousands of innovators building the next generation of environmental solutions.
          </p>
          <div className="cta-buttons">
            <button className="cta-button cta-primary cta-large" onClick={goToSignup}>
              Join for Free Today
            </button>
            <button className="cta-button cta-secondary cta-large" onClick={goToLogin}>
              Sign In
            </button>
          </div>
        </motion.div>
      </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="nav-logo">
              <div className="logo-image bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <Terminal className="text-white w-6 h-6" />
              </div>
              <span className="logo-text">EcoLearn</span>
            </div>
            <p className="footer-tagline">
              Empowering innovators to solve global challenges through
              AI and technology-driven education.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="https://twitter.com/ecolearn" target="_blank" rel="noopener noreferrer" aria-label="EcoLearn on Twitter">
                <Twitter className="w-5 h-5 text-gray-400 cursor-pointer hover:text-cyan-400" aria-hidden="true" />
              </a>
              <a href="https://github.com/ecolearn" target="_blank" rel="noopener noreferrer" aria-label="EcoLearn on GitHub">
                <Github className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" aria-hidden="true" />
              </a>
              <a href="https://linkedin.com/company/ecolearn" target="_blank" rel="noopener noreferrer" aria-label="EcoLearn on LinkedIn">
                <Linkedin className="w-5 h-5 text-gray-400 cursor-pointer hover:text-cyan-600" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h4>Platform</h4>
            <a href="#innovations">Learning Track</a>
            <a href="#challenges">Challenges</a>
            <a href="#workshops">Workshops</a>
            <a href="#community">Community</a>
          </div>

          <div className="footer-column">
            <h4>Stay Updated</h4>
            <p className="text-xs text-gray-500 mb-3">Join 5,000+ subscribers for AI & eco-tech updates.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                placeholder="email@example.com"
                aria-label="Email address for newsletter"
                required
                className="bg-gray-800/50 border border-cyan-400/20 rounded-lg p-2 text-sm focus:outline-none focus:border-cyan-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold py-2 rounded-lg transition-colors"
                disabled={subscribed}
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>


          <div className="footer-column">
            <h4>Support</h4>
            <a href="#">Contact Us</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <div className="flex items-center gap-2 text-gray-400 mt-4">
              <Mail className="w-4 h-4" />
              <span>support@ecolearn.ai</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; 2026 EcoLearn AI Hub. All rights reserved. Built for a sustainable future.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
