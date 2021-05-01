/// <reference path="./types/chai.d.ts" />
import { warnAfter, failAfter, slowAfter } from "../index";
import {
  warnAfter as warnAfterNonProd,
  failAfter as failAfterNonProd,
  slowAfter as slowAfterNonProd,
} from "../nonprod";

import { assert } from "chai";

describe("warnAfter function", () => {
  it("doesn't warn if unexpired", () => {
    let warning: string | undefined;
    const warnFunction = (msg: string) => (warning = msg);
    warnAfter(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), {
      warnFunction,
    });
    assert.isUndefined(warning);
  });

  it("warns if expired", () => {
    let warning: string | undefined;
    const warnFunction = (msg: string) => (warning = msg);
    warnAfter(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), { warnFunction });
    assert.isString(warning);
  });

  it("accepts date string", () => {
    let warning: string | undefined;
    const warnFunction = (msg: string) => (warning = msg);
    const dateStr = new Date(
      Date.now() - 3 * 24 * 60 * 60 * 1000
    ).toDateString();
    warnAfter(dateStr, { warnFunction });
    assert.isString(warning);
  });

  it("respects prodDetectFunction if using warnAfter nonprod version", () => {
    let warning: string | undefined;
    const warnFunction = (msg: string) => (warning = msg);
    warnAfterNonProd(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), {
      warnFunction,
      prodDetectFunction: () => true,
    });
    assert.isUndefined(warning);

    warnAfter(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), {
      warnFunction,
      prodDetectFunction: () => true,
    });
    assert.isString(warning);
  });
});

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
    failAfter(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), { warnFunction });
    assert.isString(warning);
  });

  it("throws if expired", () => {
    assert.throws(() => failAfter(new Date(Date.now() - 24 * 60 * 60 * 1000)));
  });

  it("throws if expired", () => {
    assert.throws(() => failAfter(new Date(Date.now() - 24 * 60 * 60 * 1000)));
  });

  it("respects prodDetectFunction if using failAfter nonprod version", () => {
    failAfterNonProd(new Date(Date.now() - 24 * 60 * 60 * 1000), {
      prodDetectFunction: () => true,
    });
    assert.throws(() =>
      failAfterNonProd(new Date(Date.now() - 24 * 60 * 60 * 1000), {
        prodDetectFunction: () => false,
      })
    );
    assert.throws(() =>
      failAfter(new Date(Date.now() - 24 * 60 * 60 * 1000), {
        prodDetectFunction: () => true,
      })
    );
  });

  it("warns if within warning period, using date string", () => {
    let warning: string | undefined;
    const warnFunction = (msg: string) => (warning = msg);
    const dateStr = new Date(
      Date.now() + 3 * 24 * 60 * 60 * 1000
    ).toDateString();
    failAfter(dateStr, { warnFunction });
    assert.isString(warning);
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
    slowAfter(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), 0, {
      warnFunction,
    });
    assert.isString(warning);
  });

  it("warns if within the warning period, using date string", () => {
    let warning: string | undefined;
    const warnFunction = (msg: string) => (warning = msg);
    const dateStr = new Date(
      Date.now() + 3 * 24 * 60 * 60 * 1000
    ).toDateString();
    slowAfter(dateStr, 0, {
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
    const warnFunction = () => {};
    const timeStart = Date.now();
    slowAfter(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), 20, {
      warnFunction,
    });
    const timeDelay = Date.now() - timeStart;
    assert.isAtLeast(timeDelay, 15);
    assert.isAtMost(timeDelay, 25);
  });

  it("delays by a lambda based on days", () => {
    const warnFunction = () => {};
    const timeStart = Date.now();
    slowAfter(
      new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      (days) => days * 10,
      { warnFunction }
    );
    const timeDelay = Date.now() - timeStart;
    assert.isAtLeast(timeDelay, 35);
    assert.isAtMost(timeDelay, 45);
  });

  it("respects prodDetectFunction if using slowAfter nonprod version", () => {
    let warning: string | undefined;
    const warnFunction = (msg: string) => (warning = msg);
    slowAfterNonProd(new Date(Date.now() - 24 * 60 * 60 * 1000), 0, {
      warnFunction,
      prodDetectFunction: () => true,
    });
    assert.isUndefined(warning);

    slowAfter(new Date(Date.now() - 24 * 60 * 60 * 1000), 0, {
      warnFunction,
      prodDetectFunction: () => true,
    });
    assert.isString(warning);
  });
});
