import './App.css'
import Star from './components/Star'
import Dialogue from './components/Dialogue'
import NotesVideo from './components/NotesVideo'

function HomePage({ stats, activities, onActivity, expUp, isMax, selectedConfidant, suppressLevelUp, onLevelUpHandled }) {
  return (
    <>
      <Star
        stats={stats}
        expUp={expUp}
        isMax={isMax}
        suppressLevelUp={suppressLevelUp}
        onLevelUpHandled={onLevelUpHandled}
      />
      <Dialogue
        stats={stats}
        activities={activities}
        onActivity={onActivity}
        expUp={expUp}
        confidant={selectedConfidant}
      />
      <NotesVideo expUp={expUp} />
    </>
  )
}

export default HomePage