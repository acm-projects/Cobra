import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionType, ChatHistoryItem } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import NavItem from './NavItem';
import PastChats from './PastChats';
import ProfileMenu from './ProfileMenu';

interface SidebarProps {
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const { isDarkMode, toggleDarkMode, sidebarExpanded, toggleSidebar } = useAppContext();
  
  // Handle settings click
  const handleSettingsClick = () => {
    onSectionChange('settings');
  };
  
  // Navigation items configuration
  const navItems = [
    { section: 'dashboard' as SectionType, icon: 'tachometer-alt', label: 'Dashboard' },
    { section: 'chat' as SectionType, icon: 'comment', label: 'Chat' },
    { section: 'learn' as SectionType, icon: 'book', label: 'Learn' },
    { section: 'practice' as SectionType, icon: 'code', label: 'Practice' },
    { section: 'timer' as SectionType, icon: 'clock', label: 'Timer' }
  ];
  
  // Past chats data
  const [chatHistory] = useState<ChatHistoryItem[]>([
    {
      id: '1',
      title: 'JavaScript Array Methods',
      preview: 'Can you explain map, filter, and reduce?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      date: '10:30 AM'
    },
    {
      id: '2',
      title: 'React Hooks Tutorial',
      preview: 'How do I use useEffect properly?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      date: 'Yesterday'
    },
    {
      id: '3',
      title: 'CSS Flexbox Layout',
      preview: 'Help me build a responsive navbar',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      date: 'Sep 15'
    }
  ]);
  
  // Handle navigation
  const handleNavigation = (section: SectionType) => {
    onSectionChange(section);
  };
  
  return (
    <div className={`nav-sidebar ${sidebarExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="nav-items">
        {navItems.map(item => (
          <NavItem
            key={item.section}
            icon={item.icon}
            label={item.label}
            section={item.section}
            isActive={activeSection === item.section}
            expanded={sidebarExpanded}
            onClick={handleNavigation}
          />
        ))}
      </div>
      
      <div className="sidebar-footer">
        <div className={`past-chats-section ${sidebarExpanded ? 'expanded' : ''}`}>
          {sidebarExpanded && (
            <div className="past-chats-header">
              <span>Past Chats</span>
            </div>
          )}
          {sidebarExpanded && chatHistory.length > 0 && (
            <div className="past-chats-list">
              {chatHistory.map(chat => (
                <div key={chat.id} className="past-chat-item">
                  <i className="fas fa-comment"></i>
                  <span className="past-chat-title">{chat.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="sidebar-actions">
          <NavItem
            icon="cog"
            label="Settings"
            section="settings"
            isActive={activeSection === "settings"}
            expanded={sidebarExpanded}
            onClick={handleSettingsClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;