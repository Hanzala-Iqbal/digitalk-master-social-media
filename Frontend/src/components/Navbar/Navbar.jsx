import React, { useContext, useState } from 'react';
import Identicon from 'identicon.js';
import logo from '/Images/DigiTalk.png';
import { DigiTalkContext } from '../../context/DigitalkContext';
import { AccountSlice } from '../../utils/AccountSlice';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBell, faUser, faSearch } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

const Navbar = () => {
  const { connectedAccounts, connectWallet } = useContext(DigiTalkContext);

  let options = {
    foreground: [255, 255, 255, 255], // rgba black
    background: [0, 0, 0, 255], // rgba white
    margin: 0.2, // 20% margin
  };

  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();

  const handleBellIconClick = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <nav className="navbar navbar-dark">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <img src={logo} width="152" height="45" alt="DigiTalk Logo" />
        </Link>
        {connectedAccounts ? (
          <>
            <ul className="navbar-nav">
              <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                <Link to="/" className="nav-link">
                  <FontAwesomeIcon icon={faHome} />
                </Link>
              </li>
              <li className={`nav-item ${location.pathname === '/notifications' ? 'active' : ''}`}>
                <Link to="/notifications" className="nav-link" onClick={handleBellIconClick}>
                  <FontAwesomeIcon icon={faBell} />
                </Link>
              </li>
              <li className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
                <Link to="/profile" className="nav-link">
                  <FontAwesomeIcon icon={faUser} />
                </Link>
              </li>
            </ul>
            <div className='search-bar-container mr-4'>
                <img
                className='mx-4'
                width='50'
                height='50'
                src={`data:image/png;base64,${new Identicon(connectedAccounts, options).toString()}`}
                />
                <p className='text-white text-center'>{AccountSlice(connectedAccounts)}</p>

            </div>
          </>
        ) : (
          <button type="button" className="btn btn-primary" onClick={connectWallet}>
            Connect to Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
