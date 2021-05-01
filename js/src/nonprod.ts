import {
  warnAfter as warnAfterBase,
  slowAfter as slowAfterBase,
  failAfter as failAfterBase,
} from "./timebomb";

export const warnAfter: typeof warnAfterBase = (time, options) => {
  options = {
    ...options,
    shouldDisableInProd: true,
  };
  warnAfterBase(time, options);
};
export const slowAfter: typeof slowAfterBase = (time, delay, options) => {
  options = {
    ...options,
    shouldDisableInProd: true,
  };
  slowAfterBase(time, delay, options);
};
export const failAfter: typeof failAfterBase = (time, options) => {
  options = {
    ...options,
    shouldDisableInProd: true,
  };
  failAfterBase(time, options);
};

export default {
  warnAfter,
  slowAfter,
  failAfter,
};
