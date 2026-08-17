#!/usr/bin/env node
// Helper for wiring up confidant art. All art is stored as .webp.
//
//   npm run confidants
//     Reports which confidants are live, ready to add, or still missing art.
//
//   npm run confidants -- add <key>
//     Picks up <key>_neutral / _happy / _smug / _excited from your Downloads
//     folder, converts them to .webp and writes them into
//     src/assets/characters/<key>/ under the names confidants.js expects.
//
//   npm run confidants -- add            (no key)
//     Does the above for every draft whose four files are already downloaded.
//
//   npm run confidants -- add <key> <idle> <smile> <grin> <star>
//     Same, but with explicit source paths instead of the naming convention.
//
//   npm run confidants -- convert
//     Converts any leftover .png under src/assets/characters/ to .webp.
//
// Add --from <dir> to any `add` to search somewhere other than Downloads.

import { readFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, extname, basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CHARACTERS_DIR = join(ROOT, 'src', 'assets', 'characters');
const CONFIDANTS_FILE = join(ROOT, 'src', 'confidants.js');
const DOWNLOADS = join(homedir(), 'Downloads');

const FACES = ['idle', 'smile', 'grin', 'star'];

// What each face is called in a downloaded file, e.g. ann_neutral.png -> idle
const DOWNLOAD_NAMES = {
  idle: 'neutral',
  smile: 'happy',
  grin: 'smug',
  star: 'excited',
};

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

// Accepts either the download name (ann_neutral) or the face name (ann_idle)
const findSource = (dir, key, face) => {
  for (const stem of [DOWNLOAD_NAMES[face], face]) {
    for (const ext of SOURCE_EXTENSIONS) {
      const file = join(dir, `${key}_${stem}${ext}`);
      if (existsSync(file)) return file;
    }
  }
  return null;
};

const findAllSources = (dir, key) => {
  const found = FACES.map(face => findSource(dir, key, face));
  return found.every(Boolean) ? found : null;
};

const isLive = key =>
  FACES.every(face => existsSync(join(CHARACTERS_DIR, key, `${key}_${face}.webp`)));

const toWebp = (source, target) => sharp(source).webp(WEBP_OPTIONS).toFile(target);

const walkPngs = (dir) => {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return walkPngs(full);
    return extname(full).toLowerCase() === '.png' ? [full] : [];
  });
};

const relative = file => file.slice(ROOT.length + 1);

// ── commands ────────────────────────────────────────────────────────────────

const report = (searchDir) => {
  const drafts = readDrafts();
  if (drafts.length === 0) {
    console.log('No drafts found in src/confidants.js.');
    return;
  }

  let live = 0;
  let ready = 0;

  for (const { key, label } of drafts) {
    if (isLive(key)) {
      live += 1;
      console.log(`  [live]    ${label} (${key})`);
      continue;
    }

    if (findAllSources(searchDir, key)) {
      ready += 1;
      console.log(`  [ready]   ${label} (${key}) — run: npm run confidants -- add ${key}`);
      continue;
    }

    const missing = FACES
      .filter(face => !findSource(searchDir, key, face))
      .map(face => `${key}_${DOWNLOAD_NAMES[face]}`);
    console.log(`  [waiting] ${label} (${key}) — download ${missing.join(', ')}`);
  }

  console.log(`\n${live}/${drafts.length} drafts are live.`);
  if (ready > 0) {
    console.log(`${ready} ready to add — or run: npm run confidants -- add`);
  }
  console.log(`Looking for downloads in ${searchDir}`);

  const strays = walkPngs(CHARACTERS_DIR).filter(
    png => !existsSync(png.replace(/\.png$/i, '.webp'))
  );
  if (strays.length > 0) {
    console.log(`${strays.length} .png file(s) have no .webp twin — run: npm run confidants -- convert`);
  }
};

const install = async (key, sources) => {
  mkdirSync(join(CHARACTERS_DIR, key), { recursive: true });

  for (const [i, face] of FACES.entries()) {
    const target = join(CHARACTERS_DIR, key, `${key}_${face}.webp`);
    await toWebp(sources[i], target);
    console.log(`  ${face.padEnd(6)} <- ${basename(sources[i])}`);
  }
};

const add = async (args, searchDir) => {
  const drafts = readDrafts();
  const [key, ...sources] = args;

  // No key: add every draft whose four files are already downloaded
  if (!key) {
    const pending = drafts.filter(d => !isLive(d.key));
    const found = pending
      .map(d => ({ ...d, sources: findAllSources(searchDir, d.key) }))
      .filter(d => d.sources);

    if (found.length === 0) {
      console.error(`Nothing ready to add in ${searchDir}.`);
      console.error(`Expected files named <key>_${Object.values(DOWNLOAD_NAMES).join(' / <key>_')}`);
      process.exit(1);
    }

    for (const { key: k, label } of found) {
      console.log(`${label} (${k}):`);
      await install(k, found.find(f => f.key === k).sources);
      console.log('');
    }

    console.log(`Added ${found.length} confidant(s). Restart the dev server if it was already running.`);
    return;
  }

  if (!drafts.some(d => d.key === key)) {
    console.error(`Unknown confidant "${key}". Known drafts: ${drafts.map(d => d.key).join(', ')}`);
    process.exit(1);
  }

  let resolved = sources;

  if (sources.length === 0) {
    resolved = findAllSources(searchDir, key);
    if (!resolved) {
      const missing = FACES
        .filter(face => !findSource(searchDir, key, face))
        .map(face => `${key}_${DOWNLOAD_NAMES[face]}`);
      console.error(`Missing in ${searchDir}: ${missing.join(', ')}`);
      console.error(`(any of ${SOURCE_EXTENSIONS.join(', ')})`);
      process.exit(1);
    }
  } else if (sources.length !== FACES.length) {
    console.error(`Usage: npm run confidants -- add ${key}`);
    console.error(`   or: npm run confidants -- add ${key} ${FACES.map(f => `<${f}>`).join(' ')}`);
    process.exit(1);
  } else {
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
  }

  await install(key, resolved);
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

const argv = process.argv.slice(2);

let searchDir = DOWNLOADS;
const fromIndex = argv.indexOf('--from');
if (fromIndex !== -1) {
  searchDir = resolve(argv[fromIndex + 1] ?? '');
  argv.splice(fromIndex, 2);
}

const [command, ...args] = argv;

try {
  if (command === 'add') await add(args, searchDir);
  else if (command === 'convert') await convert();
  else if (command) {
    console.error(`Unknown command "${command}". Use no arguments, "add", or "convert".`);
    process.exit(1);
  } else report(searchDir);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
