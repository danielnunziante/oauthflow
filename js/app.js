// ─── Helpers ──────────────────────────────────────────────

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ─── SVG icon constants ────────────────────────────────────

const CHECK_ICON = `<svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12" aria-hidden="true"><path fill-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd"/></svg>`;

const COPY_ICON = `<svg class="copy-icon" viewBox="0 0 16 16" fill="currentColor" width="14" height="14" aria-hidden="true"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"/><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/></svg>`;

const COPIED_ICON = `<svg class="copy-icon" viewBox="0 0 16 16" fill="currentColor" width="14" height="14" aria-hidden="true"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd"/></svg>`;

const INFO_ICON = `<svg class="callout-icon" viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clip-rule="evenodd"/></svg>`;

const WARN_ICON = `<svg class="callout-icon" viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" clip-rule="evenodd"/></svg>`;

const DANGER_ICON = `<svg class="error-icon" viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd"/></svg>`;

const WARNING_ICON = `<svg class="error-icon" viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" clip-rule="evenodd"/></svg>`;

// ─── Render step card ──────────────────────────────────────

function renderStep(step) {
  const warningHtml = step.warning
    ? `<div class="warning-inline">${WARN_ICON}${step.warning}</div>`
    : '';
  const stepNum = String(step.id).padStart(2, '0');

  return `
    <article class="step-card" id="paso-${step.id}">
      <div class="step-card-header">
        <div class="step-number-badge">${step.id}</div>
        <div class="step-header-text">
          <div class="step-title">${step.title}</div>
          <div class="step-subtitle">${step.subtitle}</div>
        </div>
        <span class="step-decorative-num" aria-hidden="true">${stepNum}</span>
        <span class="step-badge" id="badge-${step.id}">${CHECK_ICON} Completado</span>
      </div>
      <div class="step-body">
        <p class="step-description">${step.description}</p>
        <div class="code-block">
          <div class="code-block-header">
            <span>${step.codeLabel}</span>
            <button class="copy-btn" data-step="${step.id}" aria-label="Copiar código del paso ${step.id}">
              ${COPY_ICON}<span class="copy-text">Copiar</span>
            </button>
          </div>
          <pre><code class="language-${step.codeLang}">${escapeHtml(step.code)}</code></pre>
        </div>
        ${warningHtml}
        <div class="tip">${INFO_ICON}${step.tip}</div>
        <button class="complete-btn" data-complete="${step.id}">
          ${CHECK_ICON} Marcar como completado
        </button>
      </div>
    </article>
  `;
}

// ─── Render error card ─────────────────────────────────────

function renderError(error) {
  const icon = error.type === 'danger' ? DANGER_ICON : WARNING_ICON;

  return `
    <div class="error-card ${error.type}">
      <div class="error-card-header">
        ${icon}
        <span class="error-code">${error.code}</span>
      </div>
      <div class="error-cause">${error.cause}</div>
      <div class="error-solution">${error.solution}</div>
    </div>
  `;
}

// ─── State ─────────────────────────────────────────────────
const STORAGE_KEY = 'oauth-flow-completed-steps';
let currentActiveStep = 1;
let completedSteps = new Set();

// ─── localStorage persistence ───────────────────────────────

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSteps]));
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    completedSteps = new Set(raw ? JSON.parse(raw) : []);
  } catch {
    completedSteps = new Set();
  }
}

function updateProgress() {
  const count = completedSteps.size;
  const total = STEPS.length;
  const pct   = total > 0 ? (count / total) * 100 : 0;

  const fill = document.getElementById('progress-fill');
  const text = document.getElementById('progress-text');
  const bar  = document.getElementById('progress-bar');

  if (fill) fill.style.width = `${pct}%`;
  if (text) text.textContent = `${count} de ${total} pasos completados`;
  if (bar)  bar.setAttribute('aria-valuenow', String(count));
}

function restoreCompletedBadges() {
  completedSteps.forEach((stepId) => {
    const badge = document.getElementById(`badge-${stepId}`);
    if (badge) badge.style.display = 'inline-flex';

    const btn = document.querySelector(`.complete-btn[data-complete="${stepId}"]`);
    if (btn) btn.style.display = 'none';
  });
}

// ─── Mark step as done ──────────────────────────────────────

function markStepDone(stepId) {
  if (completedSteps.has(stepId)) return;

  completedSteps.add(stepId);
  saveProgress();
  updateProgress();
  updateSidebarState(currentActiveStep);

  const badge = document.getElementById(`badge-${stepId}`);
  if (badge) badge.style.display = 'inline-flex';

  const btn = document.querySelector(`.complete-btn[data-complete="${stepId}"]`);
  if (btn) btn.style.display = 'none';
}

// ─── Wire complete buttons ──────────────────────────────────

function initCompleteButtons() {
  document.querySelectorAll('.complete-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const stepId = parseInt(btn.dataset.complete, 10);
      if (!Number.isFinite(stepId)) return;
      markStepDone(stepId);
    });
  });
}

// ─── Sidebar render ────────────────────────────────────────

function renderSidebar() {
  const container = document.getElementById('sidebar-steps');
  if (!container) return;

  let html = '';
  STEPS.forEach((step, index) => {
    const hasLine = index < STEPS.length - 1;
    html += `
      <div class="sidebar-item" data-step="${step.id}"
           role="button" tabindex="0"
           aria-label="Ir al paso ${step.id}: ${step.title}">
        <div class="sidebar-connector-wrap">
          <div class="sidebar-circle pending" id="sc-${step.id}">${step.id}</div>
          ${hasLine ? `<div class="sidebar-line" id="sl-${step.id}"></div>` : ''}
        </div>
        <span class="sidebar-label" id="slabel-${step.id}">${step.title}</span>
      </div>
    `;
  });

  container.innerHTML = html;
}

// ─── Sidebar state ──────────────────────────────────────────

function updateSidebarState(activeStepId) {
  currentActiveStep = activeStepId;

  STEPS.forEach((step) => {
    const circle = document.getElementById(`sc-${step.id}`);
    const label  = document.getElementById(`slabel-${step.id}`);
    const line   = document.getElementById(`sl-${step.id}`);
    if (!circle) return;

    const isDone   = completedSteps.has(step.id);
    const isActive = step.id === activeStepId;

    if (isDone) {
      circle.className = 'sidebar-circle done';
      circle.innerHTML = CHECK_ICON;
    } else if (isActive) {
      circle.className = 'sidebar-circle active';
      circle.textContent = step.id;
    } else {
      circle.className = 'sidebar-circle pending';
      circle.textContent = step.id;
    }

    if (label) {
      label.className = isActive ? 'sidebar-label active'
                      : isDone  ? 'sidebar-label done'
                      :           'sidebar-label';
    }

    if (line) {
      line.className = (step.id < activeStepId || isDone)
        ? 'sidebar-line active'
        : 'sidebar-line';
    }
  });
}

// ─── Sidebar navigation ─────────────────────────────────────

function initSidebar() {
  document.querySelectorAll('.sidebar-item').forEach((item) => {
    const handler = () => {
      const stepId = parseInt(item.dataset.step, 10);
      if (!Number.isFinite(stepId)) return;
      const target = document.getElementById(`paso-${stepId}`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        updateSidebarState(stepId);
      }
    };

    item.addEventListener('click', handler);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
    });
  });
}

// ─── Scroll observer ───────────────────────────────────────

function initScrollObserver() {
  const cards = document.querySelectorAll('.step-card');
  if (!cards.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const stepId = parseInt(entry.target.id.replace('paso-', ''), 10);
          updateSidebarState(stepId);
        }
      });
    },
    { threshold: 0.35 }
  );

  cards.forEach((card) => observer.observe(card));
}

// ─── Copy buttons ──────────────────────────────────────────

function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const stepId = parseInt(btn.dataset.step, 10);
      const step   = STEPS.find((s) => s.id === stepId);
      if (!step) return;

      try {
        await navigator.clipboard.writeText(step.code);
        btn.innerHTML = `${COPIED_ICON}<span class="copy-text">¡Copiado!</span>`;
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = `${COPY_ICON}<span class="copy-text">Copiar</span>`;
          btn.classList.remove('copied');
        }, 2000);
      } catch {
        btn.innerHTML = `<span class="copy-text">Error al copiar</span>`;
        setTimeout(() => {
          btn.innerHTML = `${COPY_ICON}<span class="copy-text">Copiar</span>`;
        }, 2000);
      }
    });
  });
}

// ─── Init ──────────────────────────────────────────────────

function init() {
  loadProgress();
  renderSidebar();

  const stepsContainer = document.getElementById('steps-container');
  if (stepsContainer) {
    stepsContainer.innerHTML = STEPS.map(renderStep).join('');
  }

  const errorsContainer = document.getElementById('errors-container');
  if (errorsContainer) {
    errorsContainer.innerHTML = ERRORS.map(renderError).join('');
  }

  updateSidebarState(1);
  updateProgress();
  restoreCompletedBadges();

  initSidebar();
  initScrollObserver();
  initCopyButtons();
  initCompleteButtons();

  if (typeof Prism !== 'undefined') Prism.highlightAll();
}

document.addEventListener('DOMContentLoaded', init);
