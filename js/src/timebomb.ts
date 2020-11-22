interface Config {
  warningPeriodInDays: number;
  warnFunction: (msg: string) => unknown;
  failFunction: (msg: string) => unknown;
}

function wait(ms: number) {
  var start = Date.now(),
    now = start;
  while (now - start < ms) {
    now = Date.now();
  }
}

export class TimebombError extends Error {}

export function getConfig(options: Partial<Config>): Config {
  const {
    warningPeriodInDays = 7,
    warnFunction = (msg: string) => console.warn(msg),
    failFunction = (msg: string) => {
      throw new TimebombError(msg);
    },
  } = options;
  return {
    warningPeriodInDays,
    warnFunction,
    failFunction,
  };
}

export function warnAfter(time: Date, options: Partial<Config> = {}) {
  const config = getConfig(options);
  const diff = Date.now() - time.getTime();
  if (diff > 0) {
    config.warnFunction(`Timebomb expired after ${time.toUTCString()}`);
  }
}

export function failAfter(time: Date, options: Partial<Config> = {}) {
  const config = getConfig(options);
  const diff = Date.now() - time.getTime();
  if (diff > 0) {
    config.failFunction(`Timebomb expired after ${time.toUTCString()}`);
  } else if (diff > -config.warningPeriodInDays * 24 * 60 * 60 * 1000) {
    config.warnFunction(
      `Warning: Timebomb will soon expire at ${time.toUTCString()}`
    );
  }
}

export function slowAfter(
  time: Date,
  delay: number | ((daysAfter: number) => number),
  options: Partial<Config> = {}
) {
  const config = getConfig(options);
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
