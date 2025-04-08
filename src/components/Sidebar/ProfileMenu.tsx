import React from 'react';

interface ProfileMenuProps {
  username: string;
  onNavigateToSettings: () => void;
  onContactUs: () => void;
  onLogout: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  username,
  onNavigateToSettings,
  onContactUs,
  onLogout
}) => {
  return (
    <div className="profile-popup">
      <div className="profile-header">{username}</div>
      <div className="profile-menu-item" onClick={onNavigateToSettings}>
        <i className="fas fa-cog"></i>
        <span>Settings</span>
      </div>
      <div className="profile-menu-item" onClick={onContactUs}>
        <i className="fas fa-paper-plane"></i>
        <span>Contact us</span>
      </div>
      <div className="profile-menu-item logout" onClick={onLogout}>
        <i className="fas fa-sign-out-alt"></i>
        <span>Log out</span>
      </div>
    </div>
  );
};

export default ProfileMenu; 