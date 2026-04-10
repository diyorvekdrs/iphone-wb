/** Apple-like easing */
export const easeApple = [0.22, 1, 0.36, 1]

/** Staggered fade + slight rise — use with `custom` index */
export const textFadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: typeof i === 'number' ? Math.min(i * 0.06, 0.42) : 0,
      duration: 0.48,
      ease: easeApple,
    },
  }),
}

/** Hero-style headline */
export const textBlurUp = {
  hidden: { opacity: 0, y: 22, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.62, ease: easeApple },
  },
}

export const textBlurUpReduced = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeApple },
  },
}

export const staggerFast = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
}

/** Compare page: clearer rise from below (y → 0). */
export const compareRise = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.68, ease: easeApple },
  },
}

export const compareRiseReduced = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: easeApple },
  },
}

/** Compare headlines / hero spec lines — blur + rise from below. */
export const compareBlurUp = {
  hidden: { opacity: 0, y: 36, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: easeApple },
  },
}

export const compareBlurUpReduced = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: easeApple },
  },
}

/**
 * Stagger children top → bottom; each child still rises from below via `compareRise`.
 */
export const staggerCompareColumn = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
      staggerDirection: 1,
    },
  },
}

/** Three compare columns — left to right after scroll into view. */
export const staggerCompareGrid = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
      staggerDirection: 1,
    },
  },
}
