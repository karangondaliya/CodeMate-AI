import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>CodeMate<span>AI</span></h3>
          <p>Role-aware AI teammate for codebase insights</p>
        </div>
        <div className="footer-section">
          <p>&copy; {new Date().getFullYear()} CodeMate AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;