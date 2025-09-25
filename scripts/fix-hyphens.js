#!/usr/bin/env node

import fs from "fs";
import path from "path";

// Legitimate hyphenated words that should be preserved
const LEGITIMATE_HYPHENS = new Set([
  // Creatures
  "saber-toothed",
  "cave-bear",
  "dire-wolf",
  "owlbear-cub",

  // Numbers
  "twenty-five",
  "thirty-six",
  "forty-five",
  "fifty-five",
  "sixty-six",
  "seventy-seven",
  "eighty-eight",
  "ninety-nine",

  // Measurements (will be handled by pattern matching)
  "one-foot",
  "two-foot",
  "three-foot",
  "four-foot",
  "five-foot",
  "six-foot",
  "seven-foot",
  "eight-foot",
  "nine-foot",
  "ten-foot",
  "eleven-foot",
  "twelve-foot",
  "fifteen-foot",
  "twenty-foot",
  "twenty-five-foot",
  "thirty-foot",
  "forty-foot",
  "fifty-foot",
  "sixty-foot",
  "seventy-foot",
  "eighty-foot",
  "ninety-foot",

  // Weapons and items
  "war-hammer",
  "battle-axe",
  "hand-axe",
  "cross-bow",
  "long-bow",
  "short-bow",
  "long-sword",
  "short-sword",

  // Character types
  "half-elf",
  "half-orc",
  "half-dragon",
  "were-wolf",
  "were-bear",

  // Common compounds
  "well-known",
  "long-term",
  "short-term",
  "high-level",
  "low-level",
  "first-level",
  "second-level",
  "third-level",
  "multi-attack",
  "self-destruct",
  "non-magical",
  "anti-magic",
  "counter-attack",

  // Conditions and effects
  "spell-like",
  "damage-dealing",
  "mind-affecting",
]);

// Pattern for measurements (number + hyphen + foot/feet/inch/etc)
const MEASUREMENT_PATTERN =
  /\b(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|twenty|twenty-five|thirty|forty|fifty|sixty|seventy|eighty|ninety|\d+)-(?:foot|feet|inch|inches|mile|miles)\b/gi;

// Pattern for number-based measurements
const NUMERIC_MEASUREMENT_PATTERN =
  /\b\d+-(?:foot|feet|inch|inches|mile|miles|pound|pounds|level|day|days|hour|hours)\b/gi;

// Common word endings that indicate broken words
const BROKEN_WORD_PATTERNS = [
  // Common prefixes that shouldn't be split
  { pattern: /\bsuc-ceed\b/gi, replacement: "succeed" },
  { pattern: /\bdes-cription\b/gi, replacement: "description" },
  { pattern: /\bdescrip-tion\b/gi, replacement: "description" },
  { pattern: /\bdesti-nation\b/gi, replacement: "destination" },
  { pattern: /\bdura-tion\b/gi, replacement: "duration" },
  { pattern: /\bsur-rounded\b/gi, replacement: "surrounded" },
  { pattern: /\bes-cape\b/gi, replacement: "escape" },
  { pattern: /\bGrap-pled\b/gi, replacement: "Grappled" },
  { pattern: /\babo-leth\b/gi, replacement: "aboleth" },
  { pattern: /\bcon-dition\b/gi, replacement: "condition" },
  { pattern: /\belemen-tal\b/gi, replacement: "elemental" },
  { pattern: /\bac-tion\b/gi, replacement: "action" },
  { pattern: /\bcrea-ture\b/gi, replacement: "creature" },
  { pattern: /\bdam-age\b/gi, replacement: "damage" },
  { pattern: /\battack-ing\b/gi, replacement: "attacking" },
  { pattern: /\bdefend-ing\b/gi, replacement: "defending" },
];

function isLegitimateHyphen(word) {
  const lowerWord = word.toLowerCase();

  // Check whitelist
  if (LEGITIMATE_HYPHENS.has(lowerWord)) {
    return true;
  }

  // Check measurement patterns
  if (MEASUREMENT_PATTERN.test(word) || NUMERIC_MEASUREMENT_PATTERN.test(word)) {
    return true;
  }

  // Check for compound adjectives with numbers
  if (/\b\d+-\w+\b/.test(word) && !/\w-\w/.test(word.replace(/\d+-\w+/, ""))) {
    return true;
  }

  return false;
}

function fixHyphens(text) {
  let result = text;

  // First, apply specific broken word patterns
  for (const { pattern, replacement } of BROKEN_WORD_PATTERNS) {
    result = result.replace(pattern, replacement);
  }

  // Then, handle remaining hyphens more carefully
  // This regex finds hyphenated words
  result = result.replace(/\b(\w+)-(\w+)\b/g, (match, before, after) => {
    // If it's a legitimate hyphen, keep it
    if (isLegitimateHyphen(match)) {
      return match;
    }

    // Check if combining the words makes sense (basic check)
    const combined = before + after;

    // If the combined word looks like a common broken word pattern, combine it
    if (isLikelyBrokenWord(before, after, combined)) {
      return combined;
    }

    // If unsure, preserve the hyphen (safer approach)
    return match;
  });

  return result;
}

function isLikelyBrokenWord(before, after, combined) {
  // Check for common patterns that indicate broken words

  // Very short parts (likely syllables)
  if (before.length <= 2 || after.length <= 2) {
    return true;
  }

  // Common suffixes
  const commonSuffixes = ["ing", "ed", "er", "est", "ly", "tion", "sion", "ness", "ment", "able", "ible"];
  if (commonSuffixes.some((suffix) => after.endsWith(suffix))) {
    return true;
  }

  // Common prefixes
  const commonPrefixes = ["un", "re", "pre", "dis", "mis", "over", "under", "out"];
  if (commonPrefixes.some((prefix) => before.startsWith(prefix))) {
    return true;
  }

  // Vowel patterns that suggest syllable breaks
  if (!before.match(/[aeiou]$/) && after.match(/^[aeiou]/)) {
    return true;
  }

  return false;
}

function processFile(filePath) {
  console.log(`Processing ${filePath}...`);

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");
  const fixedContent = fixHyphens(content);

  if (content !== fixedContent) {
    // Create backup
    const backupPath = filePath + ".backup";
    fs.writeFileSync(backupPath, content);
    console.log(`Backup created: ${backupPath}`);

    // Write fixed content
    fs.writeFileSync(filePath, fixedContent);
    console.log(`Fixed hyphens in ${filePath}`);

    // Show some differences
    const changes = countChanges(content, fixedContent);
    console.log(`Made ${changes} hyphen fixes`);
  } else {
    console.log(`No changes needed in ${filePath}`);
  }
}

function countChanges(original, fixed) {
  // Simple change counter
  const originalHyphens = (original.match(/-/g) || []).length;
  const fixedHyphens = (fixed.match(/-/g) || []).length;
  return originalHyphens - fixedHyphens;
}

// Main execution
const __filename = new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "..", "data");
const files = [
  path.join(dataDir, "spells.txt"),
  path.join(dataDir, "monsters.txt"),
  path.join(dataDir, "spells.json"),
  path.join(dataDir, "monsters-legendary.json"),
];

console.log("Starting hyphen fix process...\n");

files.forEach(processFile);

console.log("\nHyphen fix process completed!");
console.log("Note: Backups have been created with .backup extension");
