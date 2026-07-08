const DATA_URL = './data/idiomex-os.json';
const LOCAL_KEY = 'idiomex-os-local-v2';

const PAGE_CONFIG = {
  overview: {
    title: 'Overview',
    description: 'See what matters now.'
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
    description: 'Active work, progress, blockers, and due risk.'
  },
  tasks: {
    title: 'Tasks',
    description: 'What to do now, what is waiting, and what is done.'
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
  },
  weekly: {
    title: 'Weekly Review',
    description: 'A clean weekly reset: wins, risks, priorities, and what to stop.'
  },
  ceo: {
    title: 'Daily CEO Briefing',
    description: 'The clean daily brief: priorities, decisions, risks, wins, and what moved.'
  }
};

const NAV_ITEMS = [
  { id: 'overview', href: './index.html', label: 'Overview', icon: '✦' },
  { id: 'ceo', href: './ceo.html', label: 'CEO', icon: '♛' },
  { id: 'attention', href: './attention.html', label: 'Attention', icon: '!' },
  { id: 'sales', href: './sales.html', label: 'Sales', icon: '◎' },
  { id: 'projects', href: './projects.html', label: 'Projects', icon: '▣' },
  { id: 'tasks', href: './tasks.html', label: 'Tasks', icon: '→' },
  { id: 'weekly', href: './guide.html', label: 'Weekly', icon: '☰' },
  { id: 'brain', href: './brain.html', label: 'Brain', icon: '⌘' },
  { id: 'workforce', href: './workforce.html', label: 'Workforce', icon: '⦿' },
  { id: 'systems', href: './systems.html', label: 'Systems', icon: '□' }
];

const state = { data: null, tasks: [], page: null };

document.addEventListener('DOMContentLoaded', init);

async function init() {
  state.page = document.body.dataset.page || 'overview';
  document.body.classList.add('has-mobile-nav');
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
  const navMarkup = NAV_ITEMS.map(item => {
    const active = item.id === state.page ? 'active' : '';
    return `<a class="nav-link ${active}" href="${item.href}" aria-current="${active ? 'page' : 'false'}"><span class="nav-icon">${item.icon}</span><span>${escapeHtml(item.label)}</span></a>`;
  }).join('');

  const sidebarNav = document.getElementById('sidebar-nav');
  if (sidebarNav) sidebarNav.innerHTML = navMarkup;

  let mobileNav = document.getElementById('mobile-bottom-nav');
  if (!mobileNav) {
    mobileNav = document.createElement('nav');
    mobileNav.id = 'mobile-bottom-nav';
    mobileNav.className = 'mobile-bottom-nav';
    mobileNav.setAttribute('aria-label', 'Mobile navigation');
    document.body.appendChild(mobileNav);
  }
  mobileNav.innerHTML = NAV_ITEMS.map(item => {
    const active = item.id === state.page ? 'active' : '';
    return `<a class="mobile-nav-link ${active}" href="${item.href}" aria-current="${active ? 'page' : 'false'}"><span class="mobile-nav-icon">${item.icon}</span><span class="mobile-nav-label">${escapeHtml(item.label)}</span></a>`;
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
    weekly: renderWeekly,
    ceo: renderCEO,
  };
  content.innerHTML = (renderers[state.page] || renderOverview)();
}

function renderOverview() {
  const today = todayTasks();
  const waiting = waitingTasks();
  const done = doneTasks();
  const overdue = overdueTasks();
  const dueSoon = dueSoonTasks();
  const blocked = blockedProjects();
  const decisions = state.data.decision_centre || [];
  const focusList = state.data.focus?.today || [];
  const mainItem = focusList[0] || decisions[0] || today[0] || {};
  const activity = recentActivityData();
  const blockedLabel = blocked[0]?.name || waiting[0]?.title || 'Nothing blocked right now.';
  const blockedDetail = blocked[0]
    ? shortText(blocked[0].blocker || 'Blocked.', 84)
    : waiting[0]
      ? shortText(waitingOnText(waiting[0]) || waiting[0].notes || 'Queued for later.', 84)
      : 'No live blockers.';
  return `
    <section class="action-strip overview-phase6-strip">
      ${actionCard(
        'Primary action',
        mainItem.title || 'No main action loaded.',
        shortText(mainItem.do_now || mainItem.next_action || mainItem.notes || 'Nothing urgent is loaded right now.', 124),
        [
          mainItem.timebox ? chip(mainItem.timebox, 'amber') : '',
          mainItem.confidence ? chip(mainItem.confidence, 'green') : '',
          overdue.length ? chip(`${overdue.length} overdue`, 'red') : chip('No overdue tasks', 'green')
        ].join(''),
        './tasks.html',
        'Open tasks',
        'red'
      )}
      <div class="action-strip-side">
        ${actionMiniCard("What's going on", shortText(state.data.command_header?.primary_goal || 'No primary goal set', 56), shortText(state.data.workspace?.status || 'Operating system online.', 82), 'blue')}
        ${actionMiniCard('Need-to-know', overdue[0] ? overdue[0].title : (dueSoon[0] ? dueSoon[0].title : 'No deadline pressure right now.'), overdue[0] ? dueLabel(overdue[0]) : (dueSoon[0] ? dueLabel(dueSoon[0]) : 'Clear'), overdue[0] ? 'red' : 'amber')}
      </div>
    </section>

    <section class="grid-4 section-gap overview-snapshot-grid">
      ${summaryListCard("What's going on", [{ title: shortText(state.data.command_header?.primary_goal || 'No primary goal set', 54), detail: shortText(state.data.workspace?.status || 'Operating system online.', 84) }], 'No current state loaded.', 'blue')}
      ${summaryListCard('Needs doing now', today.slice(0, 3).map(task => ({ title: task.title, detail: taskSummary(task) })), 'Nothing queued right now.', 'red')}
      ${summaryListCard('Waiting / blocked', [{ title: blockedLabel, detail: blockedDetail }], 'Nothing waiting right now.', blocked.length || waiting.length ? 'amber' : 'green')}
      ${summaryListCard('Done recently', done.slice(0, 3).map(task => ({ title: task.title, detail: `${task.project || 'General'} · ${shortText(task.notes || 'Done.', 56)}` })), 'No recent wins logged yet.', 'green')}
    </section>

    <section class="grid-2 section-gap">
      ${panel('Recent activity', timelineMarkup(activity.items || [], 'No activity loaded yet.'))}
      ${panel('Where to look next', listMarkup([
        { title: 'CEO briefing', detail: 'Read priorities, risks, decisions, and changes since yesterday.' },
        { title: 'Tasks', detail: overdue.length ? `${overdue.length} overdue still need movement.` : `${today.length} today and ${waiting.length} waiting.` },
        { title: 'Workforce', detail: activity.items[0] ? shortText(activity.items[0].detail || 'Agent activity is moving.', 90) : 'Review run history and agent alerts.' }
      ], 'No next steps loaded.'))}
    </section>

    <section class="section-gap quick-access-shell">
      <div class="section-head">
        <div>
          <h3>Open one area</h3>
          <p>Go straight to the page you need.</p>
        </div>
      </div>
      <div class="launcher-grid launcher-grid-compact">
        ${launcherCard('./ceo.html', 'Daily CEO brief', 'Priorities, risks, wins, decisions, and changes.', 'red', `${(ceoBriefData().priorities || []).length} priorities`)}
        ${launcherCard('./attention.html', 'Attention', 'Top decisions.', badgeTone(decisionPriority()), `${decisions.length} items`)}
        ${launcherCard('./sales.html', 'Sales', 'Best opportunities.', 'blue', `${topLeads().length} leads`)}
        ${launcherCard('./projects.html', 'Projects', 'Active delivery.', 'purple', `${activeProjects().length} active`)}
        ${launcherCard('./tasks.html', 'Tasks', 'Today, waiting, done.', 'amber', `${today.length} today`)}
        ${launcherCard('./workforce.html', 'Workforce', 'Runs, queue, and alerts.', 'green', `${(agentActivityData().recent_runs || []).length} runs`)}
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
  const blocked = blockedProjects().length;
  const healthy = projects.filter(project => !hasMeaningfulBlocker(project)).length;
  return `
    <section class="stats-grid stats-grid-4">
      ${statCard('Active', String(activeProjects().length), 'Projects still moving.', 'blue')}
      ${statCard('Blocked', String(blocked), blocked ? 'Needs attention.' : 'No active blockers.', blocked ? 'red' : 'green')}
      ${statCard('Healthy', String(healthy), 'Clear next steps.', 'green')}
      ${statCard('Completed', String(completedProjects().length), 'Live or done.', 'amber')}
    </section>
    <section class="grid-2 section-gap">
      ${projects.map(project => `
        <article class="card ${hasMeaningfulBlocker(project) ? 'project-blocked' : ''}">
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
          <div class="chip-row project-chip-row" style="margin-top:12px;">
            ${project.eta ? chip(project.eta, 'amber') : ''}
            ${hasMeaningfulBlocker(project) ? chip('Blocked', 'red') : chip('Clear next step', 'green')}
          </div>
          <div class="list project-detail-list" style="margin-top:14px;">
            <div class="list-item"><strong>Next milestone</strong><p>${escapeHtml(shortText(project.next_milestone || 'None set.', 84))}</p></div>
            <div class="list-item ${hasMeaningfulBlocker(project) ? 'list-item-alert' : ''}"><strong>Blocker</strong><p>${escapeHtml(shortText(project.blocker || 'No blocker noted.', 84))}</p></div>
            <div class="list-item"><strong>Next step</strong><p>${escapeHtml(shortText(project.next_step || 'No next step set.', 84))}</p></div>
          </div>
        </article>
      `).join('')}
    </section>
  `;
}

function renderTasks() {
  const today = todayTasks();
  const waiting = waitingTasks();
  const done = doneTasks();
  const overdue = overdueTasks();
  const dueSoon = dueSoonTasks();
  return `
    <section class="stats-grid stats-grid-4">
      ${statCard('Today', String(today.length), 'Do these now.', 'red')}
      ${statCard('Overdue', String(overdue.length), overdue.length ? 'Needs clearing first.' : 'Nothing overdue.', overdue.length ? 'red' : 'green')}
      ${statCard('Waiting', String(waiting.length), 'Queued for later.', 'blue')}
      ${statCard('Done', String(done.length), 'Completed here.', 'green')}
    </section>
    <section class="panel section-gap task-summary-panel">
      <div class="section-head"><div><h3>What needs movement</h3><p>See the tasks that are late, due soon, or waiting on something else.</p></div></div>
      <div class="grid-3 task-summary-grid">
        ${summaryListCard('Overdue', overdue.slice(0, 3).map(task => ({ title: task.title, detail: dueLabel(task) })), 'Nothing overdue.', 'red')}
        ${summaryListCard('Due soon', dueSoon.slice(0, 3).map(task => ({ title: task.title, detail: dueLabel(task) })), 'No near-term deadlines.', 'amber')}
        ${summaryListCard('Waiting on', waiting.slice(0, 3).map(task => ({ title: task.title, detail: shortText(waitingOnText(task) || task.notes || 'Queued for later.', 72) })), 'Nothing intentionally waiting.', 'blue')}
      </div>
    </section>
    <section class="grid-3 section-gap task-board">
      ${taskColumn('Today', today, 'Do these now.', 'red')}
      ${taskColumn('Waiting', waiting, 'Keep these out of the way.', 'blue')}
      ${taskColumn('Done', done, 'Recent completions.', 'green')}
    </section>
    <p class="footer-note">Task changes save in this browser only.</p>
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

function renderCEO() {
  const brief = ceoBriefData();
  const priorities = brief.priorities || [];
  const decisions = brief.decisions || [];
  const wins = brief.wins || [];
  const risks = brief.risks || [];
  const done = brief.done_recently || [];
  const checks = brief.next_checks || [];
  const score = brief.scoreboard || [];
  const changes = brief.changes_since_yesterday || [];
  const chips = [
    brief.date_label ? chip(brief.date_label, 'blue') : '',
    priorities[0]?.timebox ? chip(priorities[0].timebox, 'amber') : '',
    brief.business_health ? chip(brief.business_health, badgeTone(brief.business_health)) : ''
  ].join('');
  return `
    <section class="stats-grid stats-grid-4">
      ${score.map(item => statCard(item.label || 'Metric', String(item.value || '—'), shortText(item.note || '', 58), badgeTone(item.tone || item.value || 'blue'))).join('')}
    </section>
    <section class="grid-2 section-gap">
      ${featurePanel('Daily brief', focusBlock(
        brief.headline || 'No CEO briefing loaded.',
        shortText(brief.summary || 'Nothing loaded yet.', 132),
        chips
      ))}
      ${featurePanel('Top priorities', miniList(priorities.map(item => ({
        title: item.title,
        detail: shortText(`${item.detail || item.why || ''}${item.timebox ? ` · ${item.timebox}` : ''}`, 96)
      })), 'No priorities loaded.'))}
    </section>
    <section class="grid-2 section-gap">
      ${panel('Changes since yesterday', timelineMarkup(changes, 'No change log loaded.'))}
      ${panel('Done recently', listMarkup(done.map(item => ({
        title: item.title,
        detail: shortText(`${item.detail || ''}${item.time ? ` · ${item.time}` : ''}`, 100)
      })), 'Nothing completed yet.'))}
    </section>
    <section class="grid-2 section-gap">
      ${panel('Key decisions today', listMarkup(decisions.map(item => ({
        title: item.title,
        detail: shortText(`${item.detail || item.next_action || ''}${item.owner ? ` · ${item.owner}` : ''}`, 100)
      })), 'No decisions loaded.'))}
      ${panel('Risks to watch', listMarkup(risks.map(item => ({
        title: item.title,
        detail: shortText(`${item.detail || ''}${item.trigger ? ` · Trigger: ${item.trigger}` : ''}`, 100)
      })), 'No risks loaded.'))}
    </section>
    <section class="grid-2 section-gap">
      ${panel('Wins', listMarkup(wins.map(item => ({
        title: item.title,
        detail: shortText(item.detail || '', 100)
      })), 'No wins loaded.'))}
      ${panel('Next checks', listMarkup(checks.map(item => ({
        title: item.title,
        detail: shortText(`${item.detail || ''}${item.when ? ` · ${item.when}` : ''}`, 104)
      })), 'No next checks loaded.'))}
    </section>
  `;
}

function renderWorkforce() {
  const workforce = state.data.ai_workforce || [];
  const room = state.data.workforce_room || {};
  const activity = agentActivityData();
  const online = workforce.filter(agent => /(online|active|healthy)/i.test(String(agent.status || ''))).length;
  const planned = workforce.filter(agent => /(planned|design|tbd)/i.test(String(agent.status || '') + ' ' + String(agent.performance || ''))).length;
  const alerts = activity.alerts || [];
  const recentRuns = activity.recent_runs || [];
  const queue = activity.queue || [];
  return `
    <section class="stats-grid stats-grid-4">
      ${statCard('Online', `${online}/${workforce.length || 0}`, 'Agents currently available.', online === workforce.length ? 'green' : 'amber')}
      ${statCard('Planned', String(planned), planned ? 'Still not fully live.' : 'Everything mapped is live.', planned ? 'purple' : 'green')}
      ${statCard('Alerts', String(alerts.length), alerts[0] ? shortText(alerts[0].title, 54) : 'No agent alerts.', alerts.length ? 'red' : 'green')}
      ${statCard('Recent runs', String(recentRuns.length), recentRuns[0] ? shortText(recentRuns[0].job || recentRuns[0].outcome || 'Recent run logged.', 54) : 'No runs logged.', 'blue')}
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
    <section class="grid-2 section-gap">
      ${panel('Run history', listMarkup(recentRuns.map(run => ({
        title: `${run.agent} · ${run.status || 'Run logged'}`,
        detail: shortText(`${run.job || ''}${run.finished ? ` · ${run.finished}` : ''}${run.outcome ? ` · ${run.outcome}` : ''}`, 104)
      })), 'No agent runs logged.'))}
      ${panel('Next up', listMarkup(queue.map(item => ({
        title: item.title || item.agent || 'Queued work',
        detail: shortText(`${item.detail || item.job || ''}${item.when ? ` · ${item.when}` : ''}`, 104)
      })), 'No queued runs loaded.'))}
    </section>
    <section class="section-gap">
      ${panel('Agent alerts', listMarkup(alerts.map(item => ({
        title: item.title,
        detail: shortText(`${item.detail || ''}${item.owner ? ` · ${item.owner}` : ''}`, 104)
      })), 'No alerts right now.'))}
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

function renderWeekly() {
  const weekly = weeklyReviewData();
  return `
    <section class="grid-2">
      ${featurePanel('This week', `
        ${focusBlock(
          weekly.headline || 'Weekly review',
          shortText(weekly.summary || 'Focus on the highest-leverage work and keep distractions out.', 120),
          [
            weekly.theme ? chip(weekly.theme, 'purple') : '',
            weekly.score ? chip(weekly.score, 'green') : ''
          ].join('')
        )}
        ${miniList((weekly.this_week || []).map(item => ({
          title: item.title,
          detail: shortText(item.detail || item.why || '', 92)
        })), 'No weekly priorities loaded.')}
      `)}
      ${featurePanel('Wins', miniList((weekly.wins || []).map(item => ({
        title: item.title,
        detail: shortText(item.detail || '', 92)
      })), 'No wins logged yet.'))}
    </section>
    <section class="grid-2 section-gap">
      ${panel('Risks', listMarkup((weekly.risks || []).map(item => ({
        title: item.title,
        detail: shortText(item.detail || item.trigger || '', 94)
      })), 'No active risks loaded.'))}
      ${panel('Stop doing', listMarkup((weekly.stop_doing || []).map(item => ({
        title: item.title,
        detail: shortText(item.detail || item.until || '', 94)
      })), 'Nothing needs to be cut right now.'))}
    </section>
    <section class="grid-2 section-gap">
      ${panel('Keep an eye on', listMarkup((weekly.watch || []).map(item => ({
        title: item.title,
        detail: shortText(item.detail || item.trigger || '', 94)
      })), 'No watch items loaded.'))}
      ${panel('Next reset questions', listMarkup((weekly.review_questions || []).map(item => ({
        title: item.title,
        detail: shortText(item.detail || '', 94)
      })), 'No review prompts loaded.'))}
    </section>
  `;
}

function taskColumn(title, tasks, note, tone) {
  const items = tasks.length ? `<div class="list">${tasks.map(task => `
    <div class="list-item task-card ${taskUrgencyClass(task)} ${taskTimingClass(task)}">
      <div class="task-card-top">
        <strong>${escapeHtml(task.title)}</strong>
        ${dueBadge(task)}
      </div>
      <p>${escapeHtml(shortText(`${task.project || 'General'}${task.due ? ` · ${task.due}` : ''}`, 80))}</p>
      <div class="chip-row" style="margin-top:10px;">
        ${chip(capitalise(task.priority || 'medium'), badgeTone(task.priority || tone))}
        ${task.automation ? chip(shortText(task.automation, 30)) : ''}
        ${waitingOnText(task) ? chip(shortText(waitingOnText(task), 28), 'blue') : ''}
      </div>
      <div class="task-actions">
        <button class="btn small" onclick="advanceTask(${indexOfTask(task.title)}, -1)">Back</button>
        <button class="btn small primary" onclick="advanceTask(${indexOfTask(task.title)}, 1)">Forward</button>
      </div>
    </div>
  `).join('')}</div>` : '<div class="empty">Nothing here.</div>';
  return `<article class="card board-column"><div class="section-head"><div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(note)}</p></div>${chip(`${tasks.length}`, tone)}</div>${items}</article>`;
}

function todayTasks() {
  return state.tasks
    .filter(task => isTodayStatus(task.status))
    .slice()
    .sort((a, b) => priorityWeight(a.priority) - priorityWeight(b.priority) || String(a.due || '').localeCompare(String(b.due || '')));
}

function waitingTasks() {
  return state.tasks
    .filter(task => isWaitingStatus(task.status))
    .slice()
    .sort((a, b) => priorityWeight(a.priority) - priorityWeight(b.priority) || String(a.due || '').localeCompare(String(b.due || '')));
}

function isTodayStatus(status) {
  return ['today', 'todo', 'doing'].includes(String(status || '').toLowerCase());
}

function isWaitingStatus(status) {
  return ['waiting'].includes(String(status || '').toLowerCase());
}

function taskUrgencyClass(task) {
  if ((task.priority || '').toLowerCase() === 'high') return 'urgent';
  if ((task.priority || '').toLowerCase() === 'medium') return 'warm';
  return 'cool';
}

function pendingTasks() {
  return [...todayTasks(), ...waitingTasks()];
}

function doingTasks() {
  return state.tasks.filter(task => String(task.status || '').toLowerCase() === 'doing');
}

function doneTasks() {
  return state.tasks.filter(task => task.status === 'done');
}

function overdueTasks() {
  return pendingTasks().filter(task => taskDueState(task).state === 'overdue');
}

function dueSoonTasks() {
  return pendingTasks().filter(task => {
    const state = taskDueState(task).state;
    return state === 'today' || state === 'soon';
  });
}

function blockedProjects() {
  return (state.data.projects || []).filter(hasMeaningfulBlocker);
}

function hasMeaningfulBlocker(project) {
  const blocker = String(project?.blocker || '').trim().toLowerCase();
  if (!blocker) return false;
  return !/^no major blocker|^no blocker|^none/.test(blocker);
}

function waitingOnText(task) {
  return task.waiting_on || task.waitingOn || '';
}

function taskDueState(task) {
  if (!task?.due) return { state: 'none', days: null };
  const due = isoDateOnly(task.due);
  const ref = todayKey();
  if (!due || !ref) return { state: 'none', days: null };
  const dueDate = new Date(`${due}T00:00:00Z`);
  const refDate = new Date(`${ref}T00:00:00Z`);
  const diffDays = Math.round((dueDate - refDate) / 86400000);
  if (diffDays < 0) return { state: 'overdue', days: Math.abs(diffDays) };
  if (diffDays === 0) return { state: 'today', days: 0 };
  if (diffDays <= 2) return { state: 'soon', days: diffDays };
  return { state: 'upcoming', days: diffDays };
}

function taskTimingClass(task) {
  const state = taskDueState(task).state;
  if (state === 'overdue') return 'is-overdue';
  if (state === 'today' || state === 'soon') return 'is-due-soon';
  return '';
}

function dueBadge(task) {
  const label = dueLabel(task);
  if (!label) return '';
  const state = taskDueState(task).state;
  const tone = state === 'overdue' ? 'red' : state === 'today' || state === 'soon' ? 'amber' : 'blue';
  return chip(label, tone);
}

function dueLabel(task) {
  const due = taskDueState(task);
  if (due.state === 'overdue') return `Overdue ${due.days}d`;
  if (due.state === 'today') return 'Due today';
  if (due.state === 'soon') return `Due in ${due.days}d`;
  if (due.state === 'upcoming') return `Due ${isoDateOnly(task.due)}`;
  return task?.due ? `Due ${isoDateOnly(task.due)}` : '';
}

function taskSummary(task) {
  return shortText(`${task.project || 'General'}${task.due ? ` · ${dueLabel(task)}` : ''}`, 72);
}



function recentActivityData() {
  if (state.data.recent_activity) return state.data.recent_activity;
  return { items: [] };
}

function timelineMarkup(items, emptyText) {
  if (!items?.length) return `<div class="empty">${escapeHtml(emptyText)}</div>`;
  return `<div class="timeline-list">${items.map(item => `
    <article class="timeline-item ${item.tone ? `timeline-${escapeHtml(String(item.tone).toLowerCase())}` : ''}">
      <div class="timeline-item-top">
        <strong>${escapeHtml(item.title || '')}</strong>
        ${item.time ? `<span class="timeline-time">${escapeHtml(item.time)}</span>` : ''}
      </div>
      <p>${escapeHtml(item.detail || '')}</p>
    </article>
  `).join('')}</div>`;
}

function ceoBriefData() {
  if (state.data.daily_ceo_briefing) return state.data.daily_ceo_briefing;
  return {
    headline: state.data.command_header?.primary_goal || 'Daily CEO briefing',
    summary: state.data.workspace?.status || 'No briefing loaded.',
    priorities: todayTasks().slice(0, 3).map(task => ({ title: task.title, detail: taskSummary(task) })),
    decisions: (state.data.decision_centre || []).slice(0, 3).map(item => ({ title: item.title, detail: item.next_action || item.impact || '' })),
    wins: doneTasks().slice(0, 3).map(task => ({ title: task.title, detail: task.notes || 'Completed.' })),
    risks: blockedProjects().slice(0, 3).map(project => ({ title: project.name, detail: project.blocker || 'Blocked.' })),
    done_recently: doneTasks().slice(0, 3).map(task => ({ title: task.title, detail: task.notes || 'Completed.' })),
    next_checks: [],
    scoreboard: [],
    changes_since_yesterday: (state.data.recent_activity?.items || []).slice(0, 3)
  };
}

function agentActivityData() {
  if (state.data.agent_activity) return state.data.agent_activity;
  return {
    recent_runs: [],
    queue: [],
    alerts: []
  };
}

function weeklyReviewData() {
  if (state.data.weekly_review) return state.data.weekly_review;
  return {
    headline: 'Weekly review',
    summary: 'Keep the highest-leverage work moving and remove low-value distractions.',
    this_week: todayTasks().slice(0, 3).map(task => ({ title: task.title, detail: taskSummary(task) })),
    wins: doneTasks().slice(0, 3).map(task => ({ title: task.title, detail: task.notes || 'Completed.' })),
    risks: blockedProjects().slice(0, 3).map(project => ({ title: project.name, detail: project.blocker || 'Blocked.' })),
    stop_doing: (state.data.company_brain?.ignore_for_now || []).slice(0, 3),
    watch: (state.data.company_brain?.watchlist || []).slice(0, 3),
    review_questions: []
  };
}

function isoDateOnly(value) {
  const match = String(value || '').match(/\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : '';
}

function todayKey() {
  return isoDateOnly(state.data?.generated_at) || new Date().toISOString().slice(0, 10);
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

function summaryListCard(title, items, emptyText, tone = 'blue') {
  return `<article class="summary-list-card summary-${tone}"><h3>${escapeHtml(title)}</h3>${miniList(items, emptyText)}</article>`;
}

function actionCard(label, title, detail, chips = '', href = './tasks.html', cta = 'Open', tone = 'red') {
  return `
    <article class="card action-card action-${tone}">
      <span class="hero-meta-label">${escapeHtml(label)}</span>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(detail)}</p>
      ${chips ? `<div class="chip-row">${chips}</div>` : ''}
      <div class="action-cta-row"><a class="btn primary" href="${href}">${escapeHtml(cta)}</a></div>
    </article>
  `;
}

function actionMiniCard(label, title, detail, tone = 'blue') {
  return `
    <article class="card action-mini-card action-mini-${tone}">
      <span class="hero-meta-label">${escapeHtml(label)}</span>
      <strong>${escapeHtml(title)}</strong>
      <p>${escapeHtml(detail)}</p>
    </article>
  `;
}

function statCard(title, value, note, tone = '') {
  const toneClass = tone ? ` stat-${tone}` : '';
  return `<article class="stat${toneClass}"><h3>${escapeHtml(title)}</h3><span class="stat-value">${escapeHtml(value)}</span><p class="metric-note">${escapeHtml(note)}</p></article>`;
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
  return { today: 'Today', todo: 'Today', doing: 'Today', waiting: 'Waiting', done: 'Done' }[String(status || '').toLowerCase()] || capitalise(String(status || 'unknown'));
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
  const normalized = String(task.status || 'today').toLowerCase();
  const currentStatus = normalized === 'todo' ? 'today' : normalized === 'doing' ? 'today' : normalized;
  const order = ['today', 'waiting', 'done'];
  const current = order.indexOf(currentStatus);
  const next = Math.max(0, Math.min(order.length - 1, current + direction));
  state.tasks[index] = { ...task, status: order[next] };
  saveLocalTasks();
  renderPage();
};
