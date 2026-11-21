#!/usr/bin/env node
// Spring probe: prints preset equivalents and generates CSS linear() keyframes.
// Mapping is an implementation approximation, not an Apple-published constant.

import { commaArgs } from './lib/tokens.mjs';

const args = commaArgs();
const wantsHelp = args.includes('--help') || args.includes('-h');
const asJson = args.includes('--json');
const listAll = args.includes('--all');
const valueArg = args.find((arg) => arg.startsWith('--duration='));
const bounceArg = args.find((arg) => arg.startsWith('--bounce='));
const framesArg = args.find((arg) => arg.startsWith('--frames='));

const PRESETS = {
  standard: { duration: 0.35, bounce: 0.15, damping: 0.85, use: 'default spatial change' },
  control: { duration: 0.25, bounce: 0.20, damping: 0.70, use: 'button/toggle/segment' },
  calm: { duration: 0.40, bounce: 0.00, damping: 1.00, use: 'navigation, Reduce Motion alternative' },
  sheet: { duration: 0.50, bounce: 0.08, damping: 0.92, use: 'sheet present/dismiss' },
  list: { duration: 0.40, bounce: 0.10, damping: 0.90, use: 'list insert/delete' }
};

if (wantsHelp) {
  console.log(`apple-design motion-probe

Usage:
  node scripts/motion-probe.mjs --all
  node scripts/motion-probe.mjs --duration=0.35 --bounce=0.15 [--frames=24] [--json]

Prints:
  - SwiftUI .spring(duration:bounce:)
  - UIKit UIViewPropertyAnimator damping ratio
  - CSS cubic-bezier fallback
  - CSS linear() keyframes approximated from the spring`);
  process.exit(0);
}

// Apple's `bounce` parameter is normalized, not physical overshoot.
// These anchors match the house spring presets; interpolation fills gaps.
const DAMPING_ANCHORS = [
  [0, 1.00],
  [0.05, 0.95],
  [0.08, 0.92],
  [0.10, 0.90],
  [0.15, 0.85],
  [0.20, 0.70],
  [0.25, 0.60],
  [0.60, 0.40]
];

function dampingFromBounce(bounce) {
  const b = Math.min(Math.max(bounce, 0), 0.6);
  for (let i = 0; i < DAMPING_ANCHORS.length - 1; i += 1) {
    const [b0, d0] = DAMPING_ANCHORS[i];
    const [b1, d1] = DAMPING_ANCHORS[i + 1];
    if (b >= b0 && b <= b1) {
      if (b1 === b0) return d1;
      const t = (b - b0) / (b1 - b0);
      return d0 + (d1 - d0) * t;
    }
  }
  return DAMPING_ANCHORS[DAMPING_ANCHORS.length - 1][1];
}

function springSample(t, duration, bounce) {
  const zeta = dampingFromBounce(bounce);
  if (zeta >= 0.999) {
    const w = 5.8 / duration;
    const x = w * t;
    return 1 - Math.exp(-x) * (1 + x);
  }

  const w = 4 / (zeta * duration);
  const wd = w * Math.sqrt(1 - zeta * zeta);
  return 1 - Math.exp(-zeta * w * t) * (
    Math.cos(wd * t) + (zeta / Math.sqrt(1 - zeta * zeta)) * Math.sin(wd * t)
  );
}

function keyframes(duration, bounce, frames) {
  const points = [];
  const end = springSample(duration, duration, bounce) || 1;
  for (let i = 0; i <= frames; i += 1) {
    const ratio = i / frames;
    const t = ratio * duration;
    const value = springSample(t, duration, bounce) / end;
    points.push([Number(value.toFixed(4)), Number((ratio * 100).toFixed(1))]);
  }
  return `linear(${points.map(([value, percent]) => `${value} ${percent}%`).join(', ')})`;
}

function report(name, config, frames) {
  const damping = dampingFromBounce(config.bounce);
  const bezier = config.bounce <= 0.02
    ? 'cubic-bezier(0.2, 0.8, 0.2, 1)'
    : 'cubic-bezier(0.16, 1, 0.3, 1)';

  return {
    name,
    duration: config.duration,
    bounce: config.bounce,
    damping: Number(damping.toFixed(3)),
    use: config.use || 'custom',
    swift: `.spring(duration: ${config.duration.toFixed(2)}, bounce: ${config.bounce.toFixed(2)})`,
    uikit: `UIViewPropertyAnimator(duration: ${config.duration.toFixed(2)}, dampingRatio: ${damping.toFixed(2)})`,
    cssFallback: bezier,
    cssLinear: keyframes(config.duration, config.bounce, frames)
  };
}

const frames = Math.min(Math.max(Number(framesArg?.slice('--frames='.length) || 24), 8), 60);
let outputs;

if (listAll) {
  outputs = Object.entries(PRESETS).map(([name, config]) => report(name, config, frames));
} else {
  const duration = Number(valueArg?.slice('--duration='.length) || 0.35);
  const bounce = Number(bounceArg?.slice('--bounce='.length) || 0.15);
  if (!Number.isFinite(duration) || duration <= 0 || duration > 5) {
    console.error('Duration must be greater than 0 and at most 5 seconds.');
    process.exit(2);
  }
  if (!Number.isFinite(bounce) || bounce < 0 || bounce > 0.6) {
    console.error('Bounce must be between 0 and 0.6.');
    process.exit(2);
  }
  outputs = [report('custom', { duration, bounce }, frames)];
}

if (asJson) {
  console.log(JSON.stringify(outputs, null, 2));
} else {
  for (const item of outputs) {
    console.log(`Preset: ${item.name}`);
    console.log(`  use: ${item.use}`);
    console.log(`  duration: ${item.duration}s  bounce: ${item.bounce}  damping: ${item.damping}`);
    console.log(`  SwiftUI: ${item.swift}`);
    console.log(`  UIKit: ${item.uikit}`);
    console.log(`  CSS fallback: ${item.cssFallback}`);
    console.log(`  CSS linear(): ${item.cssLinear}`);
    console.log('');
  }
  console.log('Approximation only. Verify on device for final feel.');
}
