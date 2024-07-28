import React from 'react';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="Sidebar">
      <div className="logo">CancerBot</div>
      <div className="menu">
        <div className="menu-item">
          <span className="plus-icon">+</span>New Chat
        </div>
        <div className="menu-item active">Our Chat</div>
        <div className="menu-item">What's the date today?</div>
      </div>
      <div className="user-section">
        <div className="user-avatar">G1</div>
        <div className="user-name">Group 1</div>
      </div>
    </div>
  );
}

export default Sidebar;
