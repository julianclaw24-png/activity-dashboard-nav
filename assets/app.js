const DATA_URL = './data/idiomex-os.json';
const LOCAL_KEY = 'idiomex-os-local-v2';

const PAGE_CONFIG = {
  overview: {
    title: 'Overview',
    description: 'Today at a glance.'
  },
  attention: {
    title: 'Attention',
    description: 'Top decisions and blockers.'
  },
  sales: {
    title: 'Sales',
    description: 'Best opportunities and next moves.'
  },
  projects: {
    title: 'Projects',
    description: 'Active work, progress, and blockers.'
  },
  tasks: {
    title: 'Tasks',
    description: 'The next actions only.'
  },
  brain: {
    title: 'Brain',
    description: 'Briefings, recommendations, and watch items.'
  },
  workforce: {
    title: 'Workforce',
    description: 'Agent health and interventions.'
  },
  systems: {
    title: 'Systems',
    description: 'Products, knowledge, finance, and inbox ops.'
  }
};

const NAV_ITEMS = [
  { id: 'overview', href: './index.html', label: 'Overview', icon: '✦' },
  { id: 'attention', href: './attention.html', label: 'Attention', icon: '!' },
  { id: 'sales', href: './sales.html', label: 'Sales', icon: '◎' },
  { id: 'projects', href: './projects.html', label: 'Projects', icon: '▣' },
  { id: 'tasks', href: './tasks.html', label: 'Tasks', icon: '→' },
  { id: 'brain', href: './brain.html', label: 'Brain', icon: '⌘' },
  { id: 'workforce', href: './workforce.html', label: 'Workforce', icon: '⦿' },
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
    if (content) content.innerHTML = '<div class="empty">Could not load the IDIOMEX OS data file.</div>';
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
  const primaryAction = state.data.mission_control?.primary_action || {};

  setText('workspace-name', workspace.name || 'IDIOMEX OS');
  setText('workspace-subtitle', shortText(workspace.subtitle || workspace.status || 'Operating system online.', 72));
  setText('page-title', page.title);
  setText('page-description', page.description);
  setText('hero-title', header.primary_goal || page.title);
  setText('hero-copy', shortText(primaryAction.why_now || workspace.status || workspace.welcome || page.description, 120));
  setText('business-health', cleanHealthLabel(header.business_health || '—'));
  setText('hero-date', header.date_label || formatIsoDate(state.data.generated_at));
  setText('hero-momentum', header.momentum || 'Stable');
  setText('hero-focus', shortText(header.primary_goal || 'No primary goal set', 70));
  setText('hero-next', shortText(primaryAction.outcome || header.recommended_after || 'Choose the next move.', 90));
  setText('sidebar-status', shortText(workspace.status || 'Operating system online.', 84));

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
  const doing = doingTasks();
  const done = doneTasks();
  const active = activeProjects();
  const completed = completedProjects();
  const leads = topLeads();
  const decisions = state.data.decision_centre || [];
  const thisWeekItems = [
    ...active.slice(0, 2).map(project => ({ title: project.name, detail: shortText(project.next_step || project.next_milestone || project.focus || project.status, 78) })),
    ...leads.slice(0, 1).map(lead => ({ title: lead.name, detail: shortText(lead.next_action || lead.notes || 'Follow up next.', 78) }))
  ].slice(0, 3);
  const doneItems = [
    ...done.slice(0, 2).map(task => ({ title: task.title, detail: `${task.project || 'General'} · ${shortText(task.notes || 'Done.', 58)}` })),
    ...completed.slice(0, 1).map(project => ({ title: project.name, detail: shortText(project.status || 'Completed', 58) }))
  ].slice(0, 3);

  return `
    <section class="stats-grid">
      ${statCard('Now', shortText(state.data.command_header?.primary_goal || 'No primary goal set', 52), shortText(state.data.workspace?.status || 'Operating system online.', 64))}
      ${statCard('Tasks', `${pending.length} open`, pending[0] ? shortText(`${pending[0].title} · ${pending[0].project}`, 64) : 'Nothing queued.')}
      ${statCard('Projects', `${active.length} active`, active[0] ? shortText(`${active[0].name} · ${active[0].status}`, 64) : 'No active work.')}
      ${statCard('Done', `${done.length} complete`, done[0] ? shortText(`${done[0].title} · ${done[0].project}`, 64) : (completed[0] ? shortText(`${completed[0].name} · ${completed[0].status}`, 64) : 'Nothing marked done.'))}
    </section>

    <section class="grid-3 section-gap">
      ${featurePanel('Today', `
        ${focusBlock(
          decisions[0]?.title || pending[0]?.title || 'No top item loaded.',
          shortText(decisions[0]?.next_action || pending[0]?.notes || 'Nothing urgent is loaded right now.', 108),
          [
            decisions[0]?.impact ? chip(decisions[0].impact, badgeTone(decisions[0].priority || 'red')) : '',
            pending[0]?.due ? chip(`Due ${pending[0].due}`) : '',
            doing.length ? chip(`${doing.length} doing`, 'blue') : ''
          ].join('')
        )}
        ${miniList(pending.slice(0, 3).map(task => ({ title: task.title, detail: `${task.project || 'General'} · ${statusLabel(task.status || 'todo')}` })), 'Nothing open right now.')}
      `)}
      ${featurePanel('This week', `
        ${miniList(thisWeekItems, 'No active weekly work loaded.')}
        <div class="compact-note">Focus on delivery, proposal movement, and one clear next step per lane.</div>
      `)}
      ${featurePanel('Done', `
        ${miniList(doneItems, 'No recent wins logged yet.')}
        <div class="compact-note">Keep this short. It is proof of progress, not the main workspace.</div>
      `)}
    </section>

    <section class="section-gap quick-access-shell">
      <div class="section-head">
        <div>
          <h3>Open one area</h3>
          <p>Go straight to the page you want.</p>
        </div>
      </div>
      <div class="launcher-grid launcher-grid-compact">
        ${launcherCard('./attention.html', 'Attention', 'Top decisions and blockers.', badgeTone(decisionPriority()), `${decisions.length} items`)}
        ${launcherCard('./sales.html', 'Sales', 'Best opportunities only.', 'blue', `${leads.length} leads`)}
        ${launcherCard('./projects.html', 'Projects', 'Active delivery work.', 'purple', `${active.length} active`)}
        ${launcherCard('./tasks.html', 'Tasks', 'The next actions only.', 'amber', `${pending.length} open`)}
        ${launcherCard('./brain.html', 'Brain', 'Briefings and recommendations.', 'green', `${(state.data.company_brain?.recommendations || []).length} recs`)}
        ${launcherCard('./workforce.html', 'Workforce', 'Agent health and load.', 'purple', `${(state.data.ai_workforce || []).length} agents`)}
      </div>
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
      ${featurePanel('Main move', focusBlock(
        primary.title || state.data.command_header?.primary_goal || 'No main move loaded.',
        shortText(primary.why_now || primary.next_action || 'No explanation loaded.', 120),
        [
          primary.timebox ? chip(primary.timebox, 'amber') : '',
          primary.impact ? chip(primary.impact, 'red') : '',
          primary.outcome ? chip(shortText(primary.outcome, 34), 'green') : ''
        ].join('')
      ))}
      ${featurePanel('Next up', miniList(secondary.map(item => ({
        title: item.title,
        detail: shortText(`${item.detail || item.why_now || ''}${item.timebox ? ` · ${item.timebox}` : ''}`, 88)
      })), 'No secondary moves loaded.'))}
    </section>
    <section class="section-gap">
      ${panel('Decision list', listMarkup(decisions.map(item => ({
        title: `${item.title} · ${String(item.priority || 'normal').toUpperCase()}`,
        detail: shortText(`${item.next_action || ''}${item.impact ? ` · ${item.impact}` : ''}${item.eta ? ` · ${item.eta}` : ''}`, 110)
      })), 'No decisions loaded.'))}
    </section>
  `;
}

function renderSales() {
  const leadPipeline = state.data.lead_pipeline || {};
  const leads = topLeads();
  const stages = leadPipeline.stages || [];
  return `
    <section class="stats-grid">
      ${stages.map(stage => `<article class="stat"><h3>${escapeHtml(stage.name)}</h3><span class="stat-value">${escapeHtml(String(stage.count))}</span><p class="metric-note">In this stage.</p></article>`).join('')}
    </section>
    <section class="section-gap">
      ${panel('Opportunities', `
        <div class="table-like">
          <div class="table-row header"><div>Opportunity</div><div>Score</div><div>Stage</div><div>Owner</div><div>Next</div></div>
          ${leads.map(lead => `
            <div class="table-row">
              <div><strong>${escapeHtml(lead.name)}</strong><p>${escapeHtml(shortText(`${lead.buyer || ''}${lead.expected_value ? ` · ${lead.expected_value}` : ''}`, 52))}</p></div>
              <div>${escapeHtml(String(lead.score || '—'))}</div>
              <div>${chip(lead.stage || 'Unknown', badgeTone(lead.health || 'blue'))}</div>
              <div>${escapeHtml(lead.owner || 'Navod')}</div>
              <div><strong>${escapeHtml(shortText(lead.next_action || 'No next action', 42))}</strong><p>${escapeHtml(shortText(lead.offer || lead.notes || '', 62))}</p></div>
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
              <p>${escapeHtml(shortText(project.track || '', 40))}</p>
            </div>
            ${chip(project.status || 'Unknown', badgeTone(project.status || 'blue'))}
          </div>
          <span class="metric-value">${escapeHtml(String(project.completion || 0))}%</span>
          <p class="metric-note">${escapeHtml(shortText(project.focus || 'No focus set.', 88))}</p>
          <div class="progress-bar"><span style="width:${Number(project.completion || 0)}%"></span></div>
          <div class="list project-detail-list" style="margin-top:14px;">
            <div class="list-item"><strong>Next milestone</strong><p>${escapeHtml(shortText(project.next_milestone || 'None set.', 84))}</p></div>
            <div class="list-item"><strong>Blocker</strong><p>${escapeHtml(shortText(project.blocker || 'No blocker noted.', 84))}</p></div>
            <div class="list-item"><strong>Next step</strong><p>${escapeHtml(shortText(project.next_step || 'No next step set.', 84))}</p></div>
          </div>
        </article>
      `).join('')}
    </section>
  `;
}

function renderTasks() {
  const tasks = pendingTasks();
  const doing = doingTasks().length;
  const todo = state.tasks.filter(task => task.status === 'todo').length;
  const done = doneTasks().length;
  const high = state.tasks.filter(task => task.priority === 'high' && task.status !== 'done').length;
  return `
    <section class="stats-grid">
      ${statCard('To do', String(todo), 'Not started yet.')}
      ${statCard('Doing', String(doing), 'Already moving.')}
      ${statCard('Done', String(done), 'Completed in this browser.')}
      ${statCard('High priority', String(high), 'Worth attention first.')}
    </section>
    <section class="section-gap">
      ${panel('Open queue', tasks.length ? `<div class="list">${tasks.map(task => `
        <div class="list-item">
          <strong>${escapeHtml(task.title)}</strong>
          <p>${escapeHtml(shortText(`${task.project || 'General'} · ${statusLabel(task.status || 'todo')}${task.due ? ` · Due ${task.due}` : ''}`, 88))}</p>
          <div class="chip-row" style="margin-top:10px;">
            ${chip(capitalise(task.priority || 'medium'), badgeTone(task.priority || 'blue'))}
            ${task.automation ? chip(shortText(task.automation, 34)) : ''}
          </div>
          <div class="task-actions">
            <button class="btn small" onclick="advanceTask(${indexOfTask(task.title)}, -1)">Back</button>
            <button class="btn small primary" onclick="advanceTask(${indexOfTask(task.title)}, 1)">Forward</button>
          </div>
        </div>
      `).join('')}</div>` : '<div class="empty">No open tasks right now.</div>')}
      <p class="footer-note">Task changes save in this browser only.</p>
    </section>
  `;
}

function renderBrain() {
  const brain = state.data.company_brain || {};
  return `
    <section class="grid-2">
      ${featurePanel('Brief', focusBlock(
        brain.brief_header?.today_focus || brain.brief_header?.greeting || 'No briefing loaded.',
        shortText(brain.brief_header?.summary || brain.thesis || 'No summary loaded.', 120),
        [
          brain.brief_header?.risk ? chip(`Risk: ${shortText(brain.brief_header.risk, 24)}`, 'amber') : '',
          brain.brief_header?.ignore ? chip(`Ignore: ${shortText(brain.brief_header.ignore, 24)}`, 'red') : ''
        ].join('')
      ))}
      ${featurePanel('Recommendations', miniList((brain.recommendations || []).map(item => ({
        title: item.title,
        detail: shortText(`${item.do_now || item.why || ''}${item.timebox ? ` · ${item.timebox}` : ''}`, 92)
      })), 'No recommendations loaded.'))}
    </section>
    <section class="grid-2 section-gap">
      ${panel('Watchlist', listMarkup((brain.watchlist || []).map(item => ({
        title: item.title,
        detail: shortText(`${item.detail || ''}${item.trigger ? ` · Trigger: ${item.trigger}` : ''}`, 94)
      })), 'No watchlist items loaded.'))}
      ${panel('Ignore for now', listMarkup((brain.ignore_for_now || []).map(item => ({
        title: item.title,
        detail: shortText(`${item.detail || ''}${item.until ? ` · Until ${item.until}` : ''}`, 94)
      })), 'Nothing is being ignored.'))}
    </section>
  `;
}

function renderWorkforce() {
  const workforce = state.data.ai_workforce || [];
  const room = state.data.workforce_room || {};
  return `
    <section class="stats-grid">
      ${workforce.map(agent => `<article class="stat"><h3>${escapeHtml(agent.name)}</h3><span class="stat-value">${escapeHtml(agent.status || 'Unknown')}</span><p class="metric-note">${escapeHtml(shortText(agent.current_job || agent.mode || '', 52))}</p></article>`).join('')}
    </section>
    <section class="grid-2 section-gap">
      ${panel('Agent health', listMarkup(workforce.map(agent => ({
        title: `${agent.name} · ${agent.status}`,
        detail: shortText(`${agent.current_job || ''}${agent.last_run ? ` · ${agent.last_run}` : ''}`, 96)
      })), 'No agents loaded.'))}
      ${panel('Interventions', listMarkup((room.agents || []).map(agent => ({
        title: agent.name,
        detail: shortText(`${agent.intervention || 'No intervention'}${agent.current_focus ? ` · ${agent.current_focus}` : ''}`, 96)
      })), 'No workforce items loaded.'))}
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
      ${panel('Products', listMarkup(products.map(item => ({
        title: item.name,
        detail: shortText(`${item.status || ''}${item.next_action ? ` · ${item.next_action}` : ''}`, 96)
      })), 'No products loaded.'))}
      ${panel('Knowledge', listMarkup(knowledge.map(item => ({
        title: item.title,
        detail: shortText(`${item.purpose || ''}${item.status ? ` · ${item.status}` : ''}`, 96)
      })), 'No knowledge docs loaded.'))}
    </section>
    <section class="grid-2 section-gap">
      ${panel('Finance', listMarkup(financeMetrics.map(item => ({
        title: `${item.label}: ${item.value}`,
        detail: shortText(item.note || '', 96)
      })).concat(financeNotes.map(item => ({
        title: item.title,
        detail: shortText(item.detail || '', 96)
      }))), 'No finance signals loaded.'))}
      ${panel('Inbox ops', listMarkup(inboxes.map(item => ({
        title: `${item.name} · ${item.status || 'Planned'}`,
        detail: shortText(`${item.purpose || ''}${item.next_action ? ` · ${item.next_action}` : ''}`, 96)
      })), 'No inbox lanes loaded.'))}
    </section>
    <section class="section-gap">
      ${panel('Outcome pipeline', listMarkup(pipeline.map(item => ({
        title: `${item.label}: ${item.value}`,
        detail: shortText(item.note || '', 84)
      })), 'No pipeline data loaded.'))}
    </section>
  `;
}

function pendingTasks() {
  return state.tasks
    .filter(task => task.status !== 'done')
    .slice()
    .sort((a, b) => priorityWeight(a.priority) - priorityWeight(b.priority) || String(a.due || '').localeCompare(String(b.due || '')));
}

function doingTasks() {
  return state.tasks.filter(task => task.status === 'doing');
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

function featurePanel(title, inner) {
  return `<article class="card feature-panel"><div class="section-head"><div><h3>${escapeHtml(title)}</h3></div></div>${inner}</article>`;
}

function focusBlock(title, detail, chips = '') {
  return `<div class="focus-block"><strong>${escapeHtml(title)}</strong><p>${escapeHtml(detail)}</p>${chips ? `<div class="chip-row" style="margin-top:10px;">${chips}</div>` : ''}</div>`;
}

function miniList(items, emptyText) {
  if (!items.length) return `<div class="empty">${escapeHtml(emptyText)}</div>`;
  return `<div class="mini-list">${items.map(item => `<div class="mini-item"><strong>${escapeHtml(item.title || '')}</strong><p>${escapeHtml(item.detail || '')}</p></div>`).join('')}</div>`;
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

function cleanHealthLabel(value) {
  return String(value || '').replace(/[🟢🟡🔴⚪️]/g, '').trim() || 'Unknown';
}

function shortText(value, max = 80) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!text) return '';
  const firstSentence = text.split(/(?<=[.!?])\s+/)[0];
  const candidate = firstSentence.length <= max ? firstSentence : text;
  return candidate.length <= max ? candidate : `${candidate.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
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
