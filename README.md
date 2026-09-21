# Number Line

An accessible number-line math game for K–12 learners: move a marker along a 0–20 line to reach a target.

## Live demo and running locally

- Live demo: **TODO: add URL**

```
npm install
npm run dev      # start the dev server
npm run build    # type-check and build for production
```

## Tech stack

React + Vite + TypeScript. It is deliberately lean: no state library and no dependencies beyond the Vite React template's. The game has four pieces of state, so `useState` is enough.

## How it's organized

```
src/
  data/problems.ts             the 5 problems: { start, target }
  lib/numberLine.ts            clamp, toPercent, getTicks (pure)
  lib/game.ts                  checkAnswer (pure)
  hooks/useKeyboardControls.ts window keydown listener (arrows, Enter)
  components/NumberLine.tsx    renders the line and marker
  components/ScoreScreen.tsx   end-of-game screen
  App.tsx                      game state and handlers
```

- Game rules and math live in `src/lib` as pure functions, separate from presentation in `src/components`.
- Game state (`problemIndex`, `position`, `result`, `score`) lives in `App`.

## Key decisions

- **Step buttons (−1 / +1), not multiple choice or click-to-target.** Stepping is the arithmetic being practiced, and buttons work well on touch.
- **Movement is clamped to [0, 20]** by one pure `clamp()`, used by both the buttons and the arrow keys.
- **After Check, movement locks and Check is replaced by Next.** This keeps the checked answer and the marker from drifting apart, and stops the score from being inflated by repeated Checks.
- **The marker resets to each problem's `start` on advance.** The position state is initialized once at mount, so it needed an explicit reset.
- **The score screen uses `problems.length`.** Nothing is hardcoded to 5.

## Accessibility

What is implemented:

- **Keyboard play.** Arrow keys call the same `move()` as the buttons, so clamping and the post-Check lock apply to both. Enter activates Check, Next or Finish. Key-repeat and double-firing on a focused button are guarded.
- **Focus management.** Focus follows the primary button through every transition (Check → Next/Finish → Check), and Play Again is focused when the score screen appears. Enter and Space then work natively.
- **Feedback.** Results are announced through an `aria-live="polite"` region. Feedback is text, not color alone. Focus outlines are visible.
- **Number line.** It has `role="img"` and a dynamic `aria-label` (e.g. "Number line 0 to 20. Marker on 7, target 9."). The ticks are `aria-hidden`, so that one label carries the meaning.
- **Buttons.** The −1 / +1 buttons have descriptive `aria-label`s.

What is verified and what is not:

- Type-check, production build and lint pass. There are no automated tests.
- **Not tested with a real screen reader.** The ARIA behavior above follows the standard patterns but has not been confirmed with one.
- **Known limitation:** marker moves are not announced on each key press. The label is read when a user navigates to the line. Announcing each move through a live region is the top item under "Next".
- Color contrast has not been audited.
- Check is focused on first page load, because the focus effect runs on mount.

## Scope and tradeoffs

Built to a 3-hour limit. Deliberately left out, in the order I would do them:

1. Announce marker moves via a live region
2. Progress indicator (problem N of total)
3. Young-learner styling (styling is minimal now)
4. Random problem generation
5. Difficulty levels
6. Move-count / efficiency scoring
7. Visual jump arcs

## Note on process

This was built AI-assisted. I made the design decisions above and can explain them.
