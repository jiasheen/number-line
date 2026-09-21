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
    <>
      <p>You scored {score} / {total}</p>
      <button type="button" ref={playAgainRef} onClick={onPlayAgain}>Play Again</button>
    </>
  )
}
