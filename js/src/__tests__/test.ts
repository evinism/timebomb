import { failAfter, slowAfter } from "../timebomb";
import { assert } from "chai";

describe("failAfter function", () => {
  it("doesn't warn outside the warning period", () => {
    let warning: string | undefined;
    const warnFunction = (msg: string) => (warning = msg);
    failAfter(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), {
      warnFunction,
    });
    assert.isUndefined(warning);
  });
  it("warns if within the warning period", () => {
    let warning: string | undefined;
    const warnFunction = (msg: string) => (warning = msg);
    failAfter(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), { warnFunction });
    assert.isString(warning);
  });

  it("throws if expired", () => {
    assert.throws(() => failAfter(new Date(Date.now() - 24 * 60 * 60 * 1000)));
  });
});

describe("slowAfter function", () => {
  it("doesn't warn outside the warning period", () => {
    let warning: string | undefined;
    const warnFunction = (msg: string) => (warning = msg);
    slowAfter(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), 0, {
      warnFunction,
    });
    assert.isUndefined(warning);
  });

  it("warns if within the warning period", () => {
    let warning: string | undefined;
    const warnFunction = (msg: string) => (warning = msg);
    slowAfter(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), 0, {
      warnFunction,
    });
    assert.isString(warning);
  });

  it("warns if expired", () => {
    let warning: string | undefined;
    const warnFunction = (msg: string) => (warning = msg);
    slowAfter(new Date(Date.now() - 24 * 60 * 60 * 1000), 0, { warnFunction });
    assert.isString(warning);
  });

  it("delays by a certain amount if expired", () => {
    const timeStart = Date.now();
    slowAfter(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), 20);
    const timeDelay = Date.now() - timeStart;
    assert.isAtLeast(timeDelay, 15);
    assert.isAtMost(timeDelay, 25);
  });

  it("delays by a lambda based on days", () => {
    const timeStart = Date.now();
    slowAfter(
      new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      (days) => days * 10
    );
    const timeDelay = Date.now() - timeStart;
    assert.isAtLeast(timeDelay, 35);
    assert.isAtMost(timeDelay, 45);
  });
});
