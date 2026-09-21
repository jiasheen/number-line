# Number Line

An accessible number-line math game for K–12 learners: move a marker along a 0–20 line to reach a target.

## Live demo and running locally

- Live demo: https://number-line.vercel.app

```
npm install
npm run dev      # start the dev server
npm run build    # type-check and build for production
```

## Tech stack

React + Vite + TypeScript. It is deliberately lean: no state library and no dependencies beyond the Vite React template's. The game has five pieces of state, so `useState` is enough.

## How it's organized

```
src/
  data/problems.ts             the 5 problems: { start, target }
  lib/numberLine.ts            clamp, toPercent, getTicks (pure)
  lib/game.ts                  checkAnswer (pure)
  hooks/useKeyboardControls.ts window keydown listener (arrows, Enter)
  components/NumberLine.tsx    renders the line and marker (+ .css)
  components/ScoreScreen.tsx   end-of-game screen
  App.tsx                      game state and handlers
  index.css                    palette, buttons, feedback, score screen
```

- Game rules and math live in `src/lib` as pure functions, separate from presentation in `src/components`.
- Game state (`problemIndex`, `position`, `result`, `score`, plus the text for the move announcement) lives in `App`.

## Key decisions

- **Step buttons (−1 / +1), not multiple choice or click-to-target.** Stepping is the arithmetic being practiced, and buttons work well on touch.
- **Movement is clamped to [0, 20]** by one pure `clamp()`, used by both the buttons and the arrow keys.
- **After Check, movement locks and Check is replaced by Next.** This keeps the checked answer and the marker from drifting apart, and stops the score from being inflated by repeated Checks.
- **The marker resets to each problem's `start` on advance.** The position state is initialized once at mount, so it needed an explicit reset.
- **The score screen uses `problems.length`.** Nothing is hardcoded to 5.

## Visual design and responsiveness

- One warm orange accent on a light background, a rounded sans-serif, and generous spacing. The problem prompt is the largest text on the page.
- Buttons are at least 56px tall, with distinct hover and pressed states. Hover styles only apply on devices that support hover.
- The number line has larger tick numbers and a marker with a white ring so it stands out from the line.
- **Narrow screens:** below 600px, odd-numbered labels drop to a second row (joined to the axis by a longer tick) so every number stays legible. The layout was checked in Chrome at 320, 360, 768 and 1024px, with no horizontal scrolling.
- The score screen shows the score large, with an inviting Play Again button.

## Accessibility

What is implemented:

- **Keyboard play.** Arrow keys call the same `move()` as the buttons, so clamping and the post-Check lock apply to both. Enter activates Check, Next or Finish. Key-repeat and double-firing on a focused button are guarded.
- **Focus management.** Focus follows the primary button through every transition (Check → Next/Finish → Check), and Play Again is focused when the score screen appears. Enter and Space then work natively.
- **Feedback.** Results are announced through an `aria-live="polite"` region. Feedback uses an icon, a word and a color together, not color alone.
- **Number line summary.** It has `role="img"` and a dynamic `aria-label` (e.g. "Number line 0 to 20. Marker on 7, target 9."). The ticks are `aria-hidden`, so that one label carries the meaning.
- **Move announcements.** A visually hidden `aria-live="polite"` region announces "Marker on N" on each move, from both the buttons and the arrow keys. It is cleared on Next and Play Again so a stale message can't suppress the next one, and it is not used for Check, Next or the score.
- **Buttons and focus outlines.** The −1 / +1 buttons have descriptive `aria-label`s, and all buttons show a visible focus outline.
- **Color contrast.** The text and button colors were checked by hand against WCAG AA (main pairs are about 5:1 or higher). This was not run through an automated contrast tool.

What is verified and what is not:

- Type-check, production build and lint pass. There are no automated tests, including no automated accessibility tests.
- The move announcements were tested manually with VoiceOver.

Known limitations:

- **Hitting the edge is not announced.** Pressing +1 at 20 or −1 at 0 doesn't change the position, so the live region text doesn't change and nothing is spoken.
- **The rounded font only renders on Apple devices.** Elsewhere (for example Chromebooks) it falls back to the system sans-serif. No font is bundled, to avoid adding a dependency.
- Check is focused on first page load, because the focus effect runs on mount.

## Scope and tradeoffs

Built to a 3-hour limit. Not done, in the order I would do them:

1. Announce hitting the edge of the line
2. Progress indicator (problem N of total)
3. Random problem generation
4. Difficulty levels
5. Move-count / efficiency scoring
6. Visual jump arcs
7. Automated accessibility and contrast testing

## Note on process

This was built AI-assisted. I made the design decisions above and can explain them.
