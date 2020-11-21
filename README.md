# Timebomb

Timebomb is a simple library for failing loudly after a certain amount of time has passed.

Available to JS, but coming soon to a language near you!

## Installation

`npm install --save timebomb-js`

## The Problem

Migrations leave TODOs all over the place. After a migration is completed, these todos linger on
for weeks, months, and years. If only there was a way to make absolutely sure that you revisited
them before a certain date...

## The solutions

Fail loudly and violently if the date passes.

```ts
import timebomb;

function foo(bar) {
  // Temporary workaround: bar.hack() is required because of x/y/z reasons
  timebomb.failAfter(Date("2021-10-30"));
  bar.hack();
}
```

This will provide a warning for a week before failing, and throw an error afterwards.

## That's frighteningly aggressive. Why would I risk downtime with such a thing?

Maybe you wouldn't in things like synchronous service requests, but you might in something like background jobs, where failures lead to less catastrophic outcomes.

For business-critical events where throwing an error isn't an option, there's also the ability to add arbitrary latency after a certain date:

```ts
import timebomb;

function foo(bar) {
  // Temporary workaround: bar.hack() is required because of x/y/z reasons
  timebomb.slowAfter(Date("2021-10-30"), 100);
  bar.hack();
}
```

This ensures that if some migration goes on too long, then the un-migrated code is far slower than
a refactored implementation.

If you need to force other people to move away from a deprecated method progressively, perhaps if you've got a deprecated endpoint or sdk method, you can specify a progressive latency increase. This will ensure that important requests get migrated first, followed by less important ones:

```ts
import timebomb;

function foo(bar) {
  // Temporary workaround: bar.hack() is required because of x/y/z reasons
  timebomb.slowAfter(Date("2021-10-30"), (daysLate) => 100 * daysLate);
  bar.hack();
}
```
