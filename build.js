#!/usr/bin/env node
'use strict';

/**
 * build.js — Encrypt pitch deck for GitHub Pages deployment.
 *
 * Reads index.html, extracts the inner HTML of <div id="deck">,
 * encrypts it with AES-256-GCM (key derived via PBKDF2-SHA256),
 * and writes dist/index.html with an empty deck + encrypted payload.
 * Static assets are copied to dist/ as-is.
 *
 * Usage:
 *   DECK_PASSWORD=yourpassword node build.js
 */

const { webcrypto } = require('crypto');
const { subtle } = webcrypto;
const fs   = require('fs');
const path = require('path');

const DECK_OPEN  = '<div id="deck">';
const DECK_CLOSE = '</div><!-- #deck -->';
const PBKDF2_ITERATIONS = 200000;

async function main() {
  const password = process.env.DECK_PASSWORD;
  if (!password) {
    process.stderr.write('Error: DECK_PASSWORD environment variable is required.\n');
    process.exit(1);
  }

  const html = fs.readFileSync('index.html', 'utf8');

  const openIdx  = html.indexOf(DECK_OPEN);
  const closeIdx = html.lastIndexOf(DECK_CLOSE);

  if (openIdx === -1 || closeIdx === -1) {
    process.stderr.write(
      'Error: Could not locate <div id="deck"> / </div><!-- #deck --> markers in index.html\n'
    );
    process.exit(1);
  }

  const deckInner = html.slice(openIdx + DECK_OPEN.length, closeIdx);

  // --- Encrypt ---
  const enc  = new TextEncoder();
  const salt = new Uint8Array(16);
  const iv   = new Uint8Array(12);
  webcrypto.getRandomValues(salt);
  webcrypto.getRandomValues(iv);

  const keyMaterial = await subtle.importKey(
    'raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']
  );
  const key = await subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  const ciphertext = await subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(deckInner)
  );

  const toB64 = buf => Buffer.from(buf).toString('base64');
  const payload = JSON.stringify({
    s: toB64(salt),
    v: toB64(iv),
    c: toB64(new Uint8Array(ciphertext))
  });

  // --- Build output HTML ---
  // Deck div is left empty; encrypted payload is injected as a hidden JSON script tag.
  const payloadTag =
    `<script id="__enc__" type="application/json">${payload}</script>`;

  const outHtml =
    html.slice(0, openIdx + DECK_OPEN.length) +
    '\n' +
    html.slice(closeIdx).replace(DECK_CLOSE, DECK_CLOSE + '\n  ' + payloadTag);

  // --- Write dist ---
  fs.mkdirSync('dist', { recursive: true });
  fs.writeFileSync('dist/index.html', outHtml, 'utf8');
  console.log('  dist/index.html written (deck encrypted, ' +
    Math.round(deckInner.length / 1024) + ' KB plaintext -> ' +
    Math.round(payload.length / 1024) + ' KB ciphertext)');

  // --- Copy static assets ---
  const assets = ['styles.css', 'script.js', 'logos', 'team_images', 'Assets'];
  for (const asset of assets) {
    if (!fs.existsSync(asset)) {
      console.warn(`  skipping ${asset} (not found)`);
      continue;
    }
    const dest = path.join('dist', asset);
    fs.cpSync(asset, dest, { recursive: true, force: true });
    console.log(`  copied ${asset} -> dist/${asset}`);
  }

  console.log('Build complete.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
