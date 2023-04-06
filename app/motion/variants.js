export const fadeInOut = {
  initial: {
    opacity: 0,
    transition: {
      when: "beforeChildren",
    },
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
    transition: {
      when: "afterChildren",
    },
  },
};

export const fadeInOutY = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
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
