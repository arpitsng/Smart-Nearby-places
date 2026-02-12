import './MoodSelector.css';

function MoodSelector({ onMoodSelect, selectedMood }) {
  const moods = ['Work', 'Date', 'Quick Bite', 'Budget'];

  return (
    <div className="mood-selector">
      <h2>Select Your Mood</h2>
      <div className="mood-buttons">
        {moods.map((mood) => (
          <button
            key={mood}
            className={`mood-button ${selectedMood === mood ? 'active' : ''}`}
            onClick={() => onMoodSelect(mood)}
          >
            <span>{mood}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default MoodSelector;

