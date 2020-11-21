# Timebomb

Timebomb is a simple library for failing loudly after a certain amount of time has passed.

JS installation via `npm install --save timebomb-js`

## The Problem

Migrations leave TODOs all over the place. After a migration is completed, these todos linger on
for weeks, months, and years. If only there was a way to make absolutely sure that you revisited
them before a certain date...

## The solution

Fail loudly and violently if the date passes.

This comes in 3 varieties, in increasing aggressiveness:

1. `warnAfter`
2. `slowAfter`
3. `failAfter`

### warnAfter

Timebomb provides the ability to throw a warning after a certain date:

```ts
import timebomb;

function foo(bar) {
  // Temporary workaround: bar.hack() is required because of x/y/z reasons
  timebomb.warnAfter(new Date("2021-10-30"), 100);
  bar.hack();
}
```

### slowAfter

Timebomb provides the ability to add arbitrary latency after a certain date:

```ts
import timebomb;

function foo(bar) {
  // Temporary workaround: bar.hack() is required because of x/y/z reasons
  timebomb.slowAfter(new Date("2021-10-30"), 100);
  bar.hack();
}
```

This ensures that if some migration goes on too long, then the un-migrated code is far slower than
a refactored implementation.

If you need to force other people to move away from a deprecated method progressively, perhaps if you've got a deprecated endpoint or sdk method, you can specify a progressive latency increase. This will ensure that important requests get migrated first, followed by less important ones:

```ts
import timebomb;

function deprecatedFoo(bar) {
  // Don't use this method after 2021-10-30, as it's being deprecated
  timebomb.slowAfter(new Date("2021-10-30"), (daysLate) => 100 * daysLate);
  bar.doSomethingWrong();
}
```

This will provide a warning for a week before failing, and slow the implementation afterwards.

### failAfter

If nothing else works, the most extreme option is to outright fail the request.

```ts
import timebomb;

function foo(bar) {
  // Temporary workaround: bar.hack() is required because of x/y/z reasons
  timebomb.failAfter(Date("2021-10-30"));
  bar.hack();
}
```

This will provide a warning for a week before failing, and throw an error afterwards.
