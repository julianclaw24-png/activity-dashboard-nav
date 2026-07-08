const DATA_URL = './data/idiomex-os.json';
const LOCAL_KEY = 'idiomex-os-local-v2';
const PAGE_CONFIG = {
  overview: {
    title: 'Overview',
    description: 'A clean homepage showing only what is going on, what needs doing, what is in progress, and what was done recently.'
  },
  attention: {
    title: 'What needs attention',
    description: 'Today\'s key decisions, blockers, and the highest-leverage next moves.'
  },
  sales: {
    title: 'Sales pipeline',
    description: 'Only the best opportunities, next actions, and proposal movement.'
  },
  projects: {
    title: 'Projects in progress',
    description: 'Active work, progress, blockers, and what must move next.'
  },
  tasks: {
    title: 'Needs doing',
    description: 'A focused task page for the next few actions only.'
  },
  brain: {
    title: 'Company Brain',
    description: 'Briefings, recommendations, watchlist items, and what to ignore for now.'
  },
  workforce: {
    title: 'AI Workforce',
    description: 'Agent health, current jobs, and where intervention is needed.'
  },
  systems: {
    title: 'Systems',
    description: 'Products, knowledge, finance, inbox ops, and the underlying operating rooms.'
  }
};
const NAV_ITEMS = [
  { id: 'overview', href: './index.html', label: 'Overview', icon: '✦' },
  { id: 'attention', href: './attention.html', label: 'Attention', icon: '!' },
  { id: 'sales', href: './sales.html', label: 'Sales', icon: '◎' },
  { id: 'projects', href: './projects.html', label: 'Projects', icon: '▣' },
  { id: 'tasks', href: './tasks.html', label: 'Needs doing', icon: '→' },
  { id: 'brain', href: './brain.html', label: 'Brain', icon: '⌘' },
  { id: 'workforce', href: './workforce.html', label: 'AI Workforce', icon: '⦿' },
  { id: 'systems', href: './systems.html', label: 'Systems', icon: '□' },
  { id: 'guide', href: './guide.html', label: 'Guide', icon: '?' }
];

const state = { data: null, tasks: [], page: null };

document.addEventListener('DOMContentLoaded', init);

async function init() {
  state.page = document.body.dataset.page || 'overview';
  renderNavShell();
  try {
    const response = await fetch(DATA_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.data = await response.json();
    state.tasks = mergeLocalTasks(state.data.tasks || []);
    renderPage();
  } catch (error) {
    console.error(error);
    const content = document.getElementById('page-content');
    if (content) content.innerHTML = `<div class="empty">Could not load the IDIOMEX OS data file.</div>`;
  }
}

function mergeLocalTasks(sourceTasks) {
  const base = structuredClone(sourceTasks || []);
  try {
    const saved = JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}');
    if (!Array.isArray(saved.tasks)) return base;
    const savedMap = new Map(saved.tasks.map(task => [task.title, task]));
    return base.map(task => savedMap.get(task.title) || task);
  } catch {
    return base;
  }
}

function saveLocalTasks() {
  localStorage.setItem(LOCAL_KEY, JSON.stringify({ tasks: state.tasks }));
}

function renderNavShell() {
  const nav = document.getElementById('sidebar-nav');
  if (!nav) return;
  nav.innerHTML = NAV_ITEMS.map(item => {
    const active = item.id === state.page ? 'active' : '';
    return `<a class="nav-link ${active}" href="${item.href}"><span class="nav-icon">${item.icon}</span><span>${escapeHtml(item.label)}</span></a>`;
  }).join('');
}

function renderPage() {
  const page = PAGE_CONFIG[state.page] || PAGE_CONFIG.overview;
  const workspace = state.data.workspace || {};
  const header = state.data.command_header || {};
  setText('workspace-name', workspace.name || 'IDIOMEX OS');
  setText('workspace-subtitle', workspace.subtitle || workspace.status || 'Operating system online.');
  setText('page-title', page.title);
  setText('page-description', page.description);
  setText('hero-title', header.primary_goal || page.title);
  setText('hero-copy', workspace.status || workspace.welcome || page.description);
  setText('business-health', header.business_health || '—');
  setText('hero-date', header.date_label || formatIsoDate(state.data.generated_at));
  setText('hero-momentum', header.momentum || 'Stable');
  setText('hero-focus', header.primary_goal || 'No primary goal set');
  setText('hero-next', state.data.mission_control?.primary_action?.why_now || header.recommended_after || 'Choose the next move.');
  setText('sidebar-status', workspace.status || 'Operating system online.');

  const content = document.getElementById('page-content');
  if (!content) return;

  const renderers = {
    overview: renderOverview,
    attention: renderAttention,
    sales: renderSales,
    projects: renderProjects,
    tasks: renderTasks,
    brain: renderBrain,
    workforce: renderWorkforce,
    systems: renderSystems,
  };
  content.innerHTML = (renderers[state.page] || renderOverview)();
}

function renderOverview() {
  const pending = pendingTasks();
  const done = doneTasks();
  const active = activeProjects();
  const completed = completedProjects();
  const leads = topLeads();
  const blockers = blockersList();
  return `
    <section class="stats-grid">
      ${statCard('What\'s going on', state.data.command_header?.primary_goal || 'No primary goal set', state.data.workspace?.status || 'Operating system online.')}
      ${statCard('Needs doing', `${pending.length} open tasks`, pending[0] ? `${pending[0].title} · ${pending[0].project}` : 'Nothing queued right now.')}
      ${statCard('In progress', `${active.length} active projects`, active[0] ? `${active[0].name} · ${active[0].status}` : 'No active work loaded.')}
      ${statCard('Done recently', `${done.length} completed tasks`, done[0] ? `${done[0].title} · ${done[0].project}` : (completed[0] ? `${completed[0].name} · ${completed[0].status}` : 'Nothing marked done yet.'))}
    </section>
    <section class="launcher-grid">
      ${launcherCard('./attention.html', 'What needs attention', 'Today\'s decisions, blockers, and the one move that matters most.', badgeTone(decisionPriority()), `${(state.data.decision_centre || []).length} decisions`) }
      ${launcherCard('./sales.html', 'Sales pipeline', 'Your strongest opportunities, proposals, and near-term cash moves.', 'blue', `${leads.length} focused opportunities`) }
      ${launcherCard('./projects.html', 'Projects in progress', 'Active delivery work, completion %, blockers, and next steps.', 'purple', `${active.length} active projects`) }
      ${launcherCard('./tasks.html', 'Needs doing', 'A short page for the next actions only.', 'amber', `${pending.length} open tasks`) }
      ${launcherCard('./brain.html', 'Company Brain', 'Briefings, recommendations, watchlist, and what to ignore.', 'green', `${(state.data.company_brain?.recommendations || []).length} recommendations`) }
      ${launcherCard('./workforce.html', 'AI Workforce', 'Agent health, current jobs, and intervention points.', 'purple', `${(state.data.ai_workforce || []).length} agents`) }
    </section>
    <section class="grid-2" style="margin-top:18px;">
      ${panel('Key blocker', listMarkup(blockers.slice(0, 3).map(item => ({ title: item.name, detail: item.blocker })), 'No major blocker right now.'))}
      ${panel('Best sales opportunities', listMarkup(leads.slice(0, 3).map(lead => ({ title: lead.name, detail: `${lead.next_action || 'No next action'}${lead.expected_value ? ` · ${lead.expected_value}` : ''}` })), 'No opportunities loaded.'))}
    </section>
  `;
}

function renderAttention() {
  const mission = state.data.mission_control || {};
  const primary = mission.primary_action || (state.data.decision_centre || [])[0] || {};
  const secondary = mission.secondary_actions || [];
  const decisions = state.data.decision_centre || [];
  return `
    <section class="grid-2">
      ${panel('Primary move', `
        <div class="list-item">
          <strong>${escapeHtml(primary.title || state.data.command_header?.primary_goal || 'No primary move loaded.')}</strong>
          <p>${escapeHtml(primary.why_now || primary.next_action || 'No explanation loaded.')}</p>
          <div class="chip-row" style="margin-top:10px;">
            ${chip(primary.impact || 'Current priority', badgeTone(primary.priority || 'blue'))}
            ${primary.timebox ? chip(`Timebox: ${primary.timebox}`) : ''}
            ${primary.outcome ? chip(`Outcome: ${primary.outcome}`) : ''}
          </div>
        </div>
      `)}
      ${panel('Secondary moves', listMarkup(secondary.map(item => ({ title: item.title, detail: `${item.detail || item.why_now || ''}${item.timebox ? ` · ${item.timebox}` : ''}` })), 'No secondary moves loaded.'))}
    </section>
    <section style="margin-top:18px;">
      ${panel('Decision list', listMarkup(decisions.map(item => ({ title: `${item.title} (${String(item.priority || 'normal').toUpperCase()})`, detail: `${item.next_action || ''}${item.impact ? ` · ${item.impact}` : ''}${item.eta ? ` · ETA ${item.eta}` : ''}` })), 'No decisions loaded.'))}
    </section>
  `;
}

function renderSales() {
  const leadPipeline = state.data.lead_pipeline || {};
  const leads = topLeads();
  const stages = leadPipeline.stages || [];
  return `
    <section class="stats-grid">
      ${stages.map(stage => `<article class="stat"><h3>${escapeHtml(stage.name)}</h3><span class="stat-value">${escapeHtml(String(stage.count))}</span><p class="metric-note">Focused opportunities in this stage.</p></article>`).join('')}
    </section>
    <section style="margin-top:18px;">
      ${panel('Focused opportunities', `
        <div class="table-like">
          <div class="table-row header"><div>Opportunity</div><div>Score</div><div>Stage</div><div>Owner</div><div>Next step</div></div>
          ${leads.map(lead => `
            <div class="table-row">
              <div><strong>${escapeHtml(lead.name)}</strong><p>${escapeHtml(lead.buyer || '')}${lead.expected_value ? ` · ${escapeHtml(lead.expected_value)}` : ''}</p></div>
              <div>${escapeHtml(String(lead.score || '—'))}</div>
              <div>${chip(lead.stage || 'Unknown', badgeTone(lead.health || 'blue'))}</div>
              <div>${escapeHtml(lead.owner || 'Navod')}</div>
              <div><strong>${escapeHtml(lead.next_action || 'No next action')}</strong><p>${escapeHtml(lead.offer || lead.notes || '')}</p></div>
            </div>
          `).join('')}
        </div>
      `)}
    </section>
  `;
}

function renderProjects() {
  const projects = state.data.projects || [];
  return `
    <section class="grid-2">
      ${projects.map(project => `
        <article class="card">
          <div class="section-head">
            <div>
              <h3>${escapeHtml(project.name)}</h3>
              <p>${escapeHtml(project.track || '')}</p>
            </div>
            ${chip(project.status || 'Unknown', badgeTone(project.status || 'blue'))}
          </div>
          <span class="metric-value">${escapeHtml(String(project.completion || 0))}%</span>
          <p class="metric-note">${escapeHtml(project.focus || 'No focus set.')}</p>
          <div class="progress-bar"><span style="width:${Number(project.completion || 0)}%"></span></div>
          <div class="list" style="margin-top:14px;">
            <div class="list-item"><strong>Next milestone</strong><p>${escapeHtml(project.next_milestone || 'None set.')}</p></div>
            <div class="list-item"><strong>Blocker</strong><p>${escapeHtml(project.blocker || 'No blocker noted.')}</p></div>
            <div class="list-item"><strong>Next step</strong><p>${escapeHtml(project.next_step || 'No next step set.')}</p></div>
          </div>
        </article>
      `).join('')}
    </section>
  `;
}

function renderTasks() {
  const tasks = pendingTasks();
  const doing = state.tasks.filter(task => task.status === 'doing').length;
  const todo = state.tasks.filter(task => task.status === 'todo').length;
  const done = state.tasks.filter(task => task.status === 'done').length;
  return `
    <section class="stats-grid">
      ${statCard('To do', String(todo), 'Open tasks not started yet.')}
      ${statCard('Doing', String(doing), 'Tasks already in motion.')}
      ${statCard('Done', String(done), 'Completed tasks tracked locally across pages.')}
      ${statCard('High priority', String(state.tasks.filter(task => task.priority === 'high' && task.status !== 'done').length), 'The tasks most worth attention first.')}
    </section>
    <section style="margin-top:18px;">
      ${panel('Open task queue', tasks.length ? `<div class="list">${tasks.map(task => `
        <div class="list-item">
          <strong>${escapeHtml(task.title)}</strong>
          <p>${escapeHtml(task.project || 'General')} · ${escapeHtml(statusLabel(task.status || 'todo'))}${task.due ? ` · Due ${escapeHtml(task.due)}` : ''}</p>
          <div class="chip-row" style="margin-top:10px;">
            ${chip(capitalise(task.priority || 'medium'), badgeTone(task.priority || 'blue'))}
            ${task.automation ? chip(`Automation: ${task.automation}`) : ''}
          </div>
          <div class="task-actions">
            <button class="btn small" onclick="advanceTask(${indexOfTask(task.title)}, -1)">Move back</button>
            <button class="btn small primary" onclick="advanceTask(${indexOfTask(task.title)}, 1)">Move forward</button>
          </div>
        </div>
      `).join('')}</div>` : '<div class="empty">No open tasks right now.</div>')}
      <p class="footer-note">Task movement is saved in this browser so you can mark progress without editing the JSON file directly.</p>
    </section>
  `;
}

function renderBrain() {
  const brain = state.data.company_brain || {};
  return `
    <section class="grid-2">
      ${panel('Briefing', `
        <div class="list-item">
          <strong>${escapeHtml(brain.brief_header?.greeting || 'No greeting loaded.')}</strong>
          <p>${escapeHtml(brain.brief_header?.summary || brain.thesis || 'No summary loaded.')}</p>
          <div class="chip-row" style="margin-top:10px;">
            ${brain.brief_header?.today_focus ? chip(`Today: ${brain.brief_header.today_focus}`, 'green') : ''}
            ${brain.brief_header?.risk ? chip(`Risk: ${brain.brief_header.risk}`, 'amber') : ''}
            ${brain.brief_header?.ignore ? chip(`Ignore: ${brain.brief_header.ignore}`, 'red') : ''}
          </div>
        </div>
      `)}
      ${panel('Recommendations', listMarkup((brain.recommendations || []).map(item => ({ title: item.title, detail: `${item.do_now || item.why || ''}${item.timebox ? ` · ${item.timebox}` : ''}` })), 'No recommendations loaded.'))}
    </section>
    <section class="grid-2" style="margin-top:18px;">
      ${panel('Watchlist', listMarkup((brain.watchlist || []).map(item => ({ title: item.title, detail: `${item.detail || ''}${item.trigger ? ` · Trigger: ${item.trigger}` : ''}` })), 'No watchlist items loaded.'))}
      ${panel('Ignore for now', listMarkup((brain.ignore_for_now || []).map(item => ({ title: item.title, detail: `${item.detail || ''}${item.until ? ` · Until ${item.until}` : ''}` })), 'Nothing is being ignored.'))}
    </section>
    <section style="margin-top:18px;">
      ${panel('Briefing feed', listMarkup((brain.briefing || []).map(item => ({ title: item.title, detail: `${item.detail || ''}${item.time ? ` · ${item.time}` : ''}` })), 'No briefing items loaded.'))}
    </section>
  `;
}

function renderWorkforce() {
  const workforce = state.data.ai_workforce || [];
  const room = state.data.workforce_room || {};
  return `
    <section class="stats-grid">
      ${workforce.map(agent => `<article class="stat"><h3>${escapeHtml(agent.name)}</h3><span class="stat-value">${escapeHtml(agent.status || 'Unknown')}</span><p class="metric-note">${escapeHtml(agent.current_job || agent.mode || '')}</p></article>`).join('')}
    </section>
    <section class="grid-2" style="margin-top:18px;">
      ${panel('Agent health', listMarkup(workforce.map(agent => ({ title: `${agent.name} · ${agent.status}`, detail: `${agent.current_job || ''}${agent.last_run ? ` · Last report ${agent.last_run}` : ''}` })), 'No agents loaded.'))}
      ${panel('Workforce interventions', listMarkup((room.agents || []).map(agent => ({ title: agent.name, detail: `${agent.intervention || 'No intervention'}${agent.current_focus ? ` · ${agent.current_focus}` : ''}` })), 'No workforce room items loaded.'))}
    </section>
  `;
}

function renderSystems() {
  const products = state.data.products?.items || [];
  const knowledge = state.data.knowledge_room?.docs || [];
  const financeMetrics = state.data.finance_room?.metrics || [];
  const financeNotes = state.data.finance_room?.notes || [];
  const inboxes = state.data.email_room?.inboxes || [];
  const pipeline = state.data.outcome_pipeline || [];
  return `
    <section class="grid-2">
      ${panel('Products', listMarkup(products.map(item => ({ title: item.name, detail: `${item.status || ''}${item.next_action ? ` · ${item.next_action}` : ''}` })), 'No products loaded.'))}
      ${panel('Knowledge', listMarkup(knowledge.map(item => ({ title: item.title, detail: `${item.purpose || ''}${item.status ? ` · ${item.status}` : ''}` })), 'No knowledge docs loaded.'))}
    </section>
    <section class="grid-2" style="margin-top:18px;">
      ${panel('Finance', listMarkup(financeMetrics.map(item => ({ title: `${item.label}: ${item.value}`, detail: item.note || '' })).concat(financeNotes.map(item => ({ title: item.title, detail: item.detail || '' }))), 'No finance signals loaded.'))}
      ${panel('Inbox Ops', listMarkup(inboxes.map(item => ({ title: `${item.name} · ${item.status || 'Planned'}`, detail: `${item.purpose || ''}${item.next_action ? ` · ${item.next_action}` : ''}` })), 'No inbox lanes loaded.'))}
    </section>
    <section style="margin-top:18px;">
      ${panel('Outcome pipeline', listMarkup(pipeline.map(item => ({ title: `${item.label}: ${item.value}`, detail: item.note || '' })), 'No pipeline data loaded.'))}
    </section>
  `;
}

function pendingTasks() {
  return state.tasks
    .filter(task => task.status !== 'done')
    .slice()
    .sort((a, b) => priorityWeight(a.priority) - priorityWeight(b.priority) || String(a.due || '').localeCompare(String(b.due || '')));
}

function doneTasks() {
  return state.tasks.filter(task => task.status === 'done');
}

function activeProjects() {
  return (state.data.projects || []).filter(project => !/done|complete|live/i.test(String(project.status || '')));
}

function completedProjects() {
  return (state.data.projects || []).filter(project => /done|complete|live/i.test(String(project.status || '')));
}

function blockersList() {
  return activeProjects().filter(project => project.blocker && !/no major blocker|no blocker|none/i.test(String(project.blocker || '')));
}

function topLeads() {
  return (state.data.lead_pipeline?.leads || []).slice().sort((a, b) => Number(b.score || 0) - Number(a.score || 0));
}

function decisionPriority() {
  return (state.data.decision_centre || [])[0]?.priority || 'blue';
}

function statCard(title, value, note) {
  return `<article class="stat"><h3>${escapeHtml(title)}</h3><span class="stat-value">${escapeHtml(value)}</span><p class="metric-note">${escapeHtml(note)}</p></article>`;
}

function panel(title, inner) {
  return `<article class="card"><div class="section-head"><div><h3>${escapeHtml(title)}</h3></div></div>${inner}</article>`;
}

function launcherCard(href, title, note, tone, meta) {
  return `<a class="launcher-link" href="${href}"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(note)}</p><div class="meta-line">${chip(meta, tone)}</div></a>`;
}

function listMarkup(items, emptyText) {
  if (!items.length) return `<div class="empty">${escapeHtml(emptyText)}</div>`;
  return `<div class="list">${items.map(item => `<div class="list-item"><strong>${escapeHtml(item.title || '')}</strong><p>${escapeHtml(item.detail || '')}</p></div>`).join('')}</div>`;
}

function chip(text, tone = '') {
  if (!text) return '';
  const cls = tone ? `badge ${tone}` : 'chip';
  return `<span class="${cls}">${escapeHtml(String(text))}</span>`;
}

function badgeTone(value) {
  const v = String(value || '').toLowerCase();
  if (/(red|hot|high|error|failed)/.test(v)) return 'red';
  if (/(amber|medium|warm|warning|todo)/.test(v)) return 'amber';
  if (/(green|done|live|healthy|online|active)/.test(v)) return 'green';
  if (/(purple|planned)/.test(v)) return 'purple';
  return 'blue';
}

function priorityWeight(priority) {
  return { high: 0, medium: 1, low: 2 }[priority] ?? 3;
}

function statusLabel(status) {
  return { todo: 'To do', doing: 'Doing', done: 'Done' }[status] || capitalise(String(status || 'unknown'));
}

function capitalise(value) {
  if (!value) return '';
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}

function formatIsoDate(value) {
  if (!value) return 'Unknown';
  return String(value).slice(0, 10);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function indexOfTask(title) {
  return state.tasks.findIndex(task => task.title === title);
}

window.advanceTask = function advanceTask(index, direction) {
  const task = state.tasks[index];
  if (!task) return;
  const order = ['todo', 'doing', 'done'];
  const current = order.indexOf(task.status || 'todo');
  const next = Math.max(0, Math.min(order.length - 1, current + direction));
  state.tasks[index] = { ...task, status: order[next] };
  saveLocalTasks();
  renderPage();
};
