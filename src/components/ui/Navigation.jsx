export function Navigation({ sections, activeId, scrollToSection }) {
  return (
    <nav className="section-nav" aria-label="Portfolio journey">
      <span className="nav-progress" aria-hidden="true">
        <span className="nav-progress-fill" />
      </span>
      <ol>
        {sections.map((section, index) => {
          const active = activeId === section.id
          return (
            <li key={section.id}>
              <button
                type="button"
                className={`nav-stop ${active ? 'is-active' : ''}`}
                onClick={() => scrollToSection(section.id)}
                aria-current={active ? 'location' : undefined}
                aria-label={`${section.nav} — ${section.place}`}
              >
                <span className="nav-dot" aria-hidden="true" />
                <span className="nav-label">
                  <span className="nav-index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="nav-name">{section.nav}</span>
                  <span className="nav-place">{section.place}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
