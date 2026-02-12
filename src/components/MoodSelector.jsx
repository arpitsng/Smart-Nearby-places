import './MoodSelector.css';

import './MoodSelector.css';
import moodConfig from '../utils/moodConfig';

function MoodSelector({ onMoodSelect, selectedMood }) {
  return (
    <div className="mood-selector">
      <div className="mood-header">
        <h2>What's your vibe today?</h2>
        <p className="subtitle">Select a mood to find the perfect spot.</p>
      </div>

      <div className="mood-grid">
        {Object.keys(moodConfig).map((moodKey) => {
          const mood = moodConfig[moodKey];
          const isActive = selectedMood === moodKey;

          return (
            <button
              key={moodKey}
              className={`mood-card ${isActive ? 'active' : ''}`}
              onClick={() => onMoodSelect(moodKey)}
            >
              <div className="mood-icon">{mood.icon}</div>
              <div className="mood-content">
                <h3>{mood.label}</h3>
                <p>{mood.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MoodSelector;

