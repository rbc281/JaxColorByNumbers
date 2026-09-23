const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

function loadPuzzleData() {
  const appPath = path.join(__dirname, "..", "app.js");
  const source = fs.readFileSync(appPath, "utf8");
  const generatorEnd = source.indexOf("const store=");

  assert.notEqual(generatorEnd, -1, "Could not locate the puzzle generator boundary");

  const context = {};
  vm.createContext(context);
  vm.runInContext(
    `${source.slice(0, generatorEnd)}\nthis.puzzleData={CATS,PALETTES,NAMES,KIND,LEVELS};`,
    context,
    { filename: appPath, timeout: 1000 },
  );
  return context.puzzleData;
}

test("all 50 V3 puzzles generate without hanging", () => {
  const { CATS, LEVELS } = loadPuzzleData();

  assert.equal(CATS.length, 5);
  assert.equal(LEVELS.length, 50);
  for (const category of CATS) {
    assert.equal(LEVELS.filter(level => level.cat === category.id).length, 10);
  }
});

test("every puzzle has valid dimensions, colors, and playable cells", () => {
  const { LEVELS } = loadPuzzleData();
  const expectedSize = { Easy: 14, Medium: 18, Hard: 22 };

  for (const level of LEVELS) {
    const size = expectedSize[level.difficulty];
    assert.equal(level.grid.length, size, `${level.id} has the wrong height`);
    assert.ok(level.grid.every(row => row.length === size), `${level.id} has the wrong width`);
    assert.ok(level.grid.flat().some(Boolean), `${level.id} has no playable cells`);
    assert.ok(
      level.grid.flat().every(cell => Number.isInteger(cell) && cell >= 0 && cell <= level.colors.length),
      `${level.id} references a missing color`,
    );
  }
});

test("difficulty and palette size progress within every category", () => {
  const { CATS, LEVELS } = loadPuzzleData();

  for (const category of CATS) {
    const levels = LEVELS.filter(level => level.cat === category.id);
    assert.deepEqual(Array.from(levels, level => level.difficulty), [
      "Easy", "Easy", "Easy",
      "Medium", "Medium", "Medium", "Medium",
      "Hard", "Hard", "Hard",
    ]);
    assert.deepEqual(Array.from(levels, level => level.colors.length), [3, 3, 3, 6, 6, 6, 6, 9, 9, 9]);
  }
});
