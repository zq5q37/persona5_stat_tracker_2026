import './App.css'
import Star from './components/Star'
import Dialogue from './components/Dialogue'
import NotesVideo from './components/NotesVideo'
import StreakBadge from './components/StreakBadge'
import YenDisplay from './components/YenDisplay'


function HomePage({ stats, activities, onActivity, expUp, isMax, selectedConfidant,
  suppressLevelUp, onLevelUpHandled, onResetStats, userName, currentStreak,
  yen, pendingReward, onClaimReward, }) {

  return (
    <>
      <div>
        <div className='top-utils'>
          <button className='dialogue-button reset-stats-button' onClick={() => { onResetStats(); playClick(); }}>Reset Stats</button>
          <StreakBadge currentStreak={currentStreak} />
          <YenDisplay yen={yen} />
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
        streakReward={pendingReward}
        onClaimReward={onClaimReward}
      />
      <NotesVideo expUp={expUp} />
    </>
  )
}

export default HomePage