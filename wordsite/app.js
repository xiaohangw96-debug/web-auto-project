// ===== 词根词缀记单词 — 主逻辑 =====

const STORAGE_KEY = 'wordroot_v2';

// ===== 持久化状态 =====
function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch {}
    return { revealed: [], mastered: [], currentRootIdx: 0, review: {} };
}
function saveState(s) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        revealed: [...s.revealed],
        mastered: [...s.mastered],
        currentRootIdx: s.currentRootIdx,
        review: s.review
    }));
}

// ===== 词根分组 =====
function getRootGroups() {
    const map = new Map();
    vocabularyData.forEach(w => {
        if (!map.has(w.root)) map.set(w.root, []);
        map.get(w.root).push(w);
    });
    // 保持 data.js 中出现顺序
    const seen = [];
    const groups = [];
    vocabularyData.forEach(w => {
        if (!seen.includes(w.root)) {
            seen.push(w.root);
            groups.push({
                root: w.root,
                meaning: w.rootMeaning,
                words: map.get(w.root)
            });
        }
    });
    return groups;
}

// ===== 词形变化生成 =====
function getVerbForms(w) {
    if (!isVerb(w.pos)) return null;
    if (w.verbForms) return w.verbForms;

    const word = w.word;
    // 规则动词
    let past, pastParticiple, presentParticiple;

    // 以 e 结尾
    if (word.endsWith('e')) {
        past = word + 'd';
        pastParticiple = word + 'd';
        presentParticiple = word.slice(0, -1) + 'ing';
    }
    // 辅音 + y 结尾
    else if (/[^aeiou]y$/.test(word)) {
        past = word.slice(0, -1) + 'ied';
        pastParticiple = word.slice(0, -1) + 'ied';
        presentParticiple = word + 'ing';
    }
    // 重读闭音节，双写末尾辅音 (简化规则：单音节且末尾是单辅音+单元音+单辅音)
    else if (/[aeiou][bdfgklmnpstvz]$/.test(word) && word.length <= 5) {
        const last = word[word.length - 1];
        past = word + last + 'ed';
        pastParticiple = word + last + 'ed';
        presentParticiple = word + last + 'ing';
    }
    else {
        past = word + 'ed';
        pastParticiple = word + 'ed';
        presentParticiple = word + 'ing';
    }

    // 特殊处理 -c 结尾 → -cked
    if (word.endsWith('c')) {
        past = word + 'ked';
        pastParticiple = word + 'ked';
        presentParticiple = word + 'king';
    }

    return { past, pastParticiple, presentParticiple };
}

function isVerb(pos) {
    return pos.includes('v');
}

function formatPos(pos) {
    const map = { v: '动', n: '名', adj: '形', adv: '副', prep: '介' };
    return pos.split('/').map(p => map[p] || p).join('/');
}

// ===== 语音朗读 =====
let speaking = null;
function speakWord(word) {
    if (speaking) {
        speechSynthesis.cancel();
        speaking = null;
    }
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        setTimeout(() => doSpeak(word), 100);
    } else {
        doSpeak(word);
    }
}
function doSpeak(word) {
    const u = new SpeechSynthesisUtterance(word);
    u.lang = 'en-US';
    u.rate = 0.85;
    u.pitch = 1;
    // 通知按钮更新
    u.onstart = () => {
        speaking = word;
        updateSoundButtons(word);
    };
    u.onend = () => {
        speaking = null;
        updateSoundButtons(null);
    };
    u.onerror = () => {
        speaking = null;
        updateSoundButtons(null);
    };
    speechSynthesis.speak(u);
}
function updateSoundButtons(activeWord) {
    document.querySelectorAll('.btn-sound').forEach(btn => {
        if (activeWord && btn.dataset.word === activeWord) {
            btn.classList.add('playing');
            btn.textContent = '🔊';
        } else {
            btn.classList.remove('playing');
            btn.textContent = '🔈';
        }
    });
}

// ===== 状态管理 =====
const state = {
    revealed: new Set(),
    mastered: new Set(),
    review: {},   // { word: timestamp } — 记录"不认识"的时间
    currentRootIdx: 0
};

function initState() {
    const saved = loadState();
    state.revealed = new Set(saved.revealed || []);
    state.mastered = new Set(saved.mastered || []);
    state.review = saved.review || {};
    state.currentRootIdx = saved.currentRootIdx || 0;
    // 确保 currentRootIdx 有效
    const groups = getRootGroups();
    if (state.currentRootIdx >= groups.length) state.currentRootIdx = 0;
}

// ===== 复习队列 =====
const REVIEW_DELAY = 24 * 60 * 60 * 1000; // 24小时

function addToReview(word) {
    if (!state.review[word]) {
        state.review[word] = Date.now();
        persist();
    }
}
function removeFromReview(word) {
    delete state.review[word];
    persist();
}
function resetReviewTimer(word) {
    state.review[word] = Date.now();
    persist();
}
// 获取当前到期的复习单词（时间戳已过24h）
function getDueReviews() {
    const now = Date.now();
    return Object.entries(state.review)
        .filter(([, ts]) => now - ts >= REVIEW_DELAY)
        .map(([word]) => vocabularyData.find(w => w.word === word))
        .filter(Boolean);
}
function getDueReviewCount() {
    return getDueReviews().length;
}

function persist() {
    saveState(state);
}

function isRevealed(word) { return state.revealed.has(word); }
function isMastered(word) { return state.mastered.has(word); }

function revealWord(word) {
    state.revealed.add(word);
    persist();
}
function showWordContent(idx, word) {
    const hidden = document.getElementById('hidden-' + idx);
    const content = document.getElementById('content-' + idx);
    const card = document.getElementById('card-' + word.replace(/\s/g, '_'));
    if (hidden) hidden.style.display = 'none';
    if (content) content.classList.add('show');
    if (card) card.classList.add('revealed');
}
function markMastered(word, val) {
    if (val) state.mastered.add(word);
    else state.mastered.delete(word);
    persist();
}
function setCurrentRoot(idx) {
    state.currentRootIdx = idx;
    persist();
}

// ===== 全局进度 =====
function updateGlobalProgress() {
    const total = vocabularyData.length;
    const mastered = state.mastered.size;
    const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;
    document.getElementById('globalProgress').textContent = pct + '%';
    document.getElementById('globalMastered').textContent = mastered + ' / ' + total;
    document.getElementById('globalProgressFill').style.width = pct + '%';
}

// ===== 词根导航 =====
function renderRootNav() {
    const nav = document.getElementById('rootNav');
    const groups = getRootGroups();
    nav.innerHTML = '';

    groups.forEach((g, i) => {
        const chip = document.createElement('button');
        chip.className = 'root-chip';
        if (i === state.currentRootIdx) chip.classList.add('active');

        // 统计
        const total = g.words.length;
        const revealedCount = g.words.filter(w => isRevealed(w.word)).length;
        const masteredCount = g.words.filter(w => isMastered(w.word)).length;
        if (masteredCount === total) chip.classList.add('done');

        chip.innerHTML = `
            <div>${g.root}</div>
            <div style="font-size:11px;opacity:.7">${g.meaning}</div>
            <div class="dot-row">
                ${g.words.map(w => {
                    let cls = '';
                    if (isMastered(w.word)) cls = 'mastered';
                    else if (isRevealed(w.word)) cls = 'revealed';
                    return `<span class="dot ${cls}"></span>`;
                }).join('')}
            </div>
        `;

        chip.addEventListener('click', () => {
            if (i !== state.currentRootIdx) {
                setCurrentRoot(i);
                document.querySelectorAll('.root-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                renderCurrentRoot();
                renderRootNav(); // refresh dots
                // 滚动到视图
                chip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        });

        nav.appendChild(chip);
    });

    // 滚动当前选中的 chip 到视图
    setTimeout(() => {
        const active = nav.querySelector('.root-chip.active');
        if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }, 100);
}

// ===== 当前词根学习区 =====
function renderCurrentRoot() {
    const groups = getRootGroups();
    const group = groups[state.currentRootIdx];
    if (!group) return;

    // 词根头部
    const header = document.getElementById('rootHeader');
    const total = group.words.length;
    const masteredCount = group.words.filter(w => isMastered(w.word)).length;
    const revealedCount = group.words.filter(w => isRevealed(w.word)).length;

    header.innerHTML = `
        <h2>${group.root}</h2>
        <div class="root-info">${group.meaning} · 已完成 ${masteredCount}/${total} · 已学 ${revealedCount}/${total}</div>
        <div class="root-mini-progress">
            ${group.words.map(w => {
                let cls = '';
                if (isMastered(w.word)) cls = 'mastered';
                else if (isRevealed(w.word)) cls = 'revealed';
                return `<span class="mini-dot ${cls}" title="${w.word}"></span>`;
            }).join('')}
        </div>
    `;

    // 单词卡片
    const container = document.getElementById('wordCards');
    container.innerHTML = '';

    group.words.forEach((w, idx) => {
        const card = document.createElement('div');
        const revealed = isRevealed(w.word);
        const mastered = isMastered(w.word);
        card.className = 'word-card' + (mastered ? ' mastered' : '') + (revealed ? ' revealed' : '');
        card.id = 'card-' + w.word.replace(/\s/g, '_');

        const verbForms = getVerbForms(w);

        card.innerHTML = `
            <div class="card-main">
                ${mastered ? '<div class="card-status">✓ 已掌握</div>' : ''}
                <div class="card-word-row">
                    <span class="card-word">${w.word}</span>
                    <span class="card-pos">${formatPos(w.pos)}</span>
                    <button class="btn-sound" data-word="${w.word}" title="发音">🔈</button>
                </div>
                <div class="card-phonetic">${w.phonetic}</div>

                <div class="card-hidden-area" id="hidden-${idx}" style="${revealed ? 'display:none' : ''}">
                    <div class="reveal-hint">👆 点击"我认识"查看释义</div>
                </div>

                <div class="card-revealed-content ${revealed ? 'show' : ''}" id="content-${idx}">
                    <div class="card-meaning">${w.meaning}</div>
                    <div class="card-analysis">
                        词根<strong>${w.root}</strong>（${w.rootMeaning}）<br>${w.analysis}
                    </div>
                    ${verbForms ? `
                    <div class="card-verb-forms">
                        <span class="verb-form">过去式 <strong>${verbForms.past}</strong></span>
                        <span class="verb-form">过去分词 <strong>${verbForms.pastParticiple}</strong></span>
                        <span class="verb-form">现在分词 <strong>${verbForms.presentParticiple}</strong></span>
                    </div>` : ''}
                    <div class="card-example">${w.example}</div>
                    <div class="card-example-cn">${w.exampleCn}</div>
                </div>

                <div class="card-actions">
                    ${!revealed ? `
                        <button class="btn small primary reveal-btn" data-idx="${idx}" data-word="${w.word}">我认识</button>
                        <button class="btn small danger dontknow-btn" data-idx="${idx}" data-word="${w.word}">不认识</button>
                    ` : ''}
                    ${revealed && !mastered ? `
                        <button class="btn small success mastered-btn" data-idx="${idx}" data-word="${w.word}">记住了</button>
                        <button class="btn small outline unmastered-btn" data-idx="${idx}" data-word="${w.word}">没记住</button>
                    ` : ''}
                    ${mastered ? `
                        <button class="btn small secondary mastered-btn" data-idx="${idx}" data-word="${w.word}">取消掌握</button>
                    ` : ''}
                </div>
            </div>
        `;

        container.appendChild(card);
    });

    // 绑定事件
    bindCardEvents();
}

// ===== 事件委托（学习卡片 + 搜索结果） =====
function setupDelegation() {
    // 学习区卡片
    const learnCards = document.getElementById('wordCards');
    if (learnCards) {
        learnCards.addEventListener('click', handleCardClick);
    }
    // 搜索结果区
    const searchResults = document.getElementById('searchResults');
    if (searchResults) {
        searchResults.addEventListener('click', handleCardClick);
    }
    // 复习区
    const reviewCards = document.getElementById('reviewCards');
    if (reviewCards) {
        reviewCards.addEventListener('click', handleCardClick);
    }
}

function handleCardClick(e) {
    const btn = e.target.closest('button');
    if (!btn) return;

    const word = btn.dataset.word;
    const idx = parseInt(btn.dataset.idx);

    // 发音按钮
    if (btn.classList.contains('btn-sound')) {
        e.stopPropagation();
        speakWord(word);
        return;
    }

    // "我认识" 按钮
    if (btn.classList.contains('reveal-btn')) {
        e.stopPropagation();
        if (!isRevealed(word)) {
            revealWord(word);
            showWordContent(idx, word);
            refreshCardActions(idx, word);
        }
        return;
    }

    // "不认识" 按钮
    if (btn.classList.contains('dontknow-btn')) {
        e.stopPropagation();
        if (!isRevealed(word)) {
            revealWord(word);
            addToReview(word);
            showWordContent(idx, word);
            refreshCardActions(idx, word);
            updateReviewBadge();
        }
        return;
    }

    // "记住了" / "取消掌握"
    if (btn.classList.contains('mastered-btn')) {
        e.stopPropagation();
        if (isMastered(word)) {
            markMastered(word, false);
        } else {
            markMastered(word, true);
        }
        refreshCardActions(idx, word);
        const card = document.getElementById('card-' + word.replace(/\s/g, '_'));
        if (card) {
            if (isMastered(word)) card.classList.add('mastered');
            else card.classList.remove('mastered');
        }
        updateGlobalProgress();
        renderRootNav();
        renderCurrentRootHeader();
        checkAutoAdvance();
        return;
    }

    // "没记住"
    if (btn.classList.contains('unmastered-btn')) {
        e.stopPropagation();
        markMastered(word, false);
        state.revealed.delete(word);
        persist();

        const hidden = document.getElementById('hidden-' + idx);
        const content = document.getElementById('content-' + idx);
        const card = document.getElementById('card-' + word.replace(/\s/g, '_'));
        if (hidden) hidden.style.display = '';
        if (content) content.classList.remove('show');
        if (card) {
            card.classList.remove('revealed', 'mastered');
            const statusEl = card.querySelector('.card-status');
            if (statusEl) statusEl.remove();
        }
        refreshCardActions(idx, word);
        renderRootNav();
        renderCurrentRootHeader();
        return;
    }

    // 搜索结果中的掌握按钮
    if (btn.classList.contains('search-master-btn')) {
        e.stopPropagation();
        markMastered(word, !isMastered(word));
        renderSearch(document.getElementById('searchInput').value);
        updateGlobalProgress();
        renderRootNav();
        return;
    }

    // 复习面板 - "记住了"
    if (btn.classList.contains('review-master-btn')) {
        e.stopPropagation();
        removeFromReview(word);
        markMastered(word, true);
        revealWord(word);
        updateGlobalProgress();
        renderRootNav();
        renderReviewPanel();
        updateReviewBadge();
        checkAutoAdvance();
        return;
    }

    // 复习面板 - "还是没记住"
    if (btn.classList.contains('review-retry-btn')) {
        e.stopPropagation();
        resetReviewTimer(word); // 重新计时24小时
        renderReviewPanel();
        updateReviewBadge();
        return;
    }
}

function bindCardEvents() {
    // 委托已处理，此处保留兼容
}

function refreshCardActions(idx, word) {
    const card = document.getElementById('card-' + word.replace(/\s/g, '_'));
    if (!card) return;
    const actions = card.querySelector('.card-actions');
    if (!actions) return;

    const mastered = isMastered(word);
    const revealed = isRevealed(word);

    actions.innerHTML = `
        ${!revealed ? `
            <button class="btn small primary reveal-btn" data-idx="${idx}" data-word="${word}">我认识</button>
            <button class="btn small danger dontknow-btn" data-idx="${idx}" data-word="${word}">不认识</button>
        ` : ''}
        ${revealed && !mastered ? `
            <button class="btn small success mastered-btn" data-idx="${idx}" data-word="${word}">记住了</button>
            <button class="btn small outline unmastered-btn" data-idx="${idx}" data-word="${word}">没记住</button>
        ` : ''}
        ${mastered ? `
            <button class="btn small secondary mastered-btn" data-idx="${idx}" data-word="${word}">取消掌握</button>
        ` : ''}
    `;

    // 更新 mastered 状态图标
    let statusEl = card.querySelector('.card-status');
    if (mastered) {
        if (!statusEl) {
            statusEl = document.createElement('div');
            statusEl.className = 'card-status';
            statusEl.textContent = '✓ 已掌握';
            card.querySelector('.card-main').prepend(statusEl);
        }
        card.classList.add('mastered');
    } else {
        if (statusEl) statusEl.remove();
        card.classList.remove('mastered');
    }

    // 重新绑定
    bindCardEvents();
}

function renderCurrentRootHeader() {
    const groups = getRootGroups();
    const group = groups[state.currentRootIdx];
    if (!group) return;
    const header = document.getElementById('rootHeader');
    const total = group.words.length;
    const masteredCount = group.words.filter(w => isMastered(w.word)).length;
    const revealedCount = group.words.filter(w => isRevealed(w.word)).length;
    header.innerHTML = `
        <h2>${group.root}</h2>
        <div class="root-info">${group.meaning} · 已完成 ${masteredCount}/${total} · 已学 ${revealedCount}/${total}</div>
        <div class="root-mini-progress">
            ${group.words.map(w => {
                let cls = '';
                if (isMastered(w.word)) cls = 'mastered';
                else if (isRevealed(w.word)) cls = 'revealed';
                return `<span class="mini-dot ${cls}" title="${w.word}"></span>`;
            }).join('')}
        </div>
    `;
}

// ===== 自动跳转 =====
let autoAdvanceTimer = null;
function checkAutoAdvance() {
    const groups = getRootGroups();
    const group = groups[state.currentRootIdx];
    if (!group) return;

    const allMastered = group.words.every(w => isMastered(w.word));

    if (allMastered && state.currentRootIdx < groups.length - 1) {
        // 全部掌握，自动跳转
        if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
        autoAdvanceTimer = setTimeout(() => {
            const nextIdx = state.currentRootIdx + 1;
            setCurrentRoot(nextIdx);
            renderRootNav();
            renderCurrentRoot();
            updateGlobalProgress();
            showToast(`已自动切换到下一词根：${groups[nextIdx].root}（${groups[nextIdx].meaning}）`);
        }, 1500);
    }
}

function showToast(msg) {
    const existing = document.querySelector('.auto-advance-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'auto-advance-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

// ===== 测验 =====
function generateQuiz(count, type, scope) {
    let pool = [];
    if (scope === 'current') {
        const groups = getRootGroups();
        pool = [...groups[state.currentRootIdx].words];
    } else if (scope === 'unmastered') {
        pool = vocabularyData.filter(w => !isMastered(w.word));
    } else {
        pool = [...vocabularyData];
    }

    shuffle(pool);
    const selected = pool.slice(0, Math.min(count, pool.length));
    const questions = [];

    selected.forEach(target => {
        let q;
        if (type === 'mixed') {
            const types = ['meaning', 'word', 'root'];
            q = makeQuestion(target, types[Math.floor(Math.random() * types.length)], pool);
        } else {
            q = makeQuestion(target, type, pool);
        }
        questions.push(q);
    });
    return questions;
}

function makeQuestion(target, type, pool) {
    const distractors = pool
        .filter(w => w.word !== target.word)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    const options = [target, ...distractors];
    shuffle(options);

    if (type === 'meaning') {
        return {
            prompt: '这个词的释义是什么？',
            question: target.word,
            questionExtra: target.phonetic,
            questionType: 'word',
            options: options.map(w => w.meaning),
            correctIndex: options.findIndex(w => w.word === target.word),
            correctAnswer: target.meaning,
            correctWord: target,
            analysisTip: `词根：${target.root}（${target.rootMeaning}）— ${target.analysis}`
        };
    } else if (type === 'word') {
        return {
            prompt: '以下哪个单词是这个意思？',
            question: target.meaning,
            questionType: 'meaning',
            options: options.map(w => w.word),
            correctIndex: options.findIndex(w => w.word === target.word),
            correctAnswer: target.word,
            correctWord: target,
            analysisTip: `词根：${target.root}（${target.rootMeaning}）— ${target.analysis}`
        };
    } else {
        return {
            prompt: `以下哪个单词包含词根「${target.root}（${target.rootMeaning}）」？`,
            question: `词根：${target.root}（${target.rootMeaning}）`,
            questionType: 'root',
            options: options.map(w => w.word),
            correctIndex: options.findIndex(w => w.word === target.word),
            correctAnswer: target.word,
            correctWord: target,
            analysisTip: `${target.word}：${target.analysis}`
        };
    }
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

const quizState = { questions: [], current: 0, score: 0, wrong: [], answered: false };

function startQuiz() {
    const count = parseInt(document.getElementById('quizCount').value);
    const type = document.getElementById('quizType').value;
    const scope = document.getElementById('quizScope').value;

    quizState.questions = generateQuiz(count, type, scope);
    quizState.current = 0;
    quizState.score = 0;
    quizState.wrong = [];
    quizState.answered = false;

    document.querySelector('.quiz-setup').classList.add('hidden');
    document.getElementById('quizArea').classList.remove('hidden');
    document.getElementById('quizResult').classList.add('hidden');
    document.getElementById('quizNext').classList.add('hidden');
    document.getElementById('quizFeedback').classList.add('hidden');

    renderQuizQuestion();
}

function renderQuizQuestion() {
    const q = quizState.questions[quizState.current];
    quizState.answered = false;
    document.getElementById('quizNext').classList.add('hidden');
    document.getElementById('quizFeedback').classList.add('hidden');

    const pct = (quizState.current / quizState.questions.length) * 100;
    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('quizProgress').textContent = `第 ${quizState.current + 1} / ${quizState.questions.length} 题`;

    const area = document.getElementById('quizQuestion');
    if (q.questionType === 'word') {
        area.innerHTML = `<div class="q-word">${q.question}</div><div class="q-phonetic">${q.questionExtra}</div><div class="q-prompt">${q.prompt}</div>`;
    } else if (q.questionType === 'meaning') {
        area.innerHTML = `<div class="q-prompt">${q.prompt}</div><div class="q-meaning">${q.question}</div>`;
    } else {
        area.innerHTML = `<div class="q-prompt">${q.prompt}</div>`;
    }

    const opts = document.getElementById('quizOptions');
    opts.innerHTML = '';
    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = opt;
        btn.addEventListener('click', () => onQuizAnswer(i));
        opts.appendChild(btn);
    });
}

function onQuizAnswer(index) {
    if (quizState.answered) return;
    quizState.answered = true;

    const q = quizState.questions[quizState.current];
    const isCorrect = index === q.correctIndex;
    const fb = document.getElementById('quizFeedback');
    const allOpts = document.querySelectorAll('.quiz-option');

    allOpts.forEach((btn, i) => {
        btn.disabled = true;
        if (i === q.correctIndex) btn.classList.add('correct');
        if (i === index && !isCorrect) btn.classList.add('wrong');
    });

    if (isCorrect) {
        quizState.score++;
        fb.className = 'quiz-feedback right';
        fb.innerHTML = `✓ 正确！${q.analysisTip}`;
    } else {
        quizState.wrong.push(q.correctWord);
        fb.className = 'quiz-feedback wrong';
        fb.innerHTML = `✗ 错误！正确答案是「${q.correctAnswer}」。<br>${q.analysisTip}`;
    }
    fb.classList.remove('hidden');

    const nextBtn = document.getElementById('quizNext');
    nextBtn.classList.remove('hidden');
    nextBtn.textContent = quizState.current < quizState.questions.length - 1 ? '下一题' : '查看结果';
}

function nextQuizQuestion() {
    quizState.current++;
    if (quizState.current >= quizState.questions.length) {
        showQuizResult();
    } else {
        renderQuizQuestion();
    }
}

function showQuizResult() {
    document.getElementById('quizArea').classList.add('hidden');
    const resultDiv = document.getElementById('quizResult');
    resultDiv.classList.remove('hidden');

    const total = quizState.questions.length;
    const score = quizState.score;
    const pct = Math.round((score / total) * 100);
    let emoji = pct >= 90 ? '🎉' : pct >= 70 ? '👍' : pct >= 50 ? '📚' : '💪';

    document.getElementById('resultScore').innerHTML = `${emoji} ${score} / ${total} (${pct}%)`;

    const wrongDiv = document.getElementById('resultWrong');
    if (quizState.wrong.length === 0) {
        wrongDiv.innerHTML = '<p style="color:var(--success);text-align:center">全部正确，太棒了！</p>';
    } else {
        wrongDiv.innerHTML = '<h3 style="margin-bottom:12px">需要复习的单词：</h3>' +
            quizState.wrong.map(w => `
                <div class="wrong-item">
                    <div class="wrong-word">${w.word} — ${w.meaning}</div>
                    <div class="wrong-meaning">词根：${w.root}（${w.rootMeaning}）— ${w.analysis}</div>
                </div>
            `).join('');
    }
}

// ===== 搜索 =====
function renderSearch(query) {
    const container = document.getElementById('searchResults');
    if (!query.trim()) {
        container.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:40px;">输入关键词搜索单词</p>';
        return;
    }
    const q = query.toLowerCase();
    const results = vocabularyData.filter(w =>
        w.word.toLowerCase().includes(q) ||
        w.meaning.includes(q) ||
        w.root.toLowerCase().includes(q) ||
        w.analysis.includes(q)
    );
    if (results.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:40px;">没有匹配的单词</p>';
        return;
    }
    container.innerHTML = '';
    results.forEach(w => {
        const verbForms = getVerbForms(w);
        const card = document.createElement('div');
        card.className = 'word-card revealed';
        card.innerHTML = `
            <div class="card-main">
                <div class="card-word-row">
                    <span class="card-word">${w.word}</span>
                    <span class="card-pos">${formatPos(w.pos)}</span>
                    <button class="btn-sound" data-word="${w.word}" title="发音">🔈</button>
                </div>
                <div class="card-phonetic">${w.phonetic}</div>
                <div class="card-meaning">${w.meaning}</div>
                <div class="card-analysis">词根<strong>${w.root}</strong>（${w.rootMeaning}）— ${w.analysis}</div>
                ${verbForms ? `
                <div class="card-verb-forms">
                    <span class="verb-form">过去式 <strong>${verbForms.past}</strong></span>
                    <span class="verb-form">过去分词 <strong>${verbForms.pastParticiple}</strong></span>
                    <span class="verb-form">现在分词 <strong>${verbForms.presentParticiple}</strong></span>
                </div>` : ''}
                <div class="card-example">${w.example}</div>
                <div class="card-example-cn">${w.exampleCn}</div>
                <div class="card-actions">
                    <button class="btn small ${isMastered(w.word) ? 'secondary' : 'success'} search-master-btn" data-word="${w.word}">
                        ${isMastered(w.word) ? '取消掌握' : '记住了'}
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// ===== 底部导航 =====
function switchPanel(panelId) {
    document.querySelectorAll('.bnav').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('#learnPanel, #quizPanel, #searchPanel, #reviewPanel').forEach(p => p.classList.add('hidden'));

    const panel = document.getElementById(panelId);
    panel.classList.remove('hidden');

    const navMap = { learnPanel: 0, reviewPanel: 1, quizPanel: 2, searchPanel: 3 };
    document.querySelectorAll('.bnav')[navMap[panelId]].classList.add('active');

    if (panelId === 'reviewPanel') renderReviewPanel();
}

// ===== 复习面板 =====
function renderReviewPanel() {
    const dueWords = getDueReviews();
    const container = document.getElementById('reviewCards');
    const empty = document.getElementById('reviewEmpty');
    const subtitle = document.getElementById('reviewSubtitle');

    subtitle.textContent = `共 ${dueWords.length} 个单词等待复习（点击"不认识"24小时后出现）`;

    if (dueWords.length === 0) {
        container.innerHTML = '';
        empty.classList.remove('hidden');
    } else {
        empty.classList.add('hidden');
        container.innerHTML = '';
        dueWords.forEach(w => {
            const verbForms = getVerbForms(w);
            const idx = vocabularyData.indexOf(w);
            const card = document.createElement('div');
            card.className = 'word-card revealed';
            card.innerHTML = `
                <div class="card-main">
                    <div class="card-word-row">
                        <span class="card-word">${w.word}</span>
                        <span class="card-pos">${formatPos(w.pos)}</span>
                        <button class="btn-sound" data-word="${w.word}" title="发音">🔈</button>
                    </div>
                    <div class="card-phonetic">${w.phonetic}</div>
                    <div class="card-meaning">${w.meaning}</div>
                    <div class="card-analysis">词根<strong>${w.root}</strong>（${w.rootMeaning}）— ${w.analysis}</div>
                    ${verbForms ? `
                    <div class="card-verb-forms">
                        <span class="verb-form">过去式 <strong>${verbForms.past}</strong></span>
                        <span class="verb-form">过去分词 <strong>${verbForms.pastParticiple}</strong></span>
                        <span class="verb-form">现在分词 <strong>${verbForms.presentParticiple}</strong></span>
                    </div>` : ''}
                    <div class="card-example">${w.example}</div>
                    <div class="card-example-cn">${w.exampleCn}</div>
                    <div class="card-actions">
                        <button class="btn small success review-master-btn" data-idx="${idx}" data-word="${w.word}">记住了</button>
                        <button class="btn small outline review-retry-btn" data-idx="${idx}" data-word="${w.word}">还是没记住</button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }
    updateReviewBadge();
}

function updateReviewBadge() {
    const badge = document.getElementById('reviewBadge');
    const count = getDueReviewCount();
    if (count > 0) {
        badge.textContent = count;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

// ===== 初始化 =====
function init() {
    initState();
    setupDelegation();

    // 渲染初始界面
    renderRootNav();
    renderCurrentRoot();
    updateGlobalProgress();
    updateReviewBadge();

    // 滚动当前选中词根到视图
    setTimeout(() => {
        const active = document.querySelector('.root-chip.active');
        if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }, 300);

    // 底部导航
    document.querySelectorAll('.bnav').forEach(btn => {
        btn.addEventListener('click', () => switchPanel(btn.dataset.panel));
    });

    // 测验按钮
    document.getElementById('startQuiz').addEventListener('click', startQuiz);
    document.getElementById('quizNext').addEventListener('click', nextQuizQuestion);
    document.getElementById('quizRetry').addEventListener('click', () => {
        document.getElementById('quizResult').classList.add('hidden');
        document.querySelector('.quiz-setup').classList.remove('hidden');
    });

    // 搜索
    document.getElementById('searchInput').addEventListener('input', e => {
        renderSearch(e.target.value);
    });
}

document.addEventListener('DOMContentLoaded', init);
