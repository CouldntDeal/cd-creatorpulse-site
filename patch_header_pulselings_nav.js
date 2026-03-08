'use strict';
// patch_header_pulselings_nav.js
// Adds "Pulselings" nav link to header.html.
// Idempotent — skips if already present.

const fs   = require('fs');
const file = process.argv[2];
let c = fs.readFileSync(file, 'utf8');

// Guard
if (c.includes('leaderboard.html') || c.includes('Pulselings')) {
  // Already present — ensure label is "Pulselings" not "Leaderboard"
  if (c.includes('"leaderboard.html">Leaderboard')) {
    c = c.replace('"leaderboard.html">Leaderboard', '"leaderboard.html">Pulselings');
    fs.writeFileSync(file, c, 'utf8');
    console.log('UPDATED label: Leaderboard → Pulselings');
  } else {
    console.log('ALREADY PATCHED -- skipping');
  }
  process.exit(0);
}

const OLD = `        <a href="contact.html">Request Access</a>`;
const NEW = `        <a href="leaderboard.html">Pulselings</a>
        <a href="contact.html">Request Access</a>`;

if (!c.includes(OLD)) {
  console.error('PATCH MISS -- could not find Request Access anchor');
  process.exit(1);
}

c = c.replace(OLD, NEW);
fs.writeFileSync(file, c, 'utf8');
console.log('PATCHED OK');
