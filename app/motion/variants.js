import { easeIn, easeOut } from "./ease";

export const parentVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      duration: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      when: "afterChildren",
      delay: 0.1,
    },
  },
};

export const fadeInOut = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      easings: easeIn,
    },
  },
};

export const fadeInOutY = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05 + 0.15,
      easings: easeOut,
    },
  }),
  exit: (i = 0) => ({
    opacity: 0,
    y: -20,
    transition: {
      delay: i * 0.05,
      easings: easeIn,
    },
  }),
};

export const scaleInY = {
  initial: {
    scale: 0,
    y: 20,
  },
  animate: {
    scale: 1,
    y: 0,
  },
  exit: {
    scale: 0,
    y: -20,
  },
};
