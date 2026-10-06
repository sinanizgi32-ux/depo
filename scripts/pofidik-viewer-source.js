import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone } from 'three/addons/utils/SkeletonUtils.js';

const allowedClips = new Set(['breathe', 'nod_yes', 'shake_no', 'look_left', 'look_right', 'look_up', 'curious', 'ears', 'listen', 'bow', 'sway', 'stretch', 'blink', 'talk']);
const ambientClips = ['look_left', 'look_right', 'look_up', 'curious', 'ears', 'listen', 'blink'];
const touchClips = ['nod_yes', 'shake_no', 'curious', 'listen', 'bow', 'sway', 'stretch', 'ears'];
const viewers = new Map();
const mounting = new WeakMap();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let speaking = false;
let touchIndex = 0;
let sourcePromise;

function source() {
  // The URL is relative to the page, so copies and GitHub clones need no machine-specific paths.
  return sourcePromise ||= (async () => {
    const base = new URL('./assets/avatars/pofidik/', window.location.href);
    const loader = new GLTFLoader();
    if ('DecompressionStream' in window) {
      const response = await fetch(new URL('model.glb.gz', base));
      if (response.ok && response.body) {
        const bytes = await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
        return loader.parseAsync(bytes, base.href);
      }
    }
    return loader.loadAsync(new URL('model.glb', base).href);
  })().catch(error => { sourcePromise = undefined; throw error; });
}
function resolveViewer(target) {
  if (!target) return null;
  return target.matches?.('[data-pofidik-viewer]') ? target : target.querySelector?.('[data-pofidik-viewer]');
}
function visible(element) {
  return !document.hidden && element.getClientRects().length > 0 && element.clientWidth > 0 && element.clientHeight > 0;
}
function shouldLoad(element) {
  const card = element.closest('.avatar-card');
  return !card || card.classList.contains('is-selected');
}
async function mount(element) {
  if (viewers.has(element)) return viewers.get(element);
  if (mounting.has(element)) return mounting.get(element);
  const promise = (async () => {
    const gltf = await source();
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    element.replaceChildren(renderer.domElement);
    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xffffff, 0xabb5c5, 2.2));
    const key = new THREE.DirectionalLight(0xffffff, 3);
    key.position.set(3, 4, 4); scene.add(key);
    const fill = new THREE.DirectionalLight(0xe0efff, 1.3);
    fill.position.set(-3, 2, -2); scene.add(fill);
    const model = clone(gltf.scene);
    model.rotation.y = -Math.PI / 2;
    const root = new THREE.Group(); root.add(model); scene.add(root);
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    root.position.sub(box.getCenter(new THREE.Vector3()));
    const camera = new THREE.PerspectiveCamera(28, 1, .01, 20);
    const mixer = new THREE.AnimationMixer(model);
    const actions = new Map(gltf.animations.filter(c => allowedClips.has(c.name)).map(c => [c.name, mixer.clipAction(c)]));
    // Speech affects only the face, so it does not cancel a touch/head/body reaction.
    const talkClip = gltf.animations.find(c => c.name === 'talk');
    const speechTracks = talkClip?.tracks.filter(track => track.name.includes('.morphTargetInfluences')).map(track => track.clone()) || [];
    const expression = new THREE.AnimationClip('speech_expression', talkClip?.duration || 4, speechTracks);
    THREE.AnimationUtils.makeClipAdditive(expression, 0, expression, 60);
    const speechAction = speechTracks.length ? mixer.clipAction(expression) : null;
    let active;
    let lastTime = 0;
    let lastRender = 0;
    let nextAmbient = performance.now() + 9000;
    let inView = true;
    function play(name, once = true) {
      if (!allowedClips.has(name)) return false;
      const next = actions.get(name);
      if (!next) return false;
      if (active && active !== next) active.fadeOut(.18);
      next.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(.18);
      next.setLoop(once ? THREE.LoopOnce : THREE.LoopRepeat, once ? 1 : Infinity);
      next.clampWhenFinished = once; next.play(); active = next;
      element.dataset.animation = name;
      nextAmbient = performance.now() + 9000;
      return true;
    }
    function idle() { play('breathe', false); }
    mixer.addEventListener('finished', event => { if (event.action === active) idle(); });
    function resize() {
      const width = Math.max(1, element.clientWidth), height = Math.max(1, element.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      const distance = Math.max(size.y, size.x / camera.aspect) / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) * 1.10;
      camera.position.set(0, .01, distance); camera.lookAt(0, 0, 0); camera.updateProjectionMatrix();
    }
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(element); resize();
    const observer = new IntersectionObserver(entries => { inView = entries[0].isIntersecting; updateRunning(); }); observer.observe(element);
    const api = { play, speaking(value) {
      element.dataset.speaking = String(value);
      if (value) speechAction?.reset().setLoop(THREE.LoopRepeat, Infinity).setEffectiveWeight(1).fadeIn(.12).play();
      else speechAction?.fadeOut(.12);
    }, updateRunning, clips: [...actions.keys()] };
    viewers.set(element, api);
    element.classList.add('is-loaded');
    element.dataset.animationCount = String(actions.size);
    idle();
    api.speaking(speaking);
    function frame(time) {
      if (!inView || !visible(element)) { lastTime = time; return; }
      if (time - lastRender < 1000 / (element.closest('.avatar-card') ? 20 : 30)) return;
      mixer.update(lastTime ? Math.min((time - lastTime) / 1000, .10) : 0);
      lastTime = time; lastRender = time;
      if (!speaking && !reducedMotion.matches && time > nextAmbient) play(ambientClips[Math.floor(Math.random() * ambientClips.length)]);
      renderer.render(scene, camera);
    }
    function updateRunning() {
      const running = inView && visible(element);
      element.dataset.rendering = String(running);
      renderer.setAnimationLoop(running ? frame : null);
      if (!running) lastTime = 0;
    }
    updateRunning();
    return api;
  })();
  mounting.set(element, promise);
  try { return await promise; }
  catch (error) {
    element.classList.add('has-error');
    console.warn('Pofidik 3D yüklenemedi; görsel oyun arkadaşı korunuyor.', error);
    mounting.delete(element);
    throw error;
  }
}
function refresh() {
  for (const api of viewers.values()) api.updateRunning();
  document.querySelectorAll('[data-pofidik-viewer]').forEach(element => {
    if (shouldLoad(element) && visible(element)) mount(element).catch(() => {});
  });
}
const lazyObserver = new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting && shouldLoad(entry.target) && visible(entry.target)) mount(entry.target).catch(() => {});
});
document.querySelectorAll('[data-pofidik-viewer]').forEach(element => lazyObserver.observe(element));
document.addEventListener('visibilitychange', refresh);
window.Pofidik3D = {
  refresh,
  preload: () => source().catch(() => {}),
  async play(target, name, once = true) {
    const element = resolveViewer(target);
    if (!element || !allowedClips.has(name)) return false;
    try { return (await mount(element)).play(name, once); } catch { return false; }
  },
  async react(target) { const name = touchClips[touchIndex++ % touchClips.length]; return this.play(target, name); },
  setSpeaking(value) { speaking = !!value; for (const [element, api] of viewers) if (visible(element)) api.speaking(speaking); },
  availableAnimations: [...allowedClips],
};
refresh();
