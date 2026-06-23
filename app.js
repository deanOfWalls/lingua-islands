/**
 * LifeLingo — Personal Language Islands
 * Data-driven from starter-pack.json
 */

const STORAGE_KEY = 'lifelingo-progress';

const MASTERY_LABELS = {
  0: 'New',
  1: 'Recognize',
  2: 'Slow',
  3: 'Natural',
  4: 'Auto',
};

let data = null;
let progress = {};
let practiceState = null;
let speechSynth = window.speechSynthesis;
let currentUtterance = null;

const $ = (sel) => document.querySelector(sel);
const main = $('#main-content');
const topTitle = $('#top-title');
const backBtn = $('#back-btn');
const topActions = $('#top-actions');
const bottomNav = $('#bottom-nav');

// ── Progress persistence ──

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function getMastery(id) {
  return progress[id]?.mastery ?? 0;
}

function setMastery(id, level) {
  if (!progress[id]) progress[id] = {};
  progress[id].mastery = level;
  saveProgress();
}

function isFavorite(id) {
  return progress[id]?.favorite ?? false;
}

function toggleFavorite(id) {
  if (!progress[id]) progress[id] = { mastery: 0 };
  progress[id].favorite = !progress[id].favorite;
  saveProgress();
}

// ── Data helpers ──

function getIsland(id) {
  return data.islands.find((i) => i.id === id);
}

function getPattern(id) {
  return data.patterns.find((p) => p.id === id);
}

function getSentencesForIsland(islandId) {
  return data.sentences.filter((s) => s.islandId === islandId);
}

function getSentencesForPattern(patternId) {
  return data.sentences.filter((s) => s.patternIds?.includes(patternId));
}

function getIslandStats(islandId) {
  const sentences = getSentencesForIsland(islandId);
  const mastered = sentences.filter((s) => getMastery(s.id) >= 3).length;
  return { total: sentences.length, mastered };
}

function getOverallStats() {
  const total = data.sentences.length;
  const mastered = data.sentences.filter((s) => getMastery(s.id) >= 3).length;
  const weak = data.sentences.filter((s) => getMastery(s.id) < 2).length;
  const practiced = data.sentences.filter((s) => getMastery(s.id) > 0).length;
  return { total, mastered, weak, practiced };
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ── Audio ──

function speakHanzi(text, rate = 0.85) {
  if (!speechSynth) return;
  speechSynth.cancel();
  const utterance = new SpeechSynthesisUtterance(text.replace(/[。！？，、]/g, ''));
  utterance.lang = 'zh-CN';
  utterance.rate = rate;
  currentUtterance = utterance;
  speechSynth.speak(utterance);
}

function stopSpeech() {
  if (speechSynth) speechSynth.cancel();
}

// ── Routing ──

function parseHash() {
  const raw = location.hash.slice(1) || 'home';
  const [path, queryStr] = raw.split('?');
  const parts = path.split('/').filter(Boolean);
  const params = {};
  if (queryStr) {
    new URLSearchParams(queryStr).forEach((v, k) => { params[k] = v; });
  }
  return { view: parts[0] || 'home', parts: parts.slice(1), params };
}

function navigate(hash) {
  location.hash = hash;
}

function goBack() {
  const { view, parts } = parseHash();
  const backMap = {
    island: '#islands',
    pattern: '#patterns',
    sentence: '#islands',
    'practice-active': '#practice',
    shadow: '#home',
  };
  navigate(backMap[view] || '#home');
}

function setActiveNav(view) {
  const navViews = ['home', 'islands', 'practice', 'patterns', 'search'];
  let active = view;
  if (['island', 'sentence'].includes(view)) active = 'islands';
  if (view === 'pattern') active = 'patterns';
  if (['practice-active', 'shadow'].includes(view)) active = 'practice';

  bottomNav.querySelectorAll('.nav-item').forEach((el) => {
    el.classList.toggle('active', el.dataset.nav === active);
  });
}

function updateTopBar(title, showBack = false, actionsHtml = '') {
  topTitle.textContent = title;
  backBtn.classList.toggle('hidden', !showBack);
  topActions.innerHTML = actionsHtml;
}

// ── Search ──

function searchSentences(query, filters = {}) {
  const q = query.trim().toLowerCase();
  let results = data.sentences;

  if (filters.islandId) {
    results = results.filter((s) => s.islandId === filters.islandId);
  }
  if (filters.patternId) {
    results = results.filter((s) => s.patternIds?.includes(filters.patternId));
  }
  if (filters.weak) {
    results = results.filter((s) => getMastery(s.id) < 2);
  }
  if (filters.favorites) {
    results = results.filter((s) => isFavorite(s.id));
  }
  if (filters.mastery !== undefined) {
    results = results.filter((s) => getMastery(s.id) === Number(filters.mastery));
  }

  if (!q) return results;

  return results.filter((s) => {
    const island = getIsland(s.islandId);
    const fields = [
      s.english,
      s.hanzi,
      s.pinyin,
      s.pinyinNumbered,
      s.literal,
      s.meaning,
      ...(s.tags || []),
      island?.name,
      ...(s.patternIds || []),
    ];
    return fields.some((f) => f && String(f).toLowerCase().includes(q));
  });
}

// ── Render helpers ──

function renderMasteryDot(id) {
  const m = getMastery(id);
  return `<span class="mastery-dot mastery-dot--${m}" title="${MASTERY_LABELS[m]}"></span>`;
}

function renderFavStar(id) {
  const active = isFavorite(id) ? 'active' : '';
  return `<span class="fav-star ${active}" aria-hidden="true">★</span>`;
}

function renderSentenceRow(s, showIsland = false) {
  const island = showIsland ? getIsland(s.islandId) : null;
  return `
    <button type="button" class="sentence-row" data-sentence="${s.id}">
      ${renderMasteryDot(s.id)}
      <div class="sentence-row-content">
        <div class="sentence-row-english">${escapeHtml(s.english)}</div>
        <div class="sentence-row-pinyin">${escapeHtml(s.pinyin)}</div>
        ${island ? `<div class="sentence-row-meta">${escapeHtml(island.name)}</div>` : ''}
      </div>
      ${renderFavStar(s.id)}
    </button>`;
}

function renderBreakdown(sentence) {
  if (!sentence.breakdown?.length) return '';
  const rows = sentence.breakdown.map((w) => `
    <tr>
      <td class="breakdown-hanzi">${escapeHtml(w.hanzi)}</td>
      <td class="breakdown-pinyin">${escapeHtml(w.pinyin)}</td>
      <td>${escapeHtml(w.meaning)}</td>
    </tr>`).join('');
  return `
    <div class="detail-section">
      <h4>Word Breakdown</h4>
      <table class="breakdown-table"><tbody>${rows}</tbody></table>
    </div>`;
}

function renderPatterns(sentence) {
  if (!sentence.patternIds?.length) return '';
  const tags = sentence.patternIds.map((pid) => {
    const p = getPattern(pid);
    return p
      ? `<a href="#pattern/${pid}" class="tag">${escapeHtml(p.name)}</a>`
      : '';
  }).join('');
  return `
    <div class="detail-section">
      <h4>Patterns</h4>
      <div class="tag-list">${tags}</div>
    </div>`;
}

function renderExamples(sentence) {
  if (!sentence.examples?.length) return '';
  const items = sentence.examples.map((ex) => `
    <div class="example-item">
      <div class="example-hanzi">${escapeHtml(ex.hanzi)}</div>
      <div class="example-pinyin">${escapeHtml(ex.pinyin)}</div>
      <div class="example-english">${escapeHtml(ex.english)}</div>
    </div>`).join('');
  return `
    <div class="detail-section">
      <h4>Related Examples</h4>
      ${items}
    </div>`;
}

function renderMasteryButtons(sentenceId, selectedMastery) {
  return [0, 1, 2, 3, 4].map((n) => `
    <button type="button" class="mastery-btn ${selectedMastery === n ? 'selected' : ''}"
      data-mastery="${n}" data-sentence="${sentenceId}">
      <span class="mastery-btn-num">${n}</span>
      ${MASTERY_LABELS[n]}
    </button>`).join('');
}

function renderRevealContent(sentence, { showMastery = true, showHeader = true } = {}) {
  const mastery = getMastery(sentence.id);
  return `
    ${showHeader ? `
      <div class="hanzi-large">${escapeHtml(sentence.hanzi)}</div>
      <div class="pinyin-large">${escapeHtml(sentence.pinyin)}</div>` : ''}
    ${sentence.literal ? `<div class="literal-text">Literal: ${escapeHtml(sentence.literal)}</div>` : ''}
    ${sentence.structureNotes ? `
      <div class="detail-section">
        <h4>Structure</h4>
        <p>${escapeHtml(sentence.structureNotes)}</p>
      </div>` : ''}
    ${renderBreakdown(sentence)}
    ${renderPatterns(sentence)}
    ${sentence.usageNotes ? `
      <div class="detail-section">
        <h4>Usage</h4>
        <p>${escapeHtml(sentence.usageNotes)}</p>
      </div>` : ''}
    ${renderExamples(sentence)}
    ${showMastery ? `
      <div class="detail-section">
        <h4>How well do you know this?</h4>
        <div class="mastery-row">${renderMasteryButtons(sentence.id, mastery)}</div>
      </div>` : ''}`;
}

// ── Views ──

function renderHome() {
  const stats = getOverallStats();
  updateTopBar('LifeLingo', false);

  main.innerHTML = `
    <div class="hero-brand">
      <h2>LifeLingo</h2>
      <p>Learn the language of your own life.</p>
    </div>

    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-value">${stats.total}</span>
        <span class="stat-label">Sentences</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">${stats.mastered}</span>
        <span class="stat-label">Natural+</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">${stats.weak}</span>
        <span class="stat-label">To review</span>
      </div>
    </div>

    <div class="action-grid">
      <a href="#practice-active?mode=all" class="action-card">
        <div class="action-card-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M12 8v8M8 12h8"/></svg>
        </div>
        <div class="action-card-text">
          <h3>Practice All</h3>
          <p>Active recall from English</p>
        </div>
      </a>
      <a href="#islands" class="action-card">
        <div class="action-card-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/></svg>
        </div>
        <div class="action-card-text">
          <h3>Browse Islands</h3>
          <p>Life topics & sentences</p>
        </div>
      </a>
      <a href="#practice-active?mode=weak" class="action-card">
        <div class="action-card-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
        </div>
        <div class="action-card-text">
          <h3>Review Weak</h3>
          <p>Sentences below level 2</p>
        </div>
      </a>
      <a href="#shadow" class="action-card">
        <div class="action-card-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14"/></svg>
        </div>
        <div class="action-card-text">
          <h3>Shadow Mode</h3>
          <p>Listen, repeat, next</p>
        </div>
      </a>
    </div>

    <div class="page-header">
      <h2>Daily tip</h2>
      <p>If you know the Mandarin, don't say the English. Use it in real life.</p>
    </div>`;
}

function renderIslands() {
  updateTopBar('Islands', false);
  const sorted = [...data.islands].sort((a, b) => a.priority - b.priority);

  const cards = sorted.map((island) => {
    const { total, mastered } = getIslandStats(island.id);
    const pct = total ? Math.round((mastered / total) * 100) : 0;
    return `
      <a href="#island/${island.id}" class="island-card">
        <div class="island-card-header">
          <h3>${escapeHtml(island.name)}</h3>
          <span class="island-priority">#${island.priority}</span>
        </div>
        <p>${escapeHtml(island.goal)}</p>
        <div class="island-meta">
          <span>${total} sentences</span>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
          <span>${pct}%</span>
        </div>
      </a>`;
  }).join('');

  main.innerHTML = `
    <div class="page-header">
      <h2>Language Islands</h2>
      <p>Small areas of life where you can function in Mandarin.</p>
    </div>
    <div class="card-list">${cards}</div>`;
}

function renderIslandDetail(islandId) {
  const island = getIsland(islandId);
  if (!island) { navigate('#islands'); return; }

  const sentences = getSentencesForIsland(islandId);
  const { total, mastered } = getIslandStats(islandId);

  updateTopBar(island.name, true, `
    <a href="#practice-active?mode=island&island=${islandId}" class="icon-btn" aria-label="Practice island">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
    </a>`);

  main.innerHTML = `
    <div class="page-header">
      <h2>${escapeHtml(island.name)}</h2>
      <p>${escapeHtml(island.goal)}</p>
    </div>

    <div class="stats-row mb-16">
      <div class="stat-card">
        <span class="stat-value">${total}</span>
        <span class="stat-label">Sentences</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">${mastered}</span>
        <span class="stat-label">Natural+</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">${total - mastered}</span>
        <span class="stat-label">Learning</span>
      </div>
    </div>

    <a href="#practice-active?mode=island&island=${islandId}" class="btn btn-primary btn-block mb-16">Practice This Island</a>

    <div class="card-list">
      ${sentences.map((s) => renderSentenceRow(s)).join('')}
    </div>`;

  bindSentenceRows();
}

function renderPatterns() {
  updateTopBar('Patterns', false);

  const cards = data.patterns.map((p) => {
    const count = getSentencesForPattern(p.id).length;
    return `
      <a href="#pattern/${p.id}" class="pattern-card">
        <h3>${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(p.meaning)}</p>
        <div class="pattern-formula">${escapeHtml(p.formula)}</div>
        <div class="island-meta" style="margin-top:10px">
          <span>${count} sentence${count !== 1 ? 's' : ''}</span>
        </div>
      </a>`;
  }).join('');

  main.innerHTML = `
    <div class="page-header">
      <h2>Grammar Patterns</h2>
      <p>Reusable structures across your islands.</p>
    </div>
    <div class="card-list">${cards}</div>`;
}

function renderPatternDetail(patternId) {
  const pattern = getPattern(patternId);
  if (!pattern) { navigate('#patterns'); return; }

  const sentences = getSentencesForPattern(patternId);

  updateTopBar(pattern.name, true, `
    <a href="#practice-active?mode=pattern&pattern=${patternId}" class="icon-btn" aria-label="Practice pattern">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
    </a>`);

  main.innerHTML = `
    <div class="pattern-card" style="margin-bottom:16px">
      <h3>${escapeHtml(pattern.name)}</h3>
      <div class="pattern-formula">${escapeHtml(pattern.formula)}</div>
      <p style="margin-top:12px">${escapeHtml(pattern.meaning)}</p>
      ${pattern.notes ? `<p style="margin-top:8px;color:var(--text-muted)">${escapeHtml(pattern.notes)}</p>` : ''}
    </div>

    <a href="#practice-active?mode=pattern&pattern=${patternId}" class="btn btn-primary btn-block mb-16">Practice Pattern</a>

    <div class="card-list">
      ${sentences.map((s) => renderSentenceRow(s, true)).join('')}
    </div>`;

  bindSentenceRows();
}

function renderSentenceDetail(sentenceId) {
  const sentence = data.sentences.find((s) => s.id === sentenceId);
  if (!sentence) { navigate('#islands'); return; }

  const island = getIsland(sentence.islandId);
  const fav = isFavorite(sentenceId);

  updateTopBar('Sentence', true, `
    <button type="button" class="icon-btn" id="fav-btn" aria-label="Toggle favorite">
      <span style="font-size:1.25rem;color:${fav ? '#e8a317' : 'inherit'}">★</span>
    </button>
    <button type="button" class="icon-btn" id="speak-btn" aria-label="Play audio">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 010 7.07"/></svg>
    </button>`);

  main.innerHTML = `
    <div class="sentence-detail">
      <div class="flashcard-label">${escapeHtml(island?.name || '')}</div>
      <div class="sentence-detail-english">${escapeHtml(sentence.english)}</div>
      <div class="pinyin-large">${escapeHtml(sentence.pinyin)}</div>
      <div class="detail-section">
        <h4>Characters</h4>
        <div class="hanzi-large">${escapeHtml(sentence.hanzi)}</div>
      </div>
      ${renderRevealContent(sentence, { showHeader: false })}
      <div class="sentence-detail-actions">
        <a href="#practice-active?mode=single&sentence=${sentenceId}" class="btn btn-primary">Practice</a>
        <button type="button" class="btn btn-ghost" id="speak-btn-2">🔊 Listen</button>
      </div>
    </div>`;

  $('#fav-btn')?.addEventListener('click', () => {
    toggleFavorite(sentenceId);
    render();
  });
  $('#speak-btn')?.addEventListener('click', () => speakHanzi(sentence.hanzi));
  $('#speak-btn-2')?.addEventListener('click', () => speakHanzi(sentence.hanzi));

  bindMasteryButtons();
}

function renderPracticeSetup() {
  updateTopBar('Practice', false);

  const islandChips = data.islands.map((i) => `
    <a href="#practice-active?mode=island&island=${i.id}" class="filter-chip">${escapeHtml(i.name.split('/')[0].trim())}</a>
  `).join('');

  main.innerHTML = `
    <div class="page-header">
      <h2>Practice</h2>
      <p>See English, say Mandarin aloud, then reveal.</p>
    </div>

    <div class="action-grid">
      <a href="#practice-active?mode=all" class="btn btn-primary btn-block">Practice All Sentences</a>
      <a href="#practice-active?mode=weak" class="btn btn-ghost btn-block">Review Weak Sentences</a>
      <a href="#practice-active?mode=favorites" class="btn btn-ghost btn-block">Practice Favorites</a>
      <a href="#shadow" class="btn btn-secondary btn-block">Shadow Mode</a>
    </div>

    <div class="filter-section">
      <h3>By Island</h3>
      <div class="chip-grid">${islandChips}</div>
    </div>`;
}

function buildPracticeQueue(params) {
  let queue = [...data.sentences];

  switch (params.mode) {
    case 'weak':
      queue = queue.filter((s) => getMastery(s.id) < 2);
      break;
    case 'favorites':
      queue = queue.filter((s) => isFavorite(s.id));
      break;
    case 'island':
      queue = queue.filter((s) => s.islandId === params.island);
      break;
    case 'pattern':
      queue = queue.filter((s) => s.patternIds?.includes(params.pattern));
      break;
    case 'single':
      queue = queue.filter((s) => s.id === params.sentence);
      break;
    default:
      break;
  }

  return shuffle(queue);
}

function renderPracticeActive(params) {
  if (!practiceState || practiceState.paramsKey !== JSON.stringify(params)) {
    const queue = buildPracticeQueue(params);
    if (!queue.length) {
      updateTopBar('Practice', true);
      main.innerHTML = `
        <div class="empty-state">
          <h3>No sentences to practice</h3>
          <p>Try a different filter or add more sentences.</p>
          <a href="#practice" class="btn btn-primary mt-16">Back to Practice</a>
        </div>`;
      return;
    }
    practiceState = {
      queue,
      index: 0,
      revealed: false,
      paramsKey: JSON.stringify(params),
    };
  }

  const { queue, index, revealed } = practiceState;
  const sentence = queue[index];
  const pct = Math.round(((index) / queue.length) * 100);

  updateTopBar(`Practice ${index + 1}/${queue.length}`, true);

  main.innerHTML = `
    <div class="practice-container">
      <div class="practice-progress">
        <span>${index + 1} / ${queue.length}</span>
        <div class="practice-progress-bar">
          <div class="practice-progress-fill" style="width:${pct}%"></div>
        </div>
      </div>

      <div class="flashcard">
        <div class="flashcard-prompt">
          <div class="flashcard-label">Say it in Mandarin</div>
          <div class="flashcard-english">${escapeHtml(sentence.english)}</div>
          ${!revealed ? '<p class="flashcard-hint">Try speaking aloud before revealing</p>' : ''}
        </div>
        ${revealed ? `
          <div class="flashcard-reveal">
            <div class="audio-controls">
              <button type="button" class="btn btn-sm btn-ghost" id="speak-normal">🔊 Normal</button>
              <button type="button" class="btn btn-sm btn-ghost" id="speak-slow">🐢 Slow</button>
            </div>
            ${renderRevealContent(sentence)}
          </div>` : ''}
      </div>

      <div class="practice-controls">
        ${!revealed ? `
          <button type="button" class="btn btn-primary btn-block" id="reveal-btn">Reveal Answer</button>
        ` : `
          <div class="practice-controls-row">
            <button type="button" class="btn btn-ghost" id="detail-btn">Details</button>
            <button type="button" class="btn btn-primary" id="next-btn">Next →</button>
          </div>
        `}
        <button type="button" class="btn btn-secondary btn-block" id="skip-btn">Skip</button>
      </div>
    </div>`;

  $('#reveal-btn')?.addEventListener('click', () => {
    practiceState.revealed = true;
    render();
    speakHanzi(sentence.hanzi);
  });

  $('#speak-normal')?.addEventListener('click', () => speakHanzi(sentence.hanzi, 0.85));
  $('#speak-slow')?.addEventListener('click', () => speakHanzi(sentence.hanzi, 0.55));

  $('#next-btn')?.addEventListener('click', () => {
    practiceState.index++;
    practiceState.revealed = false;
    if (practiceState.index >= practiceState.queue.length) {
      practiceState = null;
      main.innerHTML = `
        <div class="empty-state">
          <h3>Session complete! 🎉</h3>
          <p>Great work. Use these sentences in real life today.</p>
          <a href="#practice" class="btn btn-primary mt-16">Practice Again</a>
          <a href="#home" class="btn btn-ghost mt-16" style="display:block;margin-top:10px">Home</a>
        </div>`;
      updateTopBar('Done!', true);
      return;
    }
    render();
  });

  $('#skip-btn')?.addEventListener('click', () => {
    practiceState.revealed = false;
    practiceState.index++;
    if (practiceState.index >= practiceState.queue.length) {
      practiceState = null;
      navigate('#practice');
      return;
    }
    render();
  });

  $('#detail-btn')?.addEventListener('click', () => navigate(`#sentence/${sentence.id}`));

  bindMasteryButtons(() => {
    // stay on card after mastery update
  });
}

function renderShadow(params = {}) {
  if (!practiceState || practiceState.mode !== 'shadow') {
    let queue = shuffle([...data.sentences]);
    if (params.island) queue = queue.filter((s) => s.islandId === params.island);
    practiceState = {
      mode: 'shadow',
      queue,
      index: 0,
      step: 'listen',
    };
  }

  const { queue, index, step } = practiceState;
  const sentence = queue[index];

  if (!sentence) {
    updateTopBar('Shadow', true);
    main.innerHTML = `
      <div class="empty-state">
        <h3>Shadow session complete</h3>
        <a href="#home" class="btn btn-primary mt-16">Home</a>
      </div>`;
    practiceState = null;
    return;
  }

  updateTopBar(`Shadow ${index + 1}/${queue.length}`, true);

  const stepContent = {
    listen: `
      <div class="shadow-step">
        <div class="shadow-step-icon">👂</div>
        <h3>Listen</h3>
        <p>Pay attention to tones and rhythm.</p>
        <div class="hanzi-large mt-16">${escapeHtml(sentence.hanzi)}</div>
        <div class="pinyin-large">${escapeHtml(sentence.pinyin)}</div>
      </div>`,
    repeat: `
      <div class="shadow-step">
        <div class="shadow-step-icon">🗣️</div>
        <h3>Repeat aloud</h3>
        <p>Copy the pronunciation and flow.</p>
        <div class="hanzi-large mt-16">${escapeHtml(sentence.hanzi)}</div>
        <div class="pinyin-large">${escapeHtml(sentence.pinyin)}</div>
        <p class="mt-16" style="color:var(--text-muted)">${escapeHtml(sentence.english)}</p>
      </div>`,
    meaning: `
      <div class="shadow-step">
        <div class="shadow-step-icon">💡</div>
        <h3>Meaning</h3>
        <p>${escapeHtml(sentence.english)}</p>
        ${sentence.literal ? `<p class="mt-16" style="font-style:italic;color:var(--text-muted)">${escapeHtml(sentence.literal)}</p>` : ''}
      </div>`,
  };

  main.innerHTML = `
    <div class="practice-container">
      <div class="practice-progress">
        <span>${index + 1} / ${queue.length}</span>
        <div class="practice-progress-bar">
          <div class="practice-progress-fill" style="width:${Math.round((index / queue.length) * 100)}%"></div>
        </div>
      </div>

      <div class="flashcard">
        ${stepContent[step]}
      </div>

      <div class="practice-controls">
        <button type="button" class="btn btn-ghost btn-block" id="shadow-replay">🔊 Replay</button>
        <button type="button" class="btn btn-primary btn-block" id="shadow-next">
          ${step === 'listen' ? 'Ready to repeat' : step === 'repeat' ? 'Show meaning' : 'Next sentence'}
        </button>
      </div>
    </div>`;

  if (step === 'listen') {
    setTimeout(() => speakHanzi(sentence.hanzi, 0.8), 300);
  }

  $('#shadow-replay')?.addEventListener('click', () => speakHanzi(sentence.hanzi, 0.8));

  $('#shadow-next')?.addEventListener('click', () => {
    if (step === 'listen') {
      practiceState.step = 'repeat';
    } else if (step === 'repeat') {
      practiceState.step = 'meaning';
    } else {
      practiceState.index++;
      practiceState.step = 'listen';
    }
    render();
  });
}

function renderSearch() {
  updateTopBar('Search', false);

  main.innerHTML = `
    <div class="search-box">
      <div class="search-input-wrap">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input type="search" class="search-input" id="search-input"
          placeholder="English, hanzi, pinyin, tags…" autocomplete="off" enterkeyhint="search">
      </div>
      <div class="search-filters" id="search-filters">
        <button type="button" class="filter-chip active" data-filter="all">All</button>
        <button type="button" class="filter-chip" data-filter="weak">Weak</button>
        <button type="button" class="filter-chip" data-filter="favorites">★ Favorites</button>
      </div>
    </div>
    <div id="search-results">
      <p class="search-results-count">Type to search ${data.sentences.length} sentences</p>
    </div>`;

  const input = $('#search-input');
  let activeFilter = 'all';

  function doSearch() {
    const filters = {};
    if (activeFilter === 'weak') filters.weak = true;
    if (activeFilter === 'favorites') filters.favorites = true;
    const results = searchSentences(input.value, filters);
    const container = $('#search-results');
    container.innerHTML = `
      <p class="search-results-count">${results.length} result${results.length !== 1 ? 's' : ''}</p>
      <div class="card-list">
        ${results.length
          ? results.map((s) => renderSentenceRow(s, true)).join('')
          : '<div class="empty-state"><p>No matches found</p></div>'}
      </div>`;
    bindSentenceRows();
  }

  input.addEventListener('input', doSearch);

  $('#search-filters').addEventListener('click', (e) => {
    const chip = e.target.closest('.filter-chip');
    if (!chip) return;
    activeFilter = chip.dataset.filter;
    $('#search-filters').querySelectorAll('.filter-chip').forEach((c) => {
      c.classList.toggle('active', c === chip);
    });
    doSearch();
  });

  input.focus();
}

// ── Event binding ──

function bindSentenceRows() {
  main.querySelectorAll('[data-sentence]').forEach((el) => {
    if (el.classList.contains('mastery-btn')) return;
    el.addEventListener('click', () => {
      navigate(`#sentence/${el.dataset.sentence}`);
    });
  });
}

function bindMasteryButtons(onUpdate) {
  main.querySelectorAll('.mastery-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.sentence;
      const level = Number(btn.dataset.mastery);
      setMastery(id, level);
      main.querySelectorAll(`.mastery-btn[data-sentence="${id}"]`).forEach((b) => {
        b.classList.toggle('selected', Number(b.dataset.mastery) === level);
      });
      onUpdate?.();
    });
  });
}

// ── Main render router ──

function render() {
  const { view, parts, params } = parseHash();
  stopSpeech();
  setActiveNav(view);

  switch (view) {
    case 'home':
      renderHome();
      break;
    case 'islands':
      renderIslands();
      break;
    case 'island':
      renderIslandDetail(parts[0]);
      break;
    case 'patterns':
      renderPatterns();
      break;
    case 'pattern':
      renderPatternDetail(parts[0]);
      break;
    case 'sentence':
      renderSentenceDetail(parts[0]);
      break;
    case 'practice':
      practiceState = null;
      renderPracticeSetup();
      break;
    case 'practice-active':
      renderPracticeActive(params);
      break;
    case 'shadow':
      renderShadow(params);
      break;
    case 'search':
      renderSearch();
      break;
    default:
      navigate('#home');
  }
}

// ── Init ──

async function init() {
  progress = loadProgress();

  backBtn.addEventListener('click', goBack);

  try {
    const res = await fetch('starter-pack.json');
    if (!res.ok) throw new Error('Failed to load data');
    data = await res.json();
    render();
    window.addEventListener('hashchange', render);
  } catch (err) {
    main.innerHTML = `
      <div class="empty-state">
        <h3>Could not load data</h3>
        <p>${escapeHtml(err.message)}</p>
        <p style="margin-top:12px;font-size:0.85rem">Make sure starter-pack.json is in the same directory.</p>
      </div>`;
  }
}

init();
