import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const progressFile = join(rootDir, "progress.json");
const readmePath = join(rootDir, "README.md");

interface Progress {
  [day: string]: { part1: boolean; part2: boolean };
}

function loadProgress(): Progress {
  if (existsSync(progressFile)) {
    return JSON.parse(readFileSync(progressFile, "utf-8"));
  }
  return {};
}

function saveProgress(progress: Progress) {
  writeFileSync(progressFile, JSON.stringify(progress, null, 2) + "\n");
}

function updateReadme(progress: Progress) {
  const readme = readFileSync(readmePath, "utf-8");

  // Generate table rows for days 1-12
  const rows: string[] = [];
  for (let day = 1; day <= 12; day++) {
    const dayStr = day.toString().padStart(2, "0");
    const dayProgress = progress[dayStr] || { part1: false, part2: false };
    const p1 = dayProgress.part1 ? "⭐" : "⬜";
    const p2 = dayProgress.part2 ? "⭐" : "⬜";
    rows.push(`| ${dayStr}  | ${p1}     | ${p2}     |`);
  }

  // Find and replace the progress table
  const tableHeader = "| Day | Part 1 | Part 2 |";
  const tableSeparator = "| --- | ------ | ------ |";
  const tableRegex = /\| Day \| Part 1 \| Part 2 \|[\s\S]*?(?=\n\n|$)/;

  const newTable = [tableHeader, tableSeparator, ...rows].join("\n");

  const updatedReadme = readme.replace(tableRegex, newTable);
  writeFileSync(readmePath, updatedReadme);
}

function countStars(progress: Progress): number {
  return Object.values(progress).reduce(
    (sum, p) => sum + (p.part1 ? 1 : 0) + (p.part2 ? 1 : 0),
    0
  );
}

function showUsage() {
  console.log("\n⭐ Progress Tracker ⭐\n");
  console.log("Usage:");
  console.log("  npm run star <day> [part]    Mark part(s) as solved");
  console.log("  npm run unstar <day> [part]  Mark part(s) as unsolved");
  console.log("  npm run progress             Show current progress");
  console.log("\nExamples:");
  console.log("  npm run star 1               Mark both parts of day 1 as solved");
  console.log("  npm run star 1 1             Mark day 1 part 1 as solved");
  console.log("  npm run star 1 2             Mark day 1 part 2 as solved");
  console.log("  npm run unstar 3 1           Mark day 3 part 1 as unsolved");
}

function showProgress(progress: Progress) {
  const stars = countStars(progress);
  console.log(`\n🎄 Advent of Code 2025 Progress: ${stars}/24 ⭐\n`);

  for (let day = 1; day <= 12; day++) {
    const dayStr = day.toString().padStart(2, "0");
    const p = progress[dayStr];
    if (p && (p.part1 || p.part2)) {
      const p1 = p.part1 ? "⭐" : "⬜";
      const p2 = p.part2 ? "⭐" : "⬜";
      console.log(`  Day ${dayStr}: ${p1} ${p2}`);
    }
  }

  if (stars === 0) {
    console.log("  No stars yet! Run: npm run star <day> [part]");
  }
  console.log();
}

async function run() {
  const args = process.argv.slice(2);
  const command = args[0];

  const progress = loadProgress();

  if (!command || command === "show") {
    showProgress(progress);
    return;
  }

  if (command === "help" || command === "--help" || command === "-h") {
    showUsage();
    return;
  }

  const isStar = command === "star";
  const isUnstar = command === "unstar";

  if (!isStar && !isUnstar) {
    // Assume first arg is day number for "star" action
    const day = parseInt(command);
    if (!isNaN(day) && day >= 1 && day <= 12) {
      const part = args[1];
      const dayStr = day.toString().padStart(2, "0");

      if (!progress[dayStr]) {
        progress[dayStr] = { part1: false, part2: false };
      }

      if (!part || part === "1") progress[dayStr].part1 = true;
      if (!part || part === "2") progress[dayStr].part2 = true;

      saveProgress(progress);
      updateReadme(progress);

      const stars = countStars(progress);
      console.log(`⭐ Day ${dayStr} updated! Total: ${stars}/24 stars`);
      return;
    }

    showUsage();
    return;
  }

  const day = parseInt(args[1]);
  const part = args[2];

  if (isNaN(day) || day < 1 || day > 12) {
    console.error("❌ Invalid day. Please specify a day between 1 and 12.");
    showUsage();
    return;
  }

  const dayStr = day.toString().padStart(2, "0");

  if (!progress[dayStr]) {
    progress[dayStr] = { part1: false, part2: false };
  }

  const value = isStar;

  if (!part) {
    progress[dayStr].part1 = value;
    progress[dayStr].part2 = value;
  } else if (part === "1") {
    progress[dayStr].part1 = value;
  } else if (part === "2") {
    progress[dayStr].part2 = value;
  } else {
    console.error("❌ Invalid part. Use 1 or 2.");
    return;
  }

  saveProgress(progress);
  updateReadme(progress);

  const stars = countStars(progress);
  const action = isStar ? "marked as solved" : "marked as unsolved";
  const partLabel = part ? `part ${part}` : "both parts";
  console.log(`⭐ Day ${dayStr} ${partLabel} ${action}! Total: ${stars}/24 stars`);
}

run().catch(console.error);

