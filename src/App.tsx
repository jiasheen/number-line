import { useEffect, useRef, useState } from 'react'
import { NumberLine } from './components/NumberLine'
import { ScoreScreen } from './components/ScoreScreen'
import { problems } from './data/problems'
import { useKeyboardControls } from './hooks/useKeyboardControls'
import { checkAnswer, type Result } from './lib/game'
import { clamp } from './lib/numberLine'

function App() {
  const [problemIndex, setProblemIndex] = useState<number>(0)
  const [position, setPosition] = useState<number>(problems[0].start)
  const [result, setResult] = useState<Result | null>(null)
  const [score, setScore] = useState<number>(0)
  const [announcement, setAnnouncement] = useState<string>('')

  const checkButtonRef = useRef<HTMLButtonElement>(null)
  const nextButtonRef = useRef<HTMLButtonElement>(null)

  const isFinished = problemIndex >= problems.length
  const isLastProblem = problemIndex === problems.length - 1

  // The primary button swaps between Check and Next/Finish; keep focus on it.
  useEffect(() => {
    if (isFinished) return
    if (result === null) checkButtonRef.current?.focus()
    else nextButtonRef.current?.focus()
  }, [result, isFinished])

  // Movement is only allowed before checking; buttons and arrow keys share this.
  const move = (delta: number) => {
    if (result !== null) return
    const next = clamp(position + delta)
    setPosition(next)
    setAnnouncement(`Marker on ${next}`)
  }

  const handleCheck = () => {
    const outcome = checkAnswer(position, problems[problemIndex].target)
    setResult(outcome)
    if (outcome === 'correct') setScore((s) => s + 1)
  }

  const handleNext = () => {
    const nextIndex = problemIndex + 1
    setProblemIndex(nextIndex)
    if (nextIndex < problems.length) setPosition(problems[nextIndex].start)
    setResult(null)
    setAnnouncement('')
  }

  const handlePlayAgain = () => {
    setProblemIndex(0)
    setPosition(problems[0].start)
    setResult(null)
    setScore(0)
    setAnnouncement('')
  }

  const handleEnter = () => {
    if (isFinished) return
    if (result === null) handleCheck()
    else handleNext()
  }

  useKeyboardControls({
    onLeft: () => move(-1),
    onRight: () => move(1),
    onEnter: handleEnter,
  })

  if (isFinished) {
    return (
      <main className="app">
        <ScoreScreen
          score={score}
          total={problems.length}
          onPlayAgain={handlePlayAgain}
        />
      </main>
    )
  }

  const problem = problems[problemIndex]

  return (
    <main className="app">
      <p className="prompt">
        Start on <span className="prompt__num">{problem.start}</span> — move to{' '}
        <span className="prompt__num">{problem.target}</span>
      </p>
      <p className="score">Score: {score}</p>

      <NumberLine position={position} target={problem.target} />

      <p className="sr-only" aria-live="polite">{announcement}</p>

      <div className="controls">
        <button
          type="button"
          className="btn btn--step"
          aria-label="Move marker left by 1"
          onClick={() => move(-1)}
          disabled={result !== null}
        >
          -1
        </button>
        <button
          type="button"
          className="btn btn--step"
          aria-label="Move marker right by 1"
          onClick={() => move(1)}
          disabled={result !== null}
        >
          +1
        </button>
      </div>

      <p
        className={`feedback${result === null ? '' : ` feedback--${result}`}`}
        aria-live="polite"
      >
        {result === null
          ? ''
          : result === 'correct'
            ? 'Correct!'
            : 'Not quite — try the next one'}
      </p>

      {result === null ? (
        <button
          type="button"
          className="btn btn--primary"
          ref={checkButtonRef}
          onClick={handleCheck}
        >
          Check
        </button>
      ) : (
        <button
          type="button"
          className="btn btn--primary"
          ref={nextButtonRef}
          onClick={handleNext}
        >
          {isLastProblem ? 'Finish' : 'Next'}
        </button>
      )}
    </main>
  )
}

export default App
