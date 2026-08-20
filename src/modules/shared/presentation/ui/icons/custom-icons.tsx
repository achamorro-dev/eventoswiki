import type { IconProps } from './create-icon'

/**
 * Icons Iconoir doesn't ship. Drawn on the same 24x24 grid with the same
 * stroke weight and round caps so they sit flush with the rest of the set.
 * Paths from Tabler Icons (MIT).
 */
const createStrokeIcon = (paths: readonly string[]) =>
  function StrokeIcon({ size = '1em', width, height, ...props }: IconProps) {
    return (
      <svg
        width={width ?? size}
        height={height ?? size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        color="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        {...props}
      >
        {paths.map(d => (
          <path key={d} d={d} />
        ))}
      </svg>
    )
  }

export const Ticket = /*#__PURE__*/ createStrokeIcon([
  'M15 5l0 2',
  'M15 11l0 2',
  'M15 17l0 2',
  'M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-3a2 2 0 0 0 0 -4v-3a2 2 0 0 1 2 -2',
])

export const Twitch = /*#__PURE__*/ createStrokeIcon([
  'M4 5v11a1 1 0 0 0 1 1h2v4l4 -4h5.584c.266 0 .52 -.105 .707 -.293l2.415 -2.414c.187 -.188 .293 -.442 .293 -.708v-8.585a1 1 0 0 0 -1 -1h-14a1 1 0 0 0 -1 1z',
  'M16 8l0 4',
  'M12 8l0 4',
])

export const Meetup = /*#__PURE__*/ createStrokeIcon([
  'M5.455 10.82c.935 -2.163 3.045 -3.82 5.545 -3.82c2.104 0 2.844 1.915 2 4l-2 6',
  'M6.981 7l-3.981 9.914',
  'M13 11c.937 -2.16 3.071 -3.802 5.42 -3.972c2.104 0 3.128 1.706 2.284 3.792l-2.454 6.094c-.853 1.676 .75 2.586 2.75 2.086',
])

export const Loader = /*#__PURE__*/ createStrokeIcon(['M12 3a9 9 0 1 0 9 9'])

const HEADING_BARS = ['M4 6v12', 'M12 6v12', 'M11 18h2', 'M3 18h2', 'M4 12h8', 'M3 6h2', 'M11 6h2']

export const TextHTwo = /*#__PURE__*/ createStrokeIcon([
  'M17 12a2 2 0 1 1 4 0c0 .591 -.417 1.318 -.816 1.858l-3.184 4.143l4 0',
  ...HEADING_BARS,
])

export const TextHThree = /*#__PURE__*/ createStrokeIcon([
  'M19 14a2 2 0 1 0 -2 -2',
  'M17 16a2 2 0 1 0 2 -2',
  ...HEADING_BARS,
])

export const TextHFour = /*#__PURE__*/ createStrokeIcon(['M20 18v-8l-4 6h5', ...HEADING_BARS])
