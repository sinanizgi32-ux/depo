import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source = fs.readFileSync(new URL('../dist/app.js', import.meta.url), 'utf8');
let nodes, timers, speeches, ended, dropTarget;
function element() {
  const classes = new Set(); let html = '';
  const node = { dataset: {}, style: {}, children: [], disabled: false, hidden: true, className: '', handlers: {}, pointer: null,
    classList: { add: (...names) => names.forEach(name => classes.add(name)), remove: (...names) => names.forEach(name => classes.delete(name)), toggle: (name, on) => on ? classes.add(name) : classes.delete(name), contains: name => classes.has(name) },
    appendChild(child) { this.children.push(child); }, setAttribute(name, value) { this[name] = value; }, addEventListener(name, fn) { this.handlers[name] = fn; },
    setPointerCapture(id) { this.pointer = id; }, hasPointerCapture(id) { return this.pointer === id; }, releasePointerCapture() { this.pointer = null; }, closest(selector) { return this.className.split(' ').includes(selector.slice(1)) ? this : null; } };
  Object.defineProperty(node, 'innerHTML', { get: () => html, set: value => { html = value; node.children = []; } });
  return node;
}
function allNodes() { const visit = node => [node, ...node.children.flatMap(visit)]; return Object.values(nodes).flatMap(visit); }
const randomMath = Object.create(Math);
const context = vm.createContext({ window: {addEventListener(){}}, document: {
  getElementById: id => nodes[id] ||= element(), createElement: element,
  elementFromPoint: () => dropTarget,
  querySelectorAll: selector => allNodes().filter(node => selector.split(',').some(part => node.className.split(' ').includes(part.trim().slice(1))))
}, speak: (key, text, done) => speeches.push({ text, done }), praise: () => 'Harikasın!', finishBlock: () => ended++,
setTimeout: (fn, ms) => { const timer = { fn, ms }; timers.add(timer); return timer; }, clearTimeout: timer => timers.delete(timer), Math: randomMath });
vm.runInContext(fs.readFileSync(new URL('../dist/events-data.js', import.meta.url), 'utf8'), context);
const data = source.slice(source.indexOf('  const state ='), source.indexOf('  let promptTimer'));
const instruction = source.slice(source.indexOf('  function giveInstruction('), source.indexOf('  function renderTrial()'));
const events = source.slice(source.indexOf('  function eventExample()'), source.indexOf('  function resetEndgame()'));
vm.runInContext(`const eventContent = window.EventSequences; let eventRun = 0; let eventAdvancePending = false; let promptTimer; ${data}\n${instruction}\n${events}\nglobalThis.api={state,eventContent,renderEventTrial,eventAnswer,showHintEvent,eventNextSlot};`, context);
const { state, eventContent, renderEventTrial, eventAnswer, showHintEvent } = context.api;
assert.equal(Object.keys(eventContent.stories).length, 25); assert.equal(eventContent.levels.length, 10);
for (const [index, level] of eventContent.levels.entries()) {
  assert.equal(level.examples.length, 5);
  assert.equal(new Set(level.examples.map(example => example.story)).size, 5);
  for (const example of level.examples) {
    assert(example.indices.length >= 2 && example.indices.length <= 5);
    assert.deepEqual([...example.indices].sort((a,b) => a-b), [...example.indices]);
    assert.equal(new Set(example.indices).size, example.indices.length);
    assert.equal(eventContent.stories[example.story].steps.length, 5);
    if (process.argv.includes('--assets')) for (let step = 1; step <= 5; step++) assert(fs.existsSync(new URL(`../dist/assets/events/${example.story}/${step}.webp`, import.meta.url)));
  }
  if (index) assert(level.examples[0].indices.length >= eventContent.levels[index - 1].examples[0].indices.length);
}
function reset(method = 'wait', level = 1, trial = 0) {
  nodes = {}; timers = new Set(); speeches = []; ended = 0;
  Object.assign(state, { screen: 'activity', skill: 'events', method, eventLevel: level, trial, stats: { independent: 0, prompted: 0, incorrect: 0 } });
  renderEventTrial();
}
function finishSpeech() { const speech = speeches.shift(); assert(speech); speech.done?.(); return speech.text; }
function fire(ms) { for (const timer of [...timers]) if (timer.ms === ms) { timers.delete(timer); timer.fn(); } }
function card(step) { return nodes.eventCards.children.find(card => Number(card.dataset.step) === step); }
function solve() {
  const example = eventContent.levels[state.eventLevel-1].examples[state.trial];
  for (const step of example.indices) if (!state.eventPlaced.includes(step)) { eventAnswer(card(step)); while (speeches.length) finishSpeech(); }
}
for (let level = 1; level <= 10; level++) for (let trial = 0; trial < 5; trial++) {
  reset('wait', level, trial);
  const example = eventContent.levels[level-1].examples[trial];
  assert.equal(nodes.eventSlots.children.length, example.indices.length);
  assert.equal(nodes.eventCards.children.length, example.indices.length);
  assert.deepEqual(nodes.eventCards.children.map(card => Number(card.dataset.step)).sort((a,b)=>a-b), [...example.indices], 'Karıştırma kartları korumalı');
  assert.equal(timers.size, 0); assert(nodes.eventCards.children.every(card => card.disabled));
  finishSpeech(); assert([...timers].some(timer => timer.ms === 4000));
  solve(); assert.equal(state.stats.independent, 1); assert.equal(state.stats.prompted, 0);
  assert(state.eventPlaced.every(step => step !== null));
  fire(1000); assert.equal(ended, trial === 4 ? 1 : 0);
}
for (const trial of [0, 1, 2, 3, 4]) {
  randomMath.random = () => 0.99; reset('wait', 1, trial);
  assert.deepEqual(nodes.eventCards.children.map(card => Number(card.dataset.step)), [0, 4], 'İlk olay solda da gelebilmeli');
  randomMath.random = () => 0; reset('wait', 1, trial);
  assert.deepEqual(nodes.eventCards.children.map(card => Number(card.dataset.step)), [4, 0], 'İlk olay sağda da gelebilmeli');
}
delete randomMath.random;
assert.deepEqual([...eventContent.levels[1].examples[1].indices], [0, 3], 'Solmuş bitkiden sonra sulama gösterilmeli');
assert.equal(eventContent.levels[1].examples[2].story, 'banana');
assert.equal(eventContent.levels[1].examples[4].story, 'paper');
assert.deepEqual([...eventContent.levels[2].examples[2].indices], [0, 2, 3], 'Kahvaltı hazırlama ve yeme gösterilmeli');
reset(); finishSpeech(); eventAnswer(card(4));
assert.equal(state.stats.incorrect, 1); assert.equal(state.hadPrompt, true); assert.equal(timers.size, 0);
assert(finishSpeech().startsWith('Hayır')); solve(); assert.equal(state.stats.prompted, 1); assert.equal(state.stats.independent, 0);
reset(); finishSpeech(); fire(4000); assert.equal(state.hadPrompt, true); assert(!finishSpeech().startsWith('Hayır')); solve(); assert.equal(state.stats.prompted, 1);
reset('immediate'); finishSpeech(); assert.equal(state.hadPrompt, true); assert.equal(timers.size, 0); finishSpeech(); solve(); assert.equal(state.stats.prompted, 1);
reset(); finishSpeech(); eventAnswer(card(4), 1); finishSpeech(); assert.equal(state.eventPlaced[1], 4); assert.equal(state.eventPlaced[0], null); solve(); assert.equal(state.stats.independent, 1);
reset(); state.screen = 'platform'; finishSpeech(); assert.equal(timers.size, 0, 'Ekrandan çıkınca gecikmiş yönerge süre başlatmamalı');
reset(); finishSpeech(); nodes.pauseModal.hidden = false; eventAnswer(card(0)); assert(state.eventPlaced.every(step => step === null));
function drag(button, target) {
  dropTarget = target;
  button.handlers.pointerdown({ pointerId: 1, button: 0, clientX: 0, clientY: 0 });
  button.handlers.pointermove({ pointerId: 1, clientX: 100, clientY: 150 });
  button.handlers.pointerup({ pointerId: 1, clientX: 100, clientY: 150 });
  button.handlers.click();
}
reset(); finishSpeech(); drag(card(0), nodes.eventSlots.children[0]);
assert.equal(state.eventPlaced[0], 0); assert.equal(state.eventPlaced[1], null); assert.equal(state.stats.incorrect, 0);
assert.equal(card(0).style.transform, ''); finishSpeech(); solve(); assert.equal(state.stats.independent, 1);
reset(); finishSpeech(); drag(card(0), nodes.eventSlots.children[1]); assert.equal(state.stats.incorrect, 1, 'Yanlış sürükleme tek hata sayılmalı'); assert(state.eventPlaced.every(step => step === null));
reset(); finishSpeech(); drag(card(0), null); assert(state.eventPlaced.every(step => step === null), 'Boş alana sürükleme kartı otomatik yerleştirmemeli');
assert([...timers].some(timer => timer.ms === 4000), 'Boş alana bırakınca yanıt aralığı yeniden başlamalı');
reset(); finishSpeech(); card(0).handlers.pointerdown({ pointerId: 1, button: 0, clientX: 0, clientY: 0 }); fire(4000); assert.equal(state.hadPrompt, false, 'Sürükleme başlarken başlayan yanıt ipucuyla kesilmemeli');
card(0).handlers.pointercancel(); assert([...timers].some(timer => timer.ms === 4000));
reset(); finishSpeech(); solve(); nodes.pauseModal.hidden = false; fire(1000); assert.equal(state.trial, 0, 'Mola sırasında sonraki denemeye geçilmemeli');
const completion = source.slice(source.indexOf('  function finishBlock()'), source.indexOf('  function goPlatform('));
context.saveState = () => {};
context.showScreen = screen => { state.screen = screen; };
context.resetActivity = (skill, level) => { state.skill = skill; state.eventLevel = level; state.trial = 0; };
vm.runInContext(`const patternLevels=[]; const trials=[]; const pairTrials=[]; ${completion}\nglobalThis.completion={finishBlock,updateSummary,nextPatternLevel};`, context);
for (let level = 1; level <= 10; level++) {
  state.skill = 'events'; state.eventLevel = level; state.method = 'wait'; state.trial = 5;
  context.completion.finishBlock(); assert.equal(state.screen, 'summary'); assert.equal(nodes.summaryNext.hidden, level === 10);
  context.completion.nextPatternLevel(); assert.equal(state.eventLevel, level < 10 ? level + 1 : 10); assert.equal(state.method, 'wait');
  if (level < 10) assert.equal(state.trial, 0);
}
console.log('OK: 10 levels, 50 trials; shuffled cards, numbered slots, speech completion, 4-second teaching, correction, simultaneous hints, drag order, pause and stale instruction.');
