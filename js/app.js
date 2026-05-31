// ─── Helpers ──────────────────────────────────────────────

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ─── Render step card ──────────────────────────────────────

function renderStep(step) {
  const warningHtml = step.warning
    ? `<div class="warning-inline">${step.warning}</div>`
    : '';

  return `
    <article class="step-card" id="paso-${step.id}">
      <div class="step-card-header">
        <div class="step-number">${step.id}</div>
        <div class="step-header-text">
          <div class="step-title">${step.title}</div>
          <div class="step-subtitle">${step.subtitle}</div>
        </div>
        <span class="step-badge" id="badge-${step.id}" style="display:none;">✓ Completado</span>
      </div>
      <div class="step-body">
        <p class="step-description">${step.description}</p>
        <div class="code-block">
          <div class="code-block-header">
            <span>${step.codeLabel}</span>
            <button class="copy-btn" data-step="${step.id}">Copiar</button>
          </div>
          <pre><code class="language-${step.codeLang}">${escapeHtml(step.code)}</code></pre>
        </div>
        ${warningHtml}
        <div class="tip">${step.tip}</div>
      </div>
    </article>
  `;
}

// ─── Render error card ─────────────────────────────────────

function renderError(error) {
  return `
    <div class="error-card ${error.type}">
      <div class="error-code">${error.code}</div>
      <div class="error-cause">${error.cause}</div>
      <div class="error-solution">${error.solution}</div>
    </div>
  `;
}

// ─── Render timeline ───────────────────────────────────────

function renderTimeline() {
  const container = document.getElementById('timeline');
  if (!container) return;

  let html = '';
  STEPS.forEach((step, index) => {
    html += `
      <div class="timeline-item" data-step="${step.id}" role="button"
           tabindex="0" aria-label="Ir al paso ${step.id}: ${step.title}">
        <div class="timeline-circle pending" id="tc-${step.id}">${step.id}</div>
        <span class="timeline-label pending" id="tl-${step.id}">${step.title.split(' ')[0]}</span>
      </div>
    `;
    if (index < STEPS.length - 1) {
      html += `<div class="timeline-connector pending" id="conn-${step.id}"></div>`;
    }
  });

  container.innerHTML = html;
}

// ─── Timeline interactivity ────────────────────────────────

function activateStep(stepId) {
  STEPS.forEach((step) => {
    const circle = document.getElementById(`tc-${step.id}`);
    const label  = document.getElementById(`tl-${step.id}`);
    const conn   = document.getElementById(`conn-${step.id}`);
    const badge  = document.getElementById(`badge-${step.id}`);

    if (step.id <= stepId) {
      circle.className = 'timeline-circle active';
      label.className  = 'timeline-label active';
      if (conn) conn.className = 'timeline-connector active';
    } else {
      circle.className = 'timeline-circle pending';
      label.className  = 'timeline-label pending';
      if (conn) conn.className = 'timeline-connector pending';
    }

    if (badge) {
      badge.style.display = step.id < stepId ? 'inline-block' : 'none';
    }
  });
}

function initTimeline() {
  const items = document.querySelectorAll('.timeline-item');

  items.forEach((item) => {
    const handler = () => {
      const stepId = parseInt(item.dataset.step, 10);
      const target = document.getElementById(`paso-${stepId}`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        activateStep(stepId);
      }
    };

    item.addEventListener('click', handler);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handler();
      }
    });
  });
}

// Highlight active step on scroll via IntersectionObserver
function initScrollObserver() {
  const cards = document.querySelectorAll('.step-card');
  if (!cards.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const stepId = parseInt(entry.target.id.replace('paso-', ''), 10);
          activateStep(stepId);
        }
      });
    },
    { threshold: 0.4 }
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
        btn.textContent = '¡Copiado!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copiar';
          btn.classList.remove('copied');
        }, 2000);
      } catch {
        btn.textContent = 'Error al copiar';
        setTimeout(() => { btn.textContent = 'Copiar'; }, 2000);
      }
    });
  });
}

// ─── Init ──────────────────────────────────────────────────

function init() {
  // Render timeline
  renderTimeline();

  // Render step cards
  const stepsContainer = document.getElementById('steps-container');
  if (stepsContainer) {
    stepsContainer.innerHTML = STEPS.map(renderStep).join('');
  }

  // Render error cards
  const errorsContainer = document.getElementById('errors-container');
  if (errorsContainer) {
    errorsContainer.innerHTML = ERRORS.map(renderError).join('');
  }

  // Activate first step by default
  activateStep(1);

  // Wire up interactions
  initTimeline();
  initScrollObserver();
  initCopyButtons();

  // Trigger Prism highlighting on dynamically rendered code
  if (typeof Prism !== 'undefined') {
    Prism.highlightAll();
  }
}

document.addEventListener('DOMContentLoaded', init);
