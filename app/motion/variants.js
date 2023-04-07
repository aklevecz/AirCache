import { easeIn } from "./ease";

export const parentVariants = {
  initial: {
    opacity: 0,
    transition: {
      when: "beforeChildren",
      duration: 0.001,
    },
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
    transition: {
      when: "afterChildren",
      delay: 0.2,
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
      delay: i * 0.05,
    },
  }),
  exit: (i = 0) => ({
    opacity: 0,
    y: -20, //somehow there's a performance issue with this
    transition: {
      delay: i * 0.05,
    },
  }),
  exit: {
    opacity: 0,
  },
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
