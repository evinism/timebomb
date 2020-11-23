/// <reference path="./types/chai.d.ts" />
import { failAfter, slowAfter, warnAfter, failAfterSync, slowAfterSync, warnAfterSync } from "../timebomb";
import { assert } from "chai";

describe("warnAfter function", () => {
  it("doesn't warn if unexpired", async () => {
    let warning: string | undefined;
    const warnFunction = (msg: string) => (warning = msg);
    await warnAfter(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), {
      warnFunction,
    });
    assert.isUndefined(warning);
  });

  it("warns if expired", async () => {
    let warning: string | undefined;
    const warnFunction = (msg: string) => (warning = msg);
    await warnAfter(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), { warnFunction });
    assert.isString(warning);
  });
});

describe("warnAfterSync function", () => {
  it("doesn't warn if unexpired", () => {
    let warning: string | undefined;
    const warnFunction = (msg: string) => (warning = msg);
    warnAfterSync(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), {
      warnFunction,
    });
    assert.isUndefined(warning);
  });

  it("warns if expired", () => {
    let warning: string | undefined;
    const warnFunction = (msg: string) => (warning = msg);
    warnAfterSync(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), { warnFunction });
    assert.isString(warning);
  });
});

describe("failAfter function", () => {
  it("doesn't warn outside the warning period", async () => {
    let warning: string | undefined;
    const warnFunction = (msg: string) => (warning = msg);
    await failAfter(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), {
      warnFunction,
    });
    assert.isUndefined(warning);
  });
  it("warns if within the warning period", async () => {
    let warning: string | undefined;
    const warnFunction = (msg: string) => (warning = msg);
    await failAfter(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), { warnFunction });
    assert.isString(warning);
  });

  it("throws if expired", (done) => {
    failAfter(new Date(Date.now() - 24 * 60 * 60 * 1000))
      .then(() => done("Expected to throw"))
      .catch(() => done())
  });
});

describe("failAfterSync function", () => {
  it("doesn't warn outside the warning period", () => {
    let warning: string | undefined;
    const warnFunction = (msg: string) => (warning = msg);
    failAfterSync(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), {
      warnFunction,
    });
    assert.isUndefined(warning);
  });
  it("warns if within the warning period", () => {
    let warning: string | undefined;
    const warnFunction = (msg: string) => (warning = msg);
    failAfterSync(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), { warnFunction });
    assert.isString(warning);
  });

  it("throws if expired", () => {
    assert.throws(() => failAfterSync(new Date(Date.now() - 24 * 60 * 60 * 1000)));
  });
});

describe("slowAfter function", () => {
  it("doesn't warn outside the warning period", async () => {
    let warning: string | undefined;
    const warnFunction = (msg: string) => (warning = msg);
    await slowAfter(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), 0, {
      warnFunction,
    });
    assert.isUndefined(warning);
  });

  it("warns if within the warning period", async () => {
    let warning: string | undefined;
    const warnFunction = (msg: string) => (warning = msg);
    await slowAfter(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), 0, {
      warnFunction,
    });
    assert.isString(warning);
  });

  it("warns if expired", async () => {
    let warning: string | undefined;
    const warnFunction = (msg: string) => (warning = msg);
    await slowAfter(new Date(Date.now() - 24 * 60 * 60 * 1000), 0, { warnFunction });
    assert.isString(warning);
  });

  it("delays by a certain amount if expired", async () => {
    const warnFunction = () => {};
    const timeStart = Date.now();
    await slowAfter(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), 40, {
      warnFunction,
    });
    const timeDelay = Date.now() - timeStart;
    assert.isAtLeast(timeDelay, 30);
    assert.isAtMost(timeDelay, 50);
  });

  it("delays by a lambda based on days", async () => {
    const warnFunction = () => {};
    const timeStart = Date.now();
    await slowAfter(
      new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      (days) => days * 10,
      { warnFunction }
    );
    const timeDelay = Date.now() - timeStart;
    assert.isAtLeast(timeDelay, 30);
    assert.isAtMost(timeDelay, 50);
  });
});


describe("slowAfterSync function", () => {
  it("doesn't warn outside the warning period", () => {
    let warning: string | undefined;
    const warnFunction = (msg: string) => (warning = msg);
    slowAfterSync(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), 0, {
      warnFunction,
    });
    assert.isUndefined(warning);
  });

  it("warns if within the warning period", () => {
    let warning: string | undefined;
    const warnFunction = (msg: string) => (warning = msg);
    slowAfterSync(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), 0, {
      warnFunction,
    });
    assert.isString(warning);
  });

  it("warns if expired", () => {
    let warning: string | undefined;
    const warnFunction = (msg: string) => (warning = msg);
    slowAfterSync(new Date(Date.now() - 24 * 60 * 60 * 1000), 0, { warnFunction });
    assert.isString(warning);
  });

  it("delays by a certain amount if expired", () => {
    const warnFunction = () => {};
    const timeStart = Date.now();
    slowAfterSync(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), 20, {
      warnFunction,
    });
    const timeDelay = Date.now() - timeStart;
    assert.isAtLeast(timeDelay, 15);
    assert.isAtMost(timeDelay, 25);
  });

  it("delays by a lambda based on days", () => {
    const warnFunction = () => {};
    const timeStart = Date.now();
    slowAfterSync(
      new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      (days) => days * 10,
      { warnFunction }
    );
    const timeDelay = Date.now() - timeStart;
    assert.isAtLeast(timeDelay, 35);
    assert.isAtMost(timeDelay, 45);
  });
});
