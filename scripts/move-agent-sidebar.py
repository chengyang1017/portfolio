from pathlib import Path

page_path = Path('src/pages/AdminPage.tsx')
page = page_path.read_text(encoding='utf-8')

workspace_marker = 'className="admin-workspace"'
if workspace_marker not in page:
    agent_start_marker = '      <section className="admin-panel admin-global-agent-panel" aria-label={ui.agentTitle}>'
    next_marker = '\n\n      <section className="admin-panel admin-ai-panel">'
    main_close_marker = '    </main>\n  );\n}'

    start = page.index(agent_start_marker)
    next_start = page.index(next_marker, start)
    agent_block = page[start:next_start]

    sidebar = agent_block.replace(
        '<section className="admin-panel admin-global-agent-panel"',
        '<aside className="admin-global-agent-panel"',
        1,
    )
    last_close = sidebar.rfind('</section>')
    if last_close == -1:
        raise SystemExit('agent closing section not found')
    sidebar = sidebar[:last_close] + '</aside>' + sidebar[last_close + len('</section>'):]

    # Remove the old full-width panel, then wrap the normal admin sections as the main column.
    page = page[:start] + page[next_start + 2:]
    insert_start = start
    page = (
        page[:insert_start]
        + '      <div className="admin-workspace">\n'
        + '        <div className="admin-workspace-main">\n'
        + page[insert_start:]
    )

    close_at = page.rfind(main_close_marker)
    if close_at == -1:
        raise SystemExit('main closing marker not found')

    page = (
        page[:close_at]
        + '        </div>\n\n'
        + sidebar
        + '\n      </div>\n'
        + page[close_at:]
    )

page_path.write_text(page, encoding='utf-8')

css_path = Path('src/styles/admin.css')
css = css_path.read_text(encoding='utf-8')
css_marker = '/* IDE-style global agent sidebar */'
if css_marker not in css:
    css += r'''

/* IDE-style global agent sidebar */
.admin-page.shell {
  width: min(1580px, calc(100% - 48px));
}

.admin-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(330px, 390px);
  gap: 28px;
  align-items: start;
}

.admin-workspace-main {
  min-width: 0;
}

.admin-workspace-main > .admin-panel:first-child {
  padding-top: 38px;
}

.admin-global-agent-panel {
  position: sticky;
  top: 18px;
  align-self: start;
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-height: calc(100vh - 36px);
  min-height: 560px;
  padding: 18px;
  border: 1px solid #33443a;
  border-radius: 14px;
  background: #0b120e;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.22);
  overflow: hidden;
}

.admin-global-agent-panel .admin-panel-heading {
  margin-bottom: 0;
  padding-bottom: 14px;
  border-bottom: 1px solid #26352d;
}

.admin-global-agent-panel .admin-panel-heading > p {
  max-width: none;
  font-size: 0.7rem;
  line-height: 1.5;
}

.admin-global-agent-panel h2 {
  margin: 5px 0 0;
  font-family: 'Manrope', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.03em;
}

.admin-global-agent-panel .admin-agent-heading {
  align-items: flex-start;
  flex-direction: column;
  gap: 8px;
}

.admin-global-agent-context {
  margin-bottom: 0;
  padding: 11px 12px;
  border-radius: 10px;
}

.admin-global-agent-context strong {
  font-size: 0.82rem;
}

.admin-global-agent-context small {
  font-size: 0.68rem;
}

.admin-global-agent-thread {
  flex: 1 1 auto;
  min-height: 120px;
  max-height: none;
  margin-bottom: 0;
  padding-right: 4px;
  overflow-y: auto;
}

.admin-global-agent-panel .admin-agent-message {
  max-width: 94%;
  font-size: 0.78rem;
}

.admin-global-agent-panel .admin-agent-quick-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px;
}

.admin-global-agent-panel .admin-agent-quick-actions button {
  width: 100%;
  min-height: 38px;
  padding: 7px 9px;
  font-size: 0.68rem;
  line-height: 1.25;
}

.admin-global-agent-compose {
  margin-top: auto;
  grid-template-columns: 1fr;
}

.admin-global-agent-compose textarea {
  min-height: 94px;
  max-height: 180px;
}

.admin-global-agent-compose button {
  width: 100%;
}

.admin-global-agent-panel .admin-message {
  margin-top: 0;
  font-size: 0.72rem;
}

.admin-global-agent-proposal {
  max-height: 230px;
  margin-top: 0;
  overflow-y: auto;
}

.admin-global-agent-proposal .admin-chip-row {
  max-height: 92px;
  overflow-y: auto;
}

@media (max-width: 1180px) {
  .admin-page.shell {
    width: var(--shell);
  }

  .admin-workspace {
    grid-template-columns: 1fr;
  }

  .admin-global-agent-panel {
    position: static;
    max-height: none;
    min-height: 0;
  }

  .admin-global-agent-thread {
    max-height: 300px;
  }
}

@media (max-width: 620px) {
  .admin-global-agent-panel {
    padding: 14px;
  }

  .admin-global-agent-panel .admin-agent-quick-actions {
    grid-template-columns: 1fr;
  }
}
'''

css_path.write_text(css, encoding='utf-8')
