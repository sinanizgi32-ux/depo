import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source = fs.readFileSync(new URL('../dist/app.js', import.meta.url), 'utf8');
const data = source.slice(source.indexOf('  const patternCard'), source.indexOf('  let promptTimer'));
const functions = source.slice(source.indexOf('  function giveInstruction('), source.indexOf('  function renderTrial()')) + source.slice(source.indexOf('  function renderPatternTrial()'), source.indexOf('  function resetEndgame()'));
let nodes, choices, timers, ended;
function element() {
  const classes = new Set();
  return { dataset: {}, style: {setProperty(name,value){this[name]=String(value);}}, children: [], disabled: false, classList: { add: x => classes.add(x), remove: x => classes.delete(x), toggle: (x, on) => on ? classes.add(x) : classes.delete(x), contains: x => classes.has(x) }, appendChild(x) { this.children.push(x); if (x.className === 'pattern-choice') choices.push(x); }, setAttribute() {}, addEventListener() {} };
}
const context = vm.createContext({ window: {addEventListener(){}}, document: { getElementById: id => nodes[id] ||= { ...element(), hidden: true }, createElement: element, querySelectorAll: () => choices }, speak(key, text, done) { done?.(); }, praise: () => 'Aferin!', finishBlock: () => ended++, setTimeout: (fn, ms) => { const timer = { fn, ms }; timers.add(timer); return timer; }, clearTimeout: timer => timers.delete(timer), Math });
vm.runInContext(`function shapeMarkup(shape, color) { return '<i class="' + shape + ' ' + color + '"></i>'; }\n${data}\nlet promptTimer;\n${functions}\nglobalThis.api = {state, patternLevels, patternItems, renderPatternTrial, patternAnswer};`, context);
const { state, patternLevels, patternItems, renderPatternTrial, patternAnswer } = context.api;
assert.equal(patternLevels.length, 15);
for (const example of patternLevels[14].examples) {
  assert(new Set(example.shown).size >= 3, 'Son seviyede en az üç farklı şekil olmalı');
  assert(example.shown.length >= 9, 'Karmaşık sıra yeterli tekrar içermeli');
  const full = [...example.shown, example.answer];
  const period = full.findIndex((_, index) => index > 0 && full.every((key, position) => key === full[position % index]));
  assert(period >= 4 && period <= 5, 'Son seviye dört/beş öğelik tekrar bloğu içermeli');
  assert(example.shown.length >= period * 2, 'İpucundan önce iki tam tekrar görünmeli');
}
for (const [key, count] of [['birYildiz', 1], ['ikiYildiz', 2], ['ucYildiz', 3]]) {
  assert.equal((patternItems[key].html.match(/<span>/g) || []).length, count);
}
for (const item of Object.values(patternItems)) {
  for (const match of item.html.matchAll(/src="(\.\/assets\/objects\/[^"\s]+)"/g)) {
    assert(fs.existsSync(new URL('../dist/' + match[1].slice(2), import.meta.url)), 'Nesne resmi eksik: ' + match[1]);
  }
}
for (const [key, count] of [['birElma', 1], ['ikiElma', 2], ['ucElma', 3], ['birTop', 1], ['ikiTop', 2], ['ucTop', 3], ['birSeker', 1], ['ikiSeker', 2], ['ucSeker', 3]]) {
  assert.equal((patternItems[key].html.match(/<img /g) || []).length, count, 'Sayılan resim adedi korunmalı');
}
assert(patternItems.kucukTop.html.includes('futbol.webp'));
assert(patternItems.buyukTop.html.includes('futbol.webp'));
for (const level of patternLevels) {
  assert.equal(level.examples.length, 5);
  for (const example of level.examples) {
    for (const key of [...example.shown, example.answer, example.decoy]) assert(patternItems[key], key);
    assert.notEqual(example.answer, example.decoy);
    assert(example.shown.includes(example.answer), 'Doğru seçenek örüntüde bulunmalı');
    assert(example.shown.includes(example.decoy), 'Diğer seçenek örüntüde bulunmalı');
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
let completedSpeech;
context.speak = (key, text, done) => { completedSpeech = done; };
reset('wait');
assert.equal(timers.size, 0, 'Yönerge konuşurken süre başlamamalı');
assert(choices.every(button => button.disabled));
completedSpeech();
assert([...timers].some(timer => timer.ms === 4000));
assert(choices.every(button => !button.disabled));
fire(4000);
assert(nodes.feedback.textContent.includes('elma, muz, elma, muz'));
assert(nodes.feedback.textContent.includes('Bu iki nesne sırayla tekrar ediyor.'));
assert(!nodes.feedback.textContent.includes('Hayır'));
reset('wait', 2, 0); completedSpeech(); fire(4000);
assert(nodes.feedback.textContent.includes('Bak, çilek, portakal, çilek, portakal, çilek. Bu iki nesne sırayla tekrar ediyor.'));
assert.equal((nodes.feedback.textContent.match(/çilek/g) || []).length, 3, 'Görsel sıradan sonra fazladan çilek okunmamalı');
assert(nodes.feedback.textContent.includes('buraya portakal gelmeli'));
reset('immediate');
assert.equal(state.hadPrompt, false, 'Eşzamanlı ipucu yönergeyi kesmemeli');
completedSpeech();
assert.equal(state.hadPrompt, true);
assert.equal(timers.size, 0);
const completion = source.slice(source.indexOf('  function finishBlock()'), source.indexOf('  function goPlatform('));
vm.runInContext(source.slice(source.indexOf('  const trials ='), source.indexOf('  const patternCard')), context);
let nextLevel;
context.saveState = () => {};
context.showScreen = screen => { state.screen = screen; };
context.resetActivity = (skill, level) => { nextLevel = level; state.skill = skill; state.patternLevel = level; state.trial = 0; };
vm.runInContext(`${completion}\nglobalThis.completion = { finishBlock, updateSummary, nextPatternLevel };`, context);
for (let level = 1; level <= 15; level++) {
  state.skill = 'pattern'; state.patternLevel = level; state.method = 'wait'; state.trial = 5;
  context.completion.finishBlock();
  assert.equal(state.screen, 'summary');
  assert.equal(nodes.summaryNext.hidden, level === 15);
  nextLevel = null;
  context.completion.nextPatternLevel();
  assert.equal(nextLevel, level === 15 ? null : level + 1);
  assert.equal(state.method, 'wait');
  if (level < 15) { assert.equal(state.screen, 'activity'); assert.equal(state.trial, 0); }
}
state.skill = 'two-color'; context.completion.updateSummary(); assert.equal(nodes.summaryNext.hidden, true);
console.log('OK: 75 trials; independent correct, wrong-answer correction, 4-second timeout, immediate hint, final trial.');
