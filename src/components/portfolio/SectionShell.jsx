export function SectionShell({
  id,
  index,
  kicker,
  title,
  place,
  align = 'left',
  className = '',
  children,
}) {
  return (
    <section
      id={id}
      className={`journey-section align-${align} ${className}`}
      aria-labelledby={`${id}-title`}
      tabIndex={-1}
    >
      <span className="section-place" aria-hidden="true">
        {place}
      </span>
      <div className="panel">
        <div className="panel-top">
          <span className="section-number" aria-hidden="true">
            {index}
          </span>
          <span className="panel-kicker">{kicker}</span>
        </div>
        <h2 id={`${id}-title`}>{title}</h2>
        <div className="panel-body">{children}</div>
      </div>
    </section>
  )
}
