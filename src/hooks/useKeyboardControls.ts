import { useEffect } from 'react'

interface KeyboardControls {
  onLeft: () => void
  onRight: () => void
  onEnter: () => void
}

export function useKeyboardControls({ onLeft, onRight, onEnter }: KeyboardControls) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          onLeft()
          break
        case 'ArrowRight':
          onRight()
          break
        case 'Enter':
          // A focused button already activates itself on Enter, and holding
          // the key would otherwise skip through several steps.
          if (event.repeat || event.target instanceof HTMLButtonElement) return
          onEnter()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onLeft, onRight, onEnter])
}
