import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
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
  Mail
} from 'lucide-react';
import { mockData } from '../utils/mockData';
import '../styles/landing.css';

const LandingPage: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      try {
        const response = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        if (response.ok) {
          setSubscribed(true);
          setTimeout(() => setSubscribed(false), 5000);
          setEmail('');
        }
      } catch (error) {
        console.error('Newsletter error:', error);
      }
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
              animationDelay: `${-Math.random() * 20}s`
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
            <button className="cta-button-nav" onClick={() => scrollToSection('cta')}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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
            <button className="cta-button cta-primary">
              Launch Learning Track <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button className="cta-button cta-secondary">
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

        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="floating-card glass-card">
            <img 
              src="https://images.unsplash.com/photo-1677442136019-21780ecad995" 
              alt="AI Concept" 
              className="hero-image"
              referrerPolicy="no-referrer"
            />
            <div className="floating-badge badge-1">
              <Terminal className="text-cyan-400 w-5 h-5" />
              <span>AI Logic Model v2.4</span>
            </div>
            <div className="floating-badge badge-2">
              <Trophy className="text-yellow-400 w-5 h-5" />
              <span>Top Innovator Reward</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
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

      {/* Innovation Track Section */}
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
              src="https://images.unsplash.com/photo-1620712943543-bcc4628c9757" 
              alt="innovation" 
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

      {/* Challenges Section */}
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
                <button className="challenge-button">Start Battle</button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Community Section */}
      <section className="community-section" id="community">
        <div className="community-grid">
          <motion.div 
            className="leaderboard-card glass-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="leaderboard-header">
              <Trophy className="text-yellow-400 w-8 h-8" />
              <h3>Weekly Leaderboard</h3>
            </div>
            {mockData.leaderboard.map((user, i) => (
              <div key={i} className={`leaderboard-item rank-${i + 1}`}>
                <div className="rank-badge">{i + 1}</div>
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  <div className="user-stats">{user.modules} Modules • {user.credits} XP</div>
                </div>
              </div>
            ))}
          </motion.div>

          <div>
            <div className="section-badge">Global Hub</div>
            <h2 className="section-title">Join the Community</h2>
            <p className="community-text">
              Network with 50,000+ environmental tech enthusiasts and AI 
              developers from around the world.
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

      {/* Workshops Section */}
      <section className="workshops-section" id="workshops">
        <div className="section-header">
          <div className="section-badge">Live Learning</div>
          <h2 className="section-title">Expert Workshops</h2>
          <p className="section-description">
            Upcoming sessions with industry pioneers and ecological researchers.
          </p>
        </div>

        <div className="workshops-grid">
          {mockData.workshops.map((workshop, i) => (
            <motion.div 
              key={i} 
              className="workshop-card glass-card"
              whileHover={{ y: -10 }}
            >
              <div className="workshop-image-container">
                <img src={workshop.image} alt={workshop.title} className="workshop-image" referrerPolicy="no-referrer" />
                <span className="workshop-badge">{workshop.type}</span>
              </div>
              <div className="workshop-content">
                <h3 className="workshop-title">{workshop.title}</h3>
                <p className="workshop-instructor">{workshop.instructor}</p>
                <div className="workshop-meta">
                  <div className="workshop-date">
                    <Clock className="inline w-4 h-4 mr-1" /> {workshop.date}
                  </div>
                  <div className="workshop-enrolled">
                    <Users className="inline w-4 h-4 mr-1" /> {workshop.enrolled}
                  </div>
                </div>
                <button className="workshop-button">Register Now</button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="section-header">
          <div className="section-badge">Success Stories</div>
          <h2 className="section-title">Member Testimonials</h2>
        </div>

        <div className="testimonials-grid">
          {mockData.testimonials.map((t, i) => (
            <motion.div 
              key={i} 
              className="testimonial-card glass-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="testimonial-header">
                <div className="testimonial-avatar">{t.avatar}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-achievement">{t.achievement}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta-section" id="cta">
        <motion.div 
          className="cta-card glass-card"
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="cta-title">Ready to shape a sustainable future?</h2>
          <p className="cta-description">
            Join thousands of innovators building the next generation of environmental solutions.
          </p>
          <div className="cta-buttons">
            <button className="cta-button cta-primary cta-large">
              Join for Free Today
            </button>
            <button className="cta-button cta-secondary cta-large">
              View Curriculum
            </button>
          </div>
        </motion.div>
      </section>

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
              <Twitter className="w-5 h-5 text-gray-400 cursor-pointer hover:text-cyan-400" />
              <Github className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
              <Linkedin className="w-5 h-5 text-gray-400 cursor-pointer hover:text-cyan-600" />
            </div>
          </div>
          
          <div className="footer-column">
            <h4>Platform</h4>
            <a href="#">Learning Track</a>
            <a href="#">Challenges</a>
            <a href="#">Workshops</a>
            <a href="#">Community</a>
          </div>

          <div className="footer-column">
            <h4>Stay Updated</h4>
            <p className="text-xs text-gray-500 mb-3">Join 5,000+ subscribers for AI & eco-tech updates.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input 
                type="email" 
                placeholder="email@example.com"
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
