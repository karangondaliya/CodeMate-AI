import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { currentUser, isAuthenticated, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Fix: Check if the click is outside the dropdown reference element
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    // Add the event listener only when the dropdown is open
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]); // Fix: Add dropdownOpen as a dependency

  const toggleDropdown = (e) => {
    // Fix: Stop event propagation to prevent immediate close
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <h1>CodeMate<span>AI</span></h1>
        </Link>
      </div>
      
      <nav className="nav">
        {isAuthenticated ? (
          <>
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/projects/new" className="nav-link">New Analysis</Link>
            <div className="user-menu" ref={dropdownRef}>
              {currentUser?.role && (
                <span className="user-role">{currentUser.role}</span>
              )}
              <div className="dropdown-container">
                <button 
                  className="user-name"
                  onClick={toggleDropdown} // Fix: Use toggleDropdown function that stops propagation
                  aria-expanded={dropdownOpen}
                >
                  {currentUser?.name || 'User'}
                </button>
                {dropdownOpen && (
                  <div className="dropdown-content active">
                    <Link 
                      to="/profile" 
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link btn-primary">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;