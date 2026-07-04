import './App.css'
import './HomePage.css'
import Star from './components/Star'
import Dialogue from './components/Dialogue'
import NotesVideo from './components/NotesVideo'

function HomePage({ stats, activities, onActivity, expUp, isMax, selectedConfidant, suppressLevelUp, onLevelUpHandled, onResetStats, userName }) {

  return (
    <>
      <div>
        <div>
          <button className='dialogue-button reset-stats-button' onClick={() => { onResetStats(); playClick(); }}>Reset Stats</button>
        </div>
        <Star
          stats={stats}
          expUp={expUp}
          isMax={isMax}
          suppressLevelUp={suppressLevelUp}
          onLevelUpHandled={onLevelUpHandled}
        />
      </div>
      <Dialogue
        stats={stats}
        activities={activities}
        onActivity={onActivity}
        expUp={expUp}
        confidant={selectedConfidant}
        userName={userName}
      />
      <NotesVideo expUp={expUp} />
    </>
  )
}

export default HomePage