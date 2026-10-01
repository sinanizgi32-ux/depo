(() => {
  const screens = [...document.querySelectorAll('[data-screen]')];
  const topbar = document.getElementById('topbar');
  const floatingBuddy = document.getElementById('floatingBuddy');
  const storageKey = 'dijitalOzelEgitimStateV2';
  const audioStorageKey = 'dijitalOzelEgitimAudioV1';
  const backgroundMusic = document.getElementById('backgroundMusic');
  const musicBlockedScreens = new Set(['activity', 'endgame', 'summary']);
  const audioSettings = { enabled: true, volume: .35, lastVolume: .35 };
  const skillNames = {
    'object-match': { title: 'Aynı nesneleri eşle', description: 'Aynı nesneyi seçenekler arasından bulma çalışması.', icon: '🧩' },
    'same-red': { title: 'Aynı tip ve aynı renk kartları eşle', description: 'Aynı tip iki kırmızı kartı dağınık kartlar arasından bulup eşleme. 5 deneme ve bölüm sonu oyunu.', icon: '🟥', playable: true },
    'two-color': { title: 'İki renk arasından doğru olanı eşle', description: 'Kırmızı ve mavi arasından kırmızı olanı eşle. 5 deneme ve bölüm sonu oyunu.', icon: '🎨', playable: true },
    'spoken-color': { title: 'Söylenen rengi göster', description: 'Sözel yönergeye göre doğru rengi seçme çalışması.', icon: '👆' }
  };
  const mascots = {
    pofidik: { name: 'Pofidik', fullName: 'Pofidik Ayı', sprite: 'bear', voiceKind: 'male', pitch: 1, rate: 1, voiceIndex: 0, model: 'pofidik' },
    dila: { name: 'Dila', fullName: 'Dila Panda', sprite: 'panda', voiceKind: 'female', pitch: 1, rate: 1, voiceIndex: 0 },
    kipir: { name: 'Kıpır', fullName: 'Kıpır Kunduz', sprite: 'beaver', voiceKind: 'male', pitch: 1, rate: 1, voiceIndex: 1 },
    mina: { name: 'Mina', fullName: 'Mina Tilki', sprite: 'fox', voiceKind: 'female', pitch: 1, rate: 1, voiceIndex: 1 }
  };
  const buddyPhrases = [
    'Evet, buradayım!',
    'Çok güzel gidiyorsun!',
    'Oynamak ister misin?',
    'Devam edelim mi?',
    'Ben hep yanındayım.',
    'Harikasın, böyle devam!',
    'Bir oyun daha oynayalım mı?',
    'Seninle oynamak çok güzel!',
    'Ne oynayalım, sen söyle!',
    'Bugün çok iyi çalışıyoruz!'
  ];
  const reinforcers = [
    'Aferin!', 'Çok güzel!', 'Bravo!', 'Süpersin!', 'Harikasın!',
    'Mükemmel!', 'Muhteşem!', 'Ne güzel yaptın!', 'Böyle devam et!', 'İşte bu, başardın!'
  ];
  function praise() { return reinforcers[Math.floor(Math.random() * reinforcers.length)]; }
  const trials = [
    { target: ['circle', 'red'], options: [['circle', 'red'], ['circle', 'blue-shape']] },
    { target: ['square', 'red'], options: [['square', 'blue-shape'], ['square', 'red']] },
    { target: ['triangle', 'red'], options: [['triangle', 'red'], ['triangle', 'blue-shape']] },
    { target: ['circle', 'red'], options: [['square', 'blue-shape'], ['triangle', 'red']] },
    { target: ['square', 'red'], options: [['circle', 'red'], ['triangle', 'blue-shape']] }
  ];
  const pairTypes = ['circle', 'square', 'star', 'heart', 'flower', 'diamond'];
  const pairSymbols = { circle: '●', square: '■', star: '★', heart: '♥', flower: '✿', diamond: '◆' };
  const pairTypeNames = { circle: 'yuvarlak', square: 'kare', star: 'yıldız', heart: 'kalp', flower: 'çiçek', diamond: 'baklava' };
  const pairTrials = [
    { correct: 'circle', decoys: ['star', 'heart', 'flower', 'diamond'] },
    { correct: 'star', decoys: ['circle', 'square', 'heart', 'flower'] },
    { correct: 'heart', decoys: ['square', 'star', 'diamond', 'circle'] },
    { correct: 'flower', decoys: ['diamond', 'circle', 'star', 'square'] },
    { correct: 'square', decoys: ['heart', 'flower', 'circle', 'diamond'] }
  ];
  const state = {
    screen: 'welcome', history: [], profile: { name: '', age: '', diagnosis: '' }, avatar: null,
    buddyActivated: false, assessment: {}, chooser: 'child', method: null, category: 'cognitive', editingAssessment: false,
    plan: 'free', skill: 'two-color', trial: 0, hadPrompt: false, attempts: 0, pairWrongTries: 0, selectedPair: [], stats: { independent: 0, prompted: 0, incorrect: 0 }
  };
  let voices = [];
  let promptTimer = null;
  let bubbles = 3;
  let buddyPhraseIndex = -1;
  let speechToken = 0;

  function loadAudioSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem(audioStorageKey) || 'null');
      if (saved) {
        audioSettings.enabled = saved.enabled !== false;
        const savedVolume = Number(saved.volume);
        const savedLastVolume = Number(saved.lastVolume);
        if (Number.isFinite(savedVolume)) audioSettings.volume = Math.min(1, Math.max(0, savedVolume));
        if (Number.isFinite(savedLastVolume) && savedLastVolume > 0) audioSettings.lastVolume = Math.min(1, savedLastVolume);
      }
    } catch (_) {}
    backgroundMusic.volume = audioSettings.volume;
    syncAudioUI();
  }
  function saveAudioSettings() {
    localStorage.setItem(audioStorageKey, JSON.stringify(audioSettings));
  }
  function musicCanPlay() { return audioSettings.enabled && !musicBlockedScreens.has(state.screen); }
  function tryStartMusic() {
    if (!musicCanPlay()) { backgroundMusic.pause(); return; }
    backgroundMusic.volume = audioSettings.volume;
    const playAttempt = backgroundMusic.play();
    if (playAttempt?.catch) playAttempt.catch(() => {});
  }
  function syncAudioUI() {
    const audible = audioSettings.enabled && audioSettings.volume > 0;
    document.querySelectorAll('#quickMuteTop, #quickMuteWelcome').forEach(button => {
      button.setAttribute('aria-pressed', String(!audible));
      button.setAttribute('aria-label', audible ? 'Müziği kapat' : 'Müziği aç');
      button.firstChild.textContent = audible ? '🔊 ' : '🔇 ';
    });
    const toggle = document.getElementById('musicToggle');
    if (toggle) { toggle.textContent = audible ? 'Açık' : 'Kapalı'; toggle.setAttribute('aria-pressed', String(audible)); toggle.classList.toggle('is-on', audible); }
    const range = document.getElementById('musicVolume');
    const value = document.getElementById('musicVolumeValue');
    if (range) range.value = String(Math.round(audioSettings.volume * 100));
    if (value) value.textContent = `${Math.round(audioSettings.volume * 100)}%`;
  }
  function toggleMusic() {
    if (audioSettings.enabled && audioSettings.volume > 0) {
      audioSettings.lastVolume = audioSettings.volume;
      audioSettings.enabled = false;
      backgroundMusic.pause();
    } else {
      audioSettings.enabled = true;
      if (audioSettings.volume === 0) audioSettings.volume = audioSettings.lastVolume || .35;
      tryStartMusic();
    }
    saveAudioSettings(); syncAudioUI();
  }
  function setMusicVolume(percent) {
    audioSettings.volume = Math.min(1, Math.max(0, Number(percent) / 100));
    if (audioSettings.volume > 0) { audioSettings.enabled = true; audioSettings.lastVolume = audioSettings.volume; }
    else audioSettings.enabled = false;
    backgroundMusic.volume = audioSettings.volume;
    if (audioSettings.enabled) tryStartMusic(); else backgroundMusic.pause();
    saveAudioSettings(); syncAudioUI();
  }

  function loadVoices() { voices = window.speechSynthesis?.getVoices?.() || []; }
  function pickVoice(profile) {
    if (!voices.length) return null;
    const femaleWords = /emel|filiz|aylin|seda|zeynep|selin|dilek|yelda|buket|özlem|merve|esra|ece|kadın|female/i;
    const maleWords = /tolga|ahmet|mehmet|burak|emre|kerem|mustafa|erkek|male/i;
    const matcher = profile.voiceKind === 'female' ? femaleWords : maleWords;
    const scored = voices.map(voice => {
      let score = 0;
      if (/^tr([_-]|$)/i.test(voice.lang)) score += 100;
      if (matcher.test(voice.name)) score += 10;
      if (/natural|online|premium|enhanced/i.test(voice.name)) score += 5;
      if (voice.localService) score += 1;
      return { voice, score };
    }).sort((a, b) => b.score - a.score);
    const pool = scored.filter(item => item.score === scored[0].score).map(item => item.voice);
    return pool[profile.voiceIndex % pool.length];
  }
  function speak(key, text) {
    if (!('speechSynthesis' in window)) return;
    const profile = mascots[key] || mascots.pofidik;
    window.speechSynthesis.cancel();
    window.Pofidik3D?.setSpeaking(false);
    loadVoices();
    const utterance = new SpeechSynthesisUtterance(text || `Merhaba, ben ${profile.name}. Oyun arkadaşın olmaya hazırım.`);
    utterance.lang = 'tr-TR'; utterance.pitch = profile.pitch; utterance.rate = profile.rate;
    const voice = pickVoice(profile); if (voice) utterance.voice = voice;
    const token = ++speechToken;
    utterance.onstart = () => { if (token === speechToken && profile.model === 'pofidik') window.Pofidik3D?.setSpeaking(true); };
    utterance.onend = utterance.onerror = () => { if (token === speechToken) window.Pofidik3D?.setSpeaking(false); };
    window.speechSynthesis.speak(utterance);
  }

  function showScreen(name, push = true) {
    clearTimeout(promptTimer);
    if (push && state.screen !== name) state.history.push(state.screen);
    state.screen = name;
    screens.forEach(s => s.classList.toggle('is-active', s.dataset.screen === name));
    topbar.hidden = name === 'welcome';
    document.getElementById('backButton').style.visibility = state.history.length ? 'visible' : 'hidden';
    const buddyHiddenScreens = ['welcome', 'profile', 'avatar', 'intro'];
    floatingBuddy.hidden = !state.avatar || !state.buddyActivated || buddyHiddenScreens.includes(name);
    if (musicBlockedScreens.has(name)) backgroundMusic.pause(); else tryStartMusic();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function saveState() {
    const safeState = {
      profile: { name: state.profile.name, age: state.profile.age }, avatar: state.avatar,
      buddyActivated: state.buddyActivated, assessment: state.assessment, chooser: state.chooser,
      method: state.method, plan: state.plan, lastStats: state.stats
    };
    localStorage.setItem(storageKey, JSON.stringify(safeState));
    sessionStorage.setItem(`${storageKey}:diagnosis`, state.profile.diagnosis || '');
  }
  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (saved) {
        state.profile = { ...state.profile, ...(saved.profile || {}) };
        state.avatar = saved.avatar === 'mimo' ? 'pofidik' : (mascots[saved.avatar] ? saved.avatar : null); state.buddyActivated = !!saved.buddyActivated;
        state.assessment = saved.assessment || {}; state.chooser = saved.chooser || 'child'; state.method = saved.method || null;
        state.plan = saved.plan === 'premium' ? 'premium' : 'free';
      }
      state.profile.diagnosis = sessionStorage.getItem(`${storageKey}:diagnosis`) || '';
    } catch (_) {}
  }
  function mascot() { return mascots[state.avatar] || mascots.pofidik; }
  function updateMascotDisplays() {
    const selected = mascot();
    document.querySelectorAll('[data-mascot-display]').forEach(el => {
      el.classList.toggle('is-pofidik', selected.model === 'pofidik');
      el.dataset.sprite = selected.sprite;
    });
    window.Pofidik3D?.refresh();
  }
  function setAvatar(key) {
    state.avatar = key; updateMascotDisplays();
    document.querySelectorAll('.avatar-card').forEach(c => c.classList.toggle('is-selected', c.dataset.avatar === key));
    document.getElementById('avatarContinue').disabled = false;
    if (key === 'pofidik') window.Pofidik3D?.play(document.querySelector('.avatar-card[data-avatar="pofidik"]'), 'curious');
  }
  function introMessage() {
    const child = state.profile.name ? ` ${state.profile.name}` : '';
    return `Merhaba${child}! Ben ${mascot().name}. Bundan sonra senin oyun arkadaşınım. Oyunlar oynarken hep yanında olacağım ve ihtiyacın olduğunda sana yardım edeceğim. Hazırsan başlayalım!`;
  }
  function prepareIntro() {
    updateMascotDisplays();
    document.getElementById('introTitle').textContent = `Ben ${mascot().name}!`;
    document.getElementById('introText').textContent = introMessage();
    document.getElementById('readyButton').disabled = false;
    document.getElementById('readyButton').textContent = 'Hazırım';
    if (state.avatar === 'pofidik') window.setTimeout(() => window.Pofidik3D?.play(document.querySelector('.intro-mascot'), 'nod_yes'), 120);
  }

  function restoreAssessmentUI() {
    document.querySelectorAll('.assessment-row').forEach(row => {
      const value = state.assessment[row.dataset.skill];
      row.querySelectorAll('[data-status]').forEach(button => {
        const selected = button.dataset.status === value;
        button.classList.toggle('is-selected', selected); button.setAttribute('aria-pressed', String(selected));
      });
    });
  }
  function updateAssessmentMode() {
    document.getElementById('assessmentContinue').textContent = state.editingAssessment ? 'Tamamla' : 'Yöntem seçimine geç';
  }
  function setMethod(method) {
    state.method = method;
    document.querySelectorAll('[data-method]').forEach(c => c.classList.toggle('is-selected', c.dataset.method === method));
    document.getElementById('methodContinue').disabled = false;
    const confirm = document.getElementById('methodConfirm');
    confirm.hidden = false;
    confirm.textContent = method === 'immediate' ? 'Seçilen yöntem: Eşzamanlı öğretim prototipi' : 'Seçilen yöntem: 4 saniye sabit bekleme süreli öğretim prototipi';
  }

  function renderPlatform() {
    const open = Object.keys(skillNames).filter(key => state.assessment[key] !== 'can');
    document.getElementById('cognitiveCount').textContent = `${open.length} çalışma`;
  }
  const planInfo = {
    free: { title: 'Ücretsiz plan', detail: 'Temel beceri çalışmaları açık. Premium ile tüm çalışmalar ve oyun arkadaşı içerikleri genişler.' },
    premium: { title: 'Premium üyelik', detail: 'Aylık 300 ₺ · Tüm çalışmalar ve gelecek içerikler açık.' }
  };
  function renderPlanUI() {
    const premium = state.plan === 'premium';
    const info = planInfo[premium ? 'premium' : 'free'];
    const status = document.getElementById('planStatus');
    if (status) {
      status.textContent = info.title;
      status.className = `plan-status ${premium ? 'is-premium' : 'is-free'}`;
    }
    const detail = document.getElementById('planStatusDetail');
    if (detail) detail.textContent = info.detail;
    const settingsLabel = document.getElementById('settingsPlanLabel');
    if (settingsLabel) settingsLabel.textContent = `${info.title}${premium ? '' : ' · Satın alınmadı'}`;
    const settingsButton = document.getElementById('settingsPlanButton');
    if (settingsButton) settingsButton.textContent = premium ? 'Planı görüntüle' : 'Planı yönet';
    const chip = document.getElementById('welcomePlanButton');
    if (chip) chip.textContent = premium ? '⭐ Premium üye' : '🛒 Satın al';
    const freeCard = document.getElementById('planFree'); const premiumCard = document.getElementById('planPremium');
    if (freeCard && premiumCard) {
      freeCard.classList.toggle('is-active', !premium);
      premiumCard.classList.toggle('is-active', premium);
    }
    const activate = document.getElementById('planActivate');
    if (activate) activate.hidden = premium;
    const deactivate = document.getElementById('planDeactivate');
    if (deactivate) deactivate.hidden = !premium;
  }
  function renderCategory(category = state.category) {
    state.category = category;
    const list = document.getElementById('skillList');
    if (category !== 'cognitive') {
      const titles = { language: 'Dil ve İletişim', social: 'Sosyal Beceriler', daily: 'Günlük Yaşam' };
      document.getElementById('categoryKicker').textContent = titles[category];
      document.getElementById('categoryTitle').textContent = 'Bu kategori sonraki kapsamda';
      list.innerHTML = '<div class="empty-state"><span>🧭</span><strong>Henüz etkinlik eklenmedi</strong><p>İlk sürümde yalnızca eşleme ve renk becerileri çalışılıyor.</p></div>';
      return;
    }
    document.getElementById('categoryKicker').textContent = 'Bilişsel Beceriler';
    document.getElementById('categoryTitle').textContent = 'Çalışılacak beceriler';
    const open = Object.keys(skillNames).filter(key => state.assessment[key] !== 'can');
    if (!open.length) {
      list.innerHTML = '<div class="empty-state"><span>🌟</span><strong>Bu bölümde çalışılacak beceri görünmüyor</strong><p>Kaba değerlendirmede tüm beceriler “Yapıyor” olarak işaretlendi.</p></div>';
      return;
    }
    const rows = open.map(key => {
      const skill = skillNames[key]; const playable = skill.playable;
      const status = state.assessment[key];
      const label = status === 'needs' ? 'Kaba değerlendirme: Henüz yapamıyor' : status === 'unknown' ? 'Kaba değerlendirme: Gözlenmedi' : 'Kaba değerlendirme: İşaretlenmedi';
      const action = playable ? `<button class="primary-button" type="button" data-start-skill="${key}">5 denemeyi başlat</button>` : '<button class="secondary-button" type="button" disabled>Hazırlanıyor</button>';
      return `<article class="skill-item"><span class="skill-icon">${skill.icon}</span><div><strong>${skill.title}</strong><small>${skill.description}</small><span class="skill-status">${label}</span></div>${action}</article>`;
    });
    list.innerHTML = rows.join('');
  }

  function shapeMarkup(shape, color) { return `<i class="shape ${shape} ${color}" aria-hidden="true"></i>`; }
  function pairCardMarkup(type) { return `<i class="pair-symbol" aria-hidden="true">${pairSymbols[type]}</i>`; }
  function setGameMode(skill) {
    const pairMode = skill === 'same-red';
    document.querySelector('.target-area').hidden = pairMode;
    document.getElementById('answerArea').hidden = pairMode;
    document.getElementById('pairArea').hidden = !pairMode;
    document.getElementById('gameTitle').textContent = pairMode ? 'Aynı kırmızı kartları eşle' : 'Aynı renkte olanı seç';
    document.querySelector('.game-toolbar .step-label').textContent = pairMode ? 'Bilişsel beceriler · Aynı tip aynı renk eşleme' : 'Bilişsel beceriler · Renk eşleme';
  }
  function resetActivity(skill = 'two-color') {
    state.skill = skill; state.trial = 0; state.stats = { independent: 0, prompted: 0, incorrect: 0 };
    setGameMode(skill);
    if (skill === 'same-red') renderPairTrial(); else renderTrial();
  }
  function renderTrial() {
    clearTimeout(promptTimer); state.hadPrompt = false; state.attempts = 0;
    const trial = trials[state.trial];
    document.getElementById('trialLabel').textContent = `${state.trial + 1} / ${trials.length}`;
    document.getElementById('progressFill').style.width = `${((state.trial + 1) / trials.length) * 100}%`;
    document.getElementById('targetCard').innerHTML = shapeMarkup(...trial.target);
    const area = document.getElementById('answerArea'); area.innerHTML = '';
    [...trial.options].sort(() => Math.random() - .5).forEach(([shape, color]) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'shape-card answer-card';
      button.dataset.correct = color === 'red' ? 'true' : 'false';
      button.setAttribute('aria-label', `${color === 'red' ? 'Kırmızı' : 'Mavi'} ${shape === 'circle' ? 'daire' : shape === 'square' ? 'kare' : 'üçgen'}`);
      button.innerHTML = shapeMarkup(shape, color); button.addEventListener('click', () => answer(button)); area.appendChild(button);
    });
    const feedback = document.getElementById('feedback'); feedback.textContent = ''; feedback.className = 'feedback';
    speak(state.avatar, 'Aynı renkte olanı seç.');
    if (state.method === 'immediate') showHint(); else promptTimer = setTimeout(showHint, 4000);
  }
  function renderPairTrial() {
    clearTimeout(promptTimer); state.hadPrompt = false; state.attempts = 0; state.pairWrongTries = 0; state.selectedPair = [];
    const trial = pairTrials[state.trial];
    document.getElementById('trialLabel').textContent = `${state.trial + 1} / ${pairTrials.length}`;
    document.getElementById('progressFill').style.width = `${((state.trial + 1) / pairTrials.length) * 100}%`;
    const feedback = document.getElementById('feedback'); feedback.textContent = ''; feedback.className = 'feedback';
    const area = document.getElementById('pairArea'); area.innerHTML = '';
    const cards = [{ type: trial.correct }, { type: trial.correct }, ...trial.decoys.map(type => ({ type }))];
    cards.sort(() => Math.random() - .5).forEach(card => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'pair-card';
      button.dataset.type = card.type;
      button.setAttribute('aria-label', `Kırmızı ${pairTypeNames[card.type]} kart`);
      button.innerHTML = pairCardMarkup(card.type); button.addEventListener('click', () => pairAnswer(button)); area.appendChild(button);
    });
    speak(state.avatar, 'Aynı olan iki kırmızı kartı bulun.');
    if (state.method === 'immediate') showHintPair(); else promptTimer = setTimeout(showHintPair, 4000);
  }
  function showHintPair() {
    if (state.screen !== 'activity' || state.skill !== 'same-red' || state.hadPrompt) return;
    state.hadPrompt = true;
    const trial = pairTrials[state.trial];
    document.querySelectorAll('.pair-card').forEach(b => b.classList.toggle('is-hint', b.dataset.type === trial.correct));
    document.getElementById('feedback').textContent = 'Kırmızı olanlar birlikte.';
    speak(state.avatar, 'Hayır, bu kırmızı değil. Aynı olan kırmızı kartlar birlikte.');
  }
  function pairAnswer(button) {
    if (button.disabled || button.classList.contains('is-matched')) return;
    if (button.classList.contains('is-selected')) {
      button.classList.remove('is-selected'); state.selectedPair = state.selectedPair.filter(b => b !== button); return;
    }
    button.classList.add('is-selected'); state.selectedPair.push(button);
    if (state.selectedPair.length < 2) return;
    const [first, second] = state.selectedPair; state.selectedPair = [];
    const feedback = document.getElementById('feedback');
    if (first.dataset.type === second.dataset.type) {
      [first, second].forEach(b => { b.classList.remove('is-selected', 'is-hint'); b.classList.add('is-matched'); b.disabled = true; });
      if (state.hadPrompt || state.attempts) state.stats.prompted += 1; else state.stats.independent += 1;
      feedback.textContent = praise(); feedback.className = 'feedback good';
      speak(state.avatar, feedback.textContent);
      setTimeout(() => { state.trial += 1; if (state.trial < pairTrials.length) renderPairTrial(); else finishBlock(); }, 1200);
    } else {
      state.attempts += 1; state.stats.incorrect += 1; state.pairWrongTries += 1;
      [first, second].forEach(b => b.classList.remove('is-selected'));
      feedback.textContent = 'Birlikte bir daha bakalım.'; feedback.className = 'feedback try';
      if (state.pairWrongTries >= 2) { showHintPair(); } else { speak(state.avatar, 'Birlikte bir daha bakalım.'); }
    }
  }
  function showHint() {
    if (state.screen !== 'activity' || state.hadPrompt) return;
    state.hadPrompt = true;
    document.querySelectorAll('.answer-card').forEach(b => b.classList.toggle('is-hint', b.dataset.correct === 'true'));
    document.getElementById('feedback').textContent = 'Kırmızı olanı birlikte bulalım.';
    speak(state.avatar, 'Kırmızı olanı birlikte bulalım.');
  }
  function answer(button) {
    clearTimeout(promptTimer);
    const feedback = document.getElementById('feedback');
    if (button.dataset.correct === 'true') {
      document.querySelectorAll('.answer-card').forEach(b => b.disabled = true);
      if (state.hadPrompt || state.attempts) state.stats.prompted += 1; else state.stats.independent += 1;
      feedback.textContent = praise(); feedback.className = 'feedback good';
      speak(state.avatar, feedback.textContent);
      setTimeout(() => { state.trial += 1; if (state.trial < trials.length) renderTrial(); else finishBlock(); }, 950);
    } else {
      state.attempts += 1; state.stats.incorrect += 1; button.disabled = true;
      feedback.textContent = 'Birlikte bir daha bakalım.'; feedback.className = 'feedback try'; showHint();
    }
  }
  function resetEndgame() {
    bubbles = 3; document.querySelectorAll('#bubbleZone button').forEach(b => b.classList.remove('is-popped'));
    document.getElementById('bubbleStatus').textContent = '3 baloncuk kaldı'; document.getElementById('endgameContinue').disabled = true;
  }
  function finishBlock() { saveState(); resetEndgame(); showScreen('endgame'); }
  function updateSummary() {
    document.getElementById('independentCount').textContent = state.stats.independent;
    document.getElementById('promptedCount').textContent = state.stats.prompted;
    document.getElementById('incorrectCount').textContent = state.stats.incorrect;
  }
  function goPlatform(push = true) { state.editingAssessment = false; renderPlatform(); showScreen('platform', push); }
  function finishEarly() { saveState(); document.getElementById('pauseModal').hidden = true; goPlatform(); }

  document.querySelectorAll('[data-next]').forEach(button => button.addEventListener('click', () => showScreen(button.dataset.next)));
  document.getElementById('backButton').addEventListener('click', () => { const previous = state.history.pop(); if (previous) showScreen(previous, false); });
  document.getElementById('homeButton').addEventListener('click', () => { state.history = []; if (state.method) goPlatform(false); else showScreen('welcome', false); });
  document.getElementById('settingsButton').addEventListener('click', () => showScreen('settings'));
  document.getElementById('welcomeSettingsButton').addEventListener('click', () => showScreen('settings'));
  document.getElementById('settingsBack').addEventListener('click', () => { const previous = state.history.pop() || 'welcome'; showScreen(previous, false); });
  document.querySelectorAll('#quickMuteTop, #quickMuteWelcome').forEach(button => button.addEventListener('click', toggleMusic));
  document.getElementById('musicToggle').addEventListener('click', toggleMusic);
  document.getElementById('musicVolume').addEventListener('input', event => setMusicVolume(event.target.value));
  document.getElementById('profileForm').addEventListener('submit', event => {
    event.preventDefault(); state.profile.name = document.getElementById('childName').value.trim(); state.profile.age = document.getElementById('childAge').value;
    state.profile.diagnosis = document.getElementById('diagnosis').value.trim(); saveState(); showScreen('avatar');
  });
  document.querySelectorAll('.avatar-card').forEach(card => {
    card.addEventListener('click', event => { if (!event.target.closest('.voice-button')) setAvatar(card.dataset.avatar); });
    card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setAvatar(card.dataset.avatar); } });
  });
  document.querySelectorAll('[data-speak]').forEach(button => button.addEventListener('click', event => { event.stopPropagation(); speak(button.dataset.speak); }));
  document.getElementById('avatarContinue').addEventListener('click', () => { prepareIntro(); saveState(); showScreen('intro'); setTimeout(() => speak(state.avatar, introMessage()), 250); });
  document.getElementById('readyButton').addEventListener('click', () => {
    const button = document.getElementById('readyButton'); button.disabled = true; button.textContent = 'Süpersin!';
    document.getElementById('introText').textContent = 'Süpersin! Haydi o zaman başlayalım.'; speak(state.avatar, 'Süpersin! Haydi o zaman başlayalım.');
    state.buddyActivated = true; state.editingAssessment = false; saveState();
    setTimeout(() => { restoreAssessmentUI(); updateAssessmentMode(); showScreen('assessment'); }, 1100);
  });
  document.querySelectorAll('.assessment-row [data-status]').forEach(button => button.addEventListener('click', () => {
    const row = button.closest('.assessment-row'); state.assessment[row.dataset.skill] = button.dataset.status;
    row.querySelectorAll('[data-status]').forEach(item => { const selected = item === button; item.classList.toggle('is-selected', selected); item.setAttribute('aria-pressed', String(selected)); });
    saveState();
  }));
  document.getElementById('assessmentContinue').addEventListener('click', () => {
    saveState();
    if (state.editingAssessment) { state.editingAssessment = false; updateAssessmentMode(); goPlatform(); return; }
    showScreen('method'); if (state.method) setMethod(state.method);
  });
  document.querySelectorAll('[data-method]').forEach(button => button.addEventListener('click', () => setMethod(button.dataset.method)));
  document.getElementById('methodContinue').addEventListener('click', () => { saveState(); goPlatform(); });
  document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => { renderCategory(button.dataset.category); showScreen('category'); }));
  document.getElementById('categoryBack').addEventListener('click', () => { if (state.history[state.history.length - 1] === 'platform') state.history.pop(); goPlatform(false); });
  document.getElementById('skillList').addEventListener('click', event => {
    const starter = event.target.closest('[data-start-skill]');
    if (starter) { resetActivity(starter.dataset.startSkill); showScreen('activity'); }
  });
  document.getElementById('editAssessment').addEventListener('click', () => { state.editingAssessment = true; restoreAssessmentUI(); updateAssessmentMode(); showScreen('assessment'); });
  document.getElementById('editMethod').addEventListener('click', () => { if (state.method) setMethod(state.method); showScreen('method'); });
  document.getElementById('helpButton').addEventListener('click', () => { if (state.skill === 'same-red') showHintPair(); else showHint(); });
  document.getElementById('pauseButton').addEventListener('click', () => { clearTimeout(promptTimer); document.getElementById('pauseModal').hidden = false; });
  document.getElementById('resumeButton').addEventListener('click', () => { document.getElementById('pauseModal').hidden = true; if (state.method === 'wait' && !state.hadPrompt) { if (state.skill === 'same-red') promptTimer = setTimeout(showHintPair, 4000); else promptTimer = setTimeout(showHint, 4000); } });
  document.getElementById('finishButton').addEventListener('click', finishEarly); document.getElementById('pauseFinish').addEventListener('click', finishEarly);
  document.querySelectorAll('#bubbleZone button').forEach(button => button.addEventListener('click', () => {
    if (button.classList.contains('is-popped')) return; button.classList.add('is-popped'); bubbles -= 1;
    document.getElementById('bubbleStatus').textContent = bubbles ? `${bubbles} baloncuk kaldı` : 'Hepsi tamam!'; if (!bubbles) document.getElementById('endgameContinue').disabled = false;
  }));
  document.getElementById('endgameContinue').addEventListener('click', () => { updateSummary(); showScreen('summary'); });
  document.getElementById('summaryHome').addEventListener('click', () => { state.history = []; goPlatform(false); });
  floatingBuddy.addEventListener('click', () => {
    buddyPhraseIndex = (buddyPhraseIndex + 1) % buddyPhrases.length;
    speak(state.avatar, buddyPhrases[buddyPhraseIndex]);
    if (state.avatar === 'pofidik') window.Pofidik3D?.react(floatingBuddy);
  });
  document.getElementById('welcomePlanButton').addEventListener('click', () => { renderPlanUI(); showScreen('plan'); });
  document.getElementById('settingsPlanButton').addEventListener('click', () => { renderPlanUI(); showScreen('plan'); });
  document.getElementById('planBack').addEventListener('click', () => {
    const previous = state.history.pop() || 'welcome';
    showScreen(previous, false);
  });
  document.getElementById('planActivate').addEventListener('click', () => {
    state.plan = 'premium'; saveState(); renderPlanUI();
  });
  document.getElementById('planDeactivate').addEventListener('click', () => {
    state.plan = 'free'; saveState(); renderPlanUI();
  });

  loadState(); loadAudioSettings(); loadVoices(); if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = loadVoices;
  tryStartMusic();
  renderPlanUI();
  document.addEventListener('pointerdown', tryStartMusic, { once: true, capture: true });
  document.addEventListener('keydown', tryStartMusic, { once: true, capture: true });
  document.getElementById('childName').value = state.profile.name; document.getElementById('childAge').value = state.profile.age; document.getElementById('diagnosis').value = state.profile.diagnosis;
  if (state.avatar) setAvatar(state.avatar); restoreAssessmentUI(); updateAssessmentMode(); updateMascotDisplays();
  if (document.modelContext?.registerTool) {
    Promise.resolve(document.modelContext.registerTool({
      name: 'start_two_color_matching', title: 'İki renk arasından eşleme çalışmasını başlat',
      description: 'Seçili öğretim yöntemiyle beş denemelik kırmızı-mavi renk eşleme çalışmasını görünür olarak başlatır.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute() { resetActivity(); showScreen('activity'); return { status: 'started', activity: 'two_color_matching', trials: 5, method: state.method }; }
    })).catch(() => {});
  }
})();
