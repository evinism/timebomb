interface Config {
  warningPeriodInDays: number;
  warnFunction: (msg: string) => unknown;
  failFunction: (msg: string) => unknown;
}

function wait(ms: number) {
  return new Promise(res => {
    setTimeout(res, ms)
  })
}

function waitSync(ms: number) {
  var start = Date.now(),
    now = start;
  while (now - start < ms) {
    now = Date.now();
  }
}

export class TimebombError extends Error { }

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

export async function warnAfter(time: Date, options: Partial<Config> = {}) {
  warnAfterSync(time, options);
}

export function warnAfterSync(time: Date, options: Partial<Config> = {}) {
  const config = getConfig(options);
  const diff = Date.now() - time.getTime();
  if (diff > 0) {
    config.warnFunction(`Timebomb expired after ${time.toUTCString()}`);
  }
}

export async function failAfter(time: Date, options: Partial<Config> = {}) {
  failAfterSync(time, options);
}

export function failAfterSync(time: Date, options: Partial<Config> = {}) {
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

export async function slowAfter(
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
    await wait(ms);
  } else if (diff > -config.warningPeriodInDays * 24 * 60 * 60 * 1000) {
    config.warnFunction(
      `Warning: Timebomb will soon start slowing request at ${time.toUTCString()}`
    );
  }
}

export function slowAfterSync(
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
    waitSync(ms);
  } else if (diff > -config.warningPeriodInDays * 24 * 60 * 60 * 1000) {
    config.warnFunction(
      `Warning: Timebomb will soon start slowing request at ${time.toUTCString()}`
    );
  }
}
