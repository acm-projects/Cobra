import React from 'react';
import { SectionType } from '../../types';

interface NavItemProps {
  icon: string;
  label: string;
  isActive: boolean;
  section: SectionType;
  onClick: (section: SectionType) => void;
  badge?: number;
  expanded: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  isActive,
  section,
  onClick,
  badge,
  expanded
}) => {
  const handleClick = () => {
    onClick(section);
  };

  return (
    <div
      className={`nav-item ${isActive ? 'active' : ''}`}
      onClick={handleClick}
    >
      <i className={`fas fa-${icon}`}></i>
      {expanded && <span className="nav-label">{label}</span>}
    </div>
  );
};

export default NavItem; 