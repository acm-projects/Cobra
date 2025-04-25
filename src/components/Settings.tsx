import React from 'react';

interface SettingsProps {
  theme: string;
  fontSize: string;
  defaultView: string;
  animationsEnabled: boolean;
  notificationsEnabled: boolean;
  dataCollection: boolean;
  timerSound: string;
  timerVolume: number;
  onThemeToggle: () => void;
  onFontSizeChange: (size: "small" | "medium" | "large") => void;
  onDefaultViewChange: (view: string) => void;
  onAnimationsToggle: () => void;
  onNotificationsToggle: () => void;
  onDataCollectionToggle: () => void;
  onTimerSoundChange: (sound: string) => void;
  onTimerVolumeChange: (volume: number) => void;
  onRequestNotifications: () => void;
}

const Settings: React.FC<SettingsProps> = ({
  theme,
  fontSize,
  defaultView,
  animationsEnabled,
  notificationsEnabled,
  dataCollection,
  timerSound,
  timerVolume,
  onThemeToggle,
  onFontSizeChange,
  onDefaultViewChange,
  onAnimationsToggle,
  onNotificationsToggle,
  onDataCollectionToggle,
  onTimerSoundChange,
  onTimerVolumeChange,
  onRequestNotifications
}) => {
  return (
    <div className="settings-container">
      <div className="settings-section">
        <h3>
          <i className="fas fa-palette"></i> Appearance
        </h3>
        <div className="setting-item">
          <label>Theme</label>
          <div className="theme-toggle" onClick={onThemeToggle}>
            <i className={`fas fa-${theme === "dark" ? "sun" : "moon"}`}></i>
            {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </div>
        </div>

        <div className="setting-item">
          <label>Font Size</label>
          <div className="font-size-options">
            <div
              className={`radio-option ${fontSize === "small" ? "selected" : ""}`}
              onClick={() => onFontSizeChange("small")}
            >
              <div className="size-preview">
                <i className="fas fa-font icon-smaller"></i>
              </div>
              <input
                type="radio"
                id="small"
                name="fontSize"
                value="small"
                checked={fontSize === "small"}
                onChange={() => onFontSizeChange("small")}
              />
              <label htmlFor="small">Small</label>
            </div>
            <div
              className={`radio-option ${fontSize === "medium" ? "selected" : ""}`}
              onClick={() => onFontSizeChange("medium")}
            >
              <div className="size-preview">
                <i className="fas fa-font"></i>
              </div>
              <input
                type="radio"
                id="medium-font"
                name="fontSize"
                value="medium"
                checked={fontSize === "medium"}
                onChange={() => onFontSizeChange("medium")}
              />
              <label htmlFor="medium-font">Medium</label>
            </div>
            <div
              className={`radio-option ${fontSize === "large" ? "selected" : ""}`}
              onClick={() => onFontSizeChange("large")}
            >
              <div className="size-preview">
                <i className="fas fa-font icon-larger"></i>
              </div>
              <input
                type="radio"
                id="large"
                name="fontSize"
                value="large"
                checked={fontSize === "large"}
                onChange={() => onFontSizeChange("large")}
              />
              <label htmlFor="large">Large</label>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>
          <i className="fas fa-home"></i> Preferences
        </h3>
        <div className="setting-item">
          <label>Default View</label>
          <div className="view-options">
            <div
              className={`radio-option ${defaultView === "home" ? "selected" : ""}`}
              onClick={() => onDefaultViewChange("home")}
            >
              <div className="size-preview">
                <i className="fas fa-home"></i>
              </div>
              <input
                type="radio"
                id="home-view"
                name="defaultView"
                value="home"
                checked={defaultView === "home"}
                onChange={() => onDefaultViewChange("home")}
              />
              <label htmlFor="home-view">Home</label>
            </div>
            <div
              className={`radio-option ${defaultView === "resources" ? "selected" : ""}`}
              onClick={() => onDefaultViewChange("resources")}
            >
              <div className="size-preview">
                <i className="fas fa-book"></i>
              </div>
              <input
                type="radio"
                id="resources-view"
                name="defaultView"
                value="resources"
                checked={defaultView === "resources"}
                onChange={() => onDefaultViewChange("resources")}
              />
              <label htmlFor="resources-view">Resources</label>
            </div>
            <div
              className={`radio-option ${defaultView === "hints" ? "selected" : ""}`}
              onClick={() => onDefaultViewChange("hints")}
            >
              <div className="size-preview">
                <i className="fas fa-lightbulb"></i>
              </div>
              <input
                type="radio"
                id="hints-view"
                name="defaultView"
                value="hints"
                checked={defaultView === "hints"}
                onChange={() => onDefaultViewChange("hints")}
              />
              <label htmlFor="hints-view">Hints</label>
            </div>
          </div>
        </div>

        <div className="setting-item">
          <label>Timer Sound</label>
          <div className="sound-options">
            <div
              className={`sound-option ${timerSound === "bell" ? "selected" : ""}`}
              onClick={() => onTimerSoundChange("bell")}
            >
              <div className="sound-icon">
                <i className="fas fa-bell"></i>
              </div>
              <input
                type="radio"
                id="bell-sound"
                name="timerSound"
                value="bell"
                checked={timerSound === "bell"}
                onChange={() => onTimerSoundChange("bell")}
              />
              <label htmlFor="bell-sound">Bell</label>
            </div>
            <div
              className={`sound-option ${timerSound === "digital" ? "selected" : ""}`}
              onClick={() => onTimerSoundChange("digital")}
            >
              <div className="sound-icon">
                <i className="fas fa-clock"></i>
              </div>
              <input
                type="radio"
                id="digital-sound"
                name="timerSound"
                value="digital"
                checked={timerSound === "digital"}
                onChange={() => onTimerSoundChange("digital")}
              />
              <label htmlFor="digital-sound">Digital</label>
            </div>
            <div
              className={`sound-option ${timerSound === "gentle" ? "selected" : ""}`}
              onClick={() => onTimerSoundChange("gentle")}
            >
              <div className="sound-icon">
                <i className="fas fa-music"></i>
              </div>
              <input
                type="radio"
                id="gentle-sound"
                name="timerSound"
                value="gentle"
                checked={timerSound === "gentle"}
                onChange={() => onTimerSoundChange("gentle")}
              />
              <label htmlFor="gentle-sound">Gentle</label>
            </div>
            <div
              className={`sound-option ${timerSound === "alarm" ? "selected" : ""}`}
              onClick={() => onTimerSoundChange("alarm")}
            >
              <div className="sound-icon">
                <i className="fas fa-volume-up"></i>
              </div>
              <input
                type="radio"
                id="alarm-sound"
                name="timerSound"
                value="alarm"
                checked={timerSound === "alarm"}
                onChange={() => onTimerSoundChange("alarm")}
              />
              <label htmlFor="alarm-sound">Alarm</label>
            </div>
          </div>

          <div className="volume-control">
            <label>Volume</label>
            <input
              type="range"
              min="0"
              max="100"
              value={timerVolume}
              className="volume-slider"
              onChange={(e) => onTimerVolumeChange(parseInt(e.target.value))}
            />
            <div className="volume-label-container">
              <span className="volume-label">Min</span>
              <span className="volume-value">{timerVolume}%</span>
              <span className="volume-label">Max</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 