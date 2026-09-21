import { useEffect, useRef } from 'react'

interface ScoreScreenProps {
  score: number
  total: number
  onPlayAgain: () => void
}

export function ScoreScreen({ score, total, onPlayAgain }: ScoreScreenProps) {
  const playAgainRef = useRef<HTMLButtonElement>(null)

  // Focus the button when the screen appears so Enter/Space work natively.
  useEffect(() => {
    playAgainRef.current?.focus()
  }, [])

  return (
    <div className="score-screen">
      <span className="score-screen__emoji" aria-hidden="true">🎉</span>
      <p className="score-screen__text">
        You scored{' '}
        <span className="score-screen__num">{score} / {total}</span>
      </p>
      <button
        type="button"
        className="btn btn--primary"
        ref={playAgainRef}
        onClick={onPlayAgain}
      >
        Play Again
      </button>
    </div>
  )
}
