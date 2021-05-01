export interface Config {
  warningPeriodInDays: number;
  warnFunction: (msg: string) => unknown;
  failFunction: (msg: string) => unknown;
  shouldDisableInProd: boolean;
  prodDetectFunction: () => boolean;
}

export class TimebombError extends Error {}

const prodDetectFunction = () => {
  if (typeof process !== "undefined") {
    return (
      process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod"
    );
  }
  return false;
};

let defaultConfig: Config = {
  warningPeriodInDays: 7,
  warnFunction: (msg: string) => console.warn(msg),
  failFunction: (msg: string) => {
    throw new TimebombError(msg);
  },
  shouldDisableInProd: false,
  prodDetectFunction,
};

export const updateDefaultConfig = (options: Partial<Config>) => {
  defaultConfig = {
    ...defaultConfig,
    ...options,
  };
};

export function getConfig(options: Partial<Config>): Config {
  const {
    warningPeriodInDays,
    warnFunction,
    failFunction,
    shouldDisableInProd,
    prodDetectFunction,
  } = {
    ...defaultConfig,
    ...options,
  };
  return {
    warningPeriodInDays,
    warnFunction,
    failFunction,
    shouldDisableInProd,
    prodDetectFunction,
  };
}

export function warnAfter(time: Date | string, options: Partial<Config> = {}) {
  const config = getConfig(options);
  if (config.shouldDisableInProd && config.prodDetectFunction()) {
    return;
  }
  if (!(time instanceof Date)) {
    time = new Date(time);
  }
  const diff = Date.now() - time.getTime();
  if (diff > 0) {
    config.warnFunction(`Timebomb expired after ${time.toUTCString()}`);
  }
}

export function failAfter(time: Date | string, options: Partial<Config> = {}) {
  const config = getConfig(options);
  if (config.shouldDisableInProd && config.prodDetectFunction()) {
    return;
  }
  if (!(time instanceof Date)) {
    time = new Date(time);
  }
  const diff = Date.now() - time.getTime();
  if (diff > 0) {
    config.failFunction(`Timebomb expired after ${time.toUTCString()}`);
  } else if (diff > -config.warningPeriodInDays * 24 * 60 * 60 * 1000) {
    config.warnFunction(
      `Warning: Timebomb will soon expire at ${time.toUTCString()}`
    );
  }
}

function wait(ms: number) {
  var start = Date.now(),
    now = start;
  while (now - start < ms) {
    now = Date.now();
  }
}

export function slowAfter(
  time: Date | string,
  delay: number | ((daysAfter: number) => number),
  options: Partial<Config> = {}
) {
  const config = getConfig(options);
  if (config.shouldDisableInProd && config.prodDetectFunction()) {
    return;
  }
  if (!(time instanceof Date)) {
    time = new Date(time);
  }
  const diff = Date.now() - time.getTime();
  const ms =
    typeof delay === "number" ? delay : delay(diff / (60 * 60 * 24 * 1000));
  if (diff > 0) {
    config.warnFunction(
      `Timebomb expired after ${time.toUTCString()}, slowing request by ${ms}ms`
    );
    wait(ms);
  } else if (diff > -config.warningPeriodInDays * 24 * 60 * 60 * 1000) {
    config.warnFunction(
      `Warning: Timebomb will soon start slowing request at ${time.toUTCString()}`
    );
  }
}
