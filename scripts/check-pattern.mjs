import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source = fs.readFileSync(new URL('../dist/app.js', import.meta.url), 'utf8');
const data = source.slice(source.indexOf('  const patternCard'), source.indexOf('  let voices'));
const functions = source.slice(source.indexOf('  function renderPatternTrial()'), source.indexOf('  function resetEndgame()'));
let nodes, choices, timers, ended;
function element() {
  const classes = new Set();
  return { dataset: {}, style: {}, children: [], disabled: false, classList: { add: x => classes.add(x), remove: x => classes.delete(x), toggle: (x, on) => on ? classes.add(x) : classes.delete(x), contains: x => classes.has(x) }, appendChild(x) { this.children.push(x); if (x.className === 'pattern-choice') choices.push(x); }, setAttribute() {}, addEventListener() {} };
}
const context = vm.createContext({ document: { getElementById: id => nodes[id] ||= element(), createElement: element, querySelectorAll: () => choices }, speak() {}, praise: () => 'Aferin!', finishBlock: () => ended++, setTimeout: (fn, ms) => { const timer = { fn, ms }; timers.add(timer); return timer; }, clearTimeout: timer => timers.delete(timer), Math });
vm.runInContext(`function shapeMarkup(shape, color) { return '<i class="' + shape + ' ' + color + '"></i>'; }\n${data}\nlet promptTimer;\n${functions}\nglobalThis.api = {state, patternLevels, patternItems, renderPatternTrial, patternAnswer};`, context);
const { state, patternLevels, patternItems, renderPatternTrial, patternAnswer } = context.api;
assert.equal(patternLevels.length, 15);
for (const level of patternLevels) {
  assert.equal(level.examples.length, 5);
  for (const example of level.examples) {
    for (const key of [...example.shown, example.answer, example.decoy]) assert(patternItems[key], key);
    assert.notEqual(example.answer, example.decoy);
  }
}
function reset(method, level = 1, trial = 0) {
  nodes = {}; choices = []; timers = new Set(); ended = 0;
  Object.assign(state, { screen: 'activity', skill: 'pattern', method, patternLevel: level, trial, stats: { independent: 0, prompted: 0, incorrect: 0 } });
  renderPatternTrial();
}
function correct() { return choices.find(x => x.dataset.correct === 'true'); }
function wrong() { return choices.find(x => x.dataset.correct === 'false'); }
function fire(ms) { for (const t of [...timers]) if (t.ms === ms) { timers.delete(t); t.fn(); } }
for (let level = 1; level <= 15; level++) for (let trial = 0; trial < 5; trial++) {
  reset('wait', level, trial);
  assert.equal(choices.length, 2);
  assert.equal(state.hadPrompt, false);
  assert([...timers].some(t => t.ms === 4000));
}
reset('wait'); patternAnswer(correct());
assert.equal(state.stats.independent, 1); assert.equal(timers.size, 1); assert(![...timers].some(t => t.ms === 4000));
reset('wait'); patternAnswer(wrong());
assert.equal(state.trial, 0); assert.equal(state.hadPrompt, true); assert(correct().classList.contains('is-hint')); assert.equal(timers.size, 0);
patternAnswer(correct()); assert.equal(state.stats.prompted, 1); assert.equal(state.stats.incorrect, 1);
reset('wait'); fire(4000); assert.equal(state.hadPrompt, true); assert(correct().classList.contains('is-hint'));
patternAnswer(correct()); assert.equal(state.stats.prompted, 1);
reset('immediate'); assert.equal(state.hadPrompt, true); assert.equal(timers.size, 0);
patternAnswer(correct()); assert.equal(state.stats.prompted, 1);
reset('wait', 15, 4); patternAnswer(correct()); fire(1100); assert.equal(ended, 1);
console.log('OK: 75 trials; independent correct, wrong-answer correction, 4-second timeout, immediate hint, final trial.');
