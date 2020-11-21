interface Config {
  warningPeriodInDays: number;
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
  const { warningPeriodInDays = 7 } = options;
  return {
    warningPeriodInDays,
  };
}

export function failAfter(time: Date, options: Partial<Config> = {}) {
  const { warningPeriodInDays } = getConfig(options);
  const diff = time.getTime() - Date.now();
  if (diff < 0) {
    throw new TimebombError(`Timebomb detonated after ${time.toUTCString()}`);
  } else if (diff > warningPeriodInDays * 60 * 60 * 24) {
    console.warn(
      `Warning: Timebomb will soon detonate at ${time.toUTCString()}`
    );
  }
}

export function slowAfter(
  time: Date,
  delay: number | ((daysAfter: number) => number),
  options: Partial<Config> = {}
) {
  const { warningPeriodInDays } = getConfig(options);
  const diff = time.getTime() - Date.now();
  const ms = typeof delay === "number" ? delay : delay(diff / (60 * 60 * 24));
  if (diff < 0) {
    console.warn(
      `Error: Timebomb has detonated at ${time.toUTCString()}, slowing request by ${ms}ms`
    );
    wait(ms);
  } else if (diff > warningPeriodInDays * 60 * 60 * 24) {
    console.warn(
      `Warning: Timebomb will soon start slowing request at ${time.toUTCString()}`
    );
  }
}
