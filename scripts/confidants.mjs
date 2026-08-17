#!/usr/bin/env node
// Helper for wiring up confidant art. All art is stored as .webp.
//
//   npm run confidants
//     Reports which confidants are live and exactly which files are missing.
//
//   npm run confidants -- add <key> <idle> <smile> <grin> <star>
//     Converts four source images to .webp and writes them into
//     src/assets/characters/<key>/ under the names confidants.js expects.
//
//   npm run confidants -- convert
//     Converts any leftover .png under src/assets/characters/ to .webp.

import { readFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, extname, basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CHARACTERS_DIR = join(ROOT, 'src', 'assets', 'characters');
const CONFIDANTS_FILE = join(ROOT, 'src', 'confidants.js');

const FACES = ['idle', 'smile', 'grin', 'star'];
const SOURCE_EXTENSIONS = ['.png', '.webp', '.jpg', '.jpeg'];
const WEBP_OPTIONS = { quality: 90 };

// Pull the draft keys straight out of confidants.js so this can't drift
const readDrafts = () => {
  const source = readFileSync(CONFIDANTS_FILE, 'utf8');
  const start = source.indexOf('const DRAFT_CONFIDANTS = {');
  if (start === -1) return [];

  const block = source.slice(start, source.indexOf('\n};', start));
  const keys = [...block.matchAll(/key:\s*"([^"]+)"/g)].map(m => m[1]);
  const labels = [...block.matchAll(/label:\s*"([^"]+)"/g)].map(m => m[1]);

  return keys.map((key, i) => ({ key, label: labels[i] ?? key }));
};

const toWebp = (source, target) =>
  sharp(source).webp(WEBP_OPTIONS).toFile(target);

const walkPngs = (dir) => {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return walkPngs(full);
    return extname(full).toLowerCase() === '.png' ? [full] : [];
  });
};

const relative = (file) => file.slice(ROOT.length + 1);

// ── commands ────────────────────────────────────────────────────────────────

const report = () => {
  const drafts = readDrafts();
  if (drafts.length === 0) {
    console.log('No drafts found in src/confidants.js.');
    return;
  }

  let live = 0;

  for (const { key, label } of drafts) {
    const missing = FACES.filter(
      face => !existsSync(join(CHARACTERS_DIR, key, `${key}_${face}.webp`))
    );

    if (missing.length === 0) {
      live += 1;
      console.log(`  [live]    ${label} (${key})`);
    } else {
      const wanted = missing.map(face => `${key}_${face}.webp`).join(', ');
      console.log(`  [waiting] ${label} (${key}) — needs ${wanted}`);
    }
  }

  console.log(`\n${live}/${drafts.length} drafts are live.`);

  const strays = walkPngs(CHARACTERS_DIR).filter(
    png => !existsSync(png.replace(/\.png$/i, '.webp'))
  );
  if (strays.length > 0) {
    console.log(`${strays.length} .png file(s) have no .webp twin — run: npm run confidants -- convert`);
  }
};

const add = async (args) => {
  const [key, ...sources] = args;
  const drafts = readDrafts();

  if (!key || sources.length !== FACES.length) {
    console.error(`Usage: npm run confidants -- add <key> ${FACES.map(f => `<${f}>`).join(' ')}`);
    process.exit(1);
  }

  if (!drafts.some(d => d.key === key)) {
    console.error(`Unknown confidant "${key}". Known drafts: ${drafts.map(d => d.key).join(', ')}`);
    process.exit(1);
  }

  for (const source of sources) {
    if (!existsSync(source)) {
      console.error(`No such file: ${source}`);
      process.exit(1);
    }
    if (!SOURCE_EXTENSIONS.includes(extname(source).toLowerCase())) {
      console.error(`${source} must be one of: ${SOURCE_EXTENSIONS.join(', ')}`);
      process.exit(1);
    }
  }

  mkdirSync(join(CHARACTERS_DIR, key), { recursive: true });

  for (const [i, face] of FACES.entries()) {
    const source = sources[i];
    const target = join(CHARACTERS_DIR, key, `${key}_${face}.webp`);
    await toWebp(source, target);
    console.log(`  ${face.padEnd(6)} <- ${basename(source)}`);
  }

  console.log(`\n${key} is ready as .webp. Restart the dev server if it was already running.`);
};

const convert = async () => {
  const pngs = walkPngs(CHARACTERS_DIR);
  if (pngs.length === 0) {
    console.log('No .png files under src/assets/characters/.');
    return;
  }

  let converted = 0;
  let skipped = 0;

  for (const png of pngs) {
    const target = png.replace(/\.png$/i, '.webp');
    if (existsSync(target)) {
      skipped += 1;
      continue;
    }
    await toWebp(png, target);
    converted += 1;
    console.log(`  ${relative(target)}`);
  }

  console.log(`\nConverted ${converted} file(s).`);
  if (skipped > 0) {
    console.log(`Skipped ${skipped} .png that already had a .webp twin — those originals are redundant and safe to delete.`);
  }
};

// ── entry point ─────────────────────────────────────────────────────────────

const [command, ...args] = process.argv.slice(2);

try {
  if (command === 'add') await add(args);
  else if (command === 'convert') await convert();
  else if (command) {
    console.error(`Unknown command "${command}". Use no arguments, "add", or "convert".`);
    process.exit(1);
  } else report();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
