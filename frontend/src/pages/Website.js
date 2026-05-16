import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import './Website.css';
import './About';
import './Services';
import './Contact';

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:3001';

function imgSrc(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return API_BASE + url;
}

// Icons as SVG components
const Icon = ({ name, size = 24 }) => {
  const icons = {
    building: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 22V12h6v10"/><path d="M9 7h1"/><path d="M9 11h1"/><path d="M14 7h1"/><path d="M14 11h1"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
    phone: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.72 6.72l1.28-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
    mail: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    web: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
    location: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    arrow: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>
  };
  return icons[name] || null;
};

const services = [
  { key: 'valuation', icon: '🏷️', color: '#6b50a8' },
  { key: 'marketing', icon: '🏘️', color: '#3d2c6e' },
  { key: 'management', icon: '🏢', color: '#c9a84c' },
  { key: 'investment', icon: '📈', color: '#2a1d4e' },
  { key: 'settlement', icon: '📋', color: '#6b50a8' },
  { key: 'studies', icon: '🔍', color: '#3d2c6e' },
];

export default function Website() {
  const { content, loading } = useContent();
  const [activeService, setActiveService] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (loading) return (
    <div className="site-loader">
      <div className="loader-logo">
        <div className="loader-dots">{[...Array(12)].map((_, i) => <span key={i} style={{ animationDelay: `${i * 0.08}s` }} />)}</div>
        <p>انتشار العقارية</p>
      </div>
    </div>
  );
const navigate = useNavigate;
  const hero = content.hero || {};
  const about = content.about || {};
  const contact = content.contact || {};

  return (
    <div className="website">
      {/* Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-inner">
          <div className="nav-logo">
            <div className="logo-dots">
              {[...Array(9)].map((_, i) => <span key={i} />)}
            </div>
            <div className="logo-text">
              <span className="logo-ar">انتشار العقارية</span>
              <span className="logo-en">ENTESHAAR</span>
            </div>
          </div>

          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <Link to="/" onClick={() => setMenuOpen(false)}>الرئيسية</Link>

            <Link to="/About" onClick={() => setMenuOpen(false)}>من نحن</Link>
            <Link to="/Services" onClick={() => setMenuOpen(false)}>خدماتنا</Link>
            <Link to="/Contact" onClick={() => setMenuOpen(false)}>تواصل معنا</Link>
            <Link to="/admin" className="btn btn-gold nav-admin" onClick={() => setMenuOpen(false)}>
              <Icon name="settings" size={16} /> لوحة التحكم
            </Link>
          </div>

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg">
          {imgSrc(hero.image_url) && <img src={imgSrc(hero.image_url)} alt="hero" className="hero-bg-img" />}
          <div className="hero-overlay" />
          <div className="hero-pattern" />
        </div>
        <div className="container hero-content">
          <div className="hero-badge">المنطقة الشرقية، المملكة العربية السعودية</div>
          <h1 className="hero-title">{hero.title_ar || 'انتشار العقارية'}</h1>
          <p className="hero-subtitle">{hero.title_en || 'ENTESHAAR Real Estate'}</p>
          <p className="hero-desc">{hero.body_ar || 'شريكك الموثوق في عالم العقارات'}</p>
          <div className="hero-actions">
            <a href="#services" className="btn btn-gold">اكتشف خدماتنا <Icon name="arrow" size={18} /></a>
            <a href="#contact" className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}>تواصل معنا</a>
          </div>
          <div className="hero-stats">
            <div className="stat"><span className="stat-num">6+</span><span className="stat-lbl">خدمات متكاملة</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">KSA</span><span className="stat-lbl">المملكة العربية السعودية</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">24/7</span><span className="stat-lbl">خدمة العملاء</span></div>
          </div>
        </div>
        <div className="hero-scroll-hint">
          <span />
        </div>
      </section>

    

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-logo">
            <div className="logo-dots mini">
              {[...Array(9)].map((_, i) => <span key={i} />)}
            </div>
            <div>
              <div className="logo-ar" style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--purple)' }}>انتشار العقارية</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray)', letterSpacing: 2 }}>ENTESHAAR REAL ESTATE</div>
            </div>
          </div>
          <p className="footer-copy">© 2024 انتشار العقارية — جميع الحقوق محفوظة</p>
          <Link to="/admin" className="footer-admin">لوحة التحكم <Icon name="settings" size={14} /></Link>
        </div>
      </footer>
    </div>
  );
}
