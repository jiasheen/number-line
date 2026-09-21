export type Result = 'correct' | 'incorrect'

export function checkAnswer(position: number, target: number): Result {
  return position === target ? 'correct' : 'incorrect'
}
