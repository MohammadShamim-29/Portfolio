import { Award, Briefcase, GraduationCap } from 'lucide-react'
import { SectionShell } from './SectionShell.jsx'
import { isPlaceholder } from '../../utils/contentUtils.js'

function TimelineItem({
  icon: Icon,
  title,
  subtitle,
  location,
  period,
  details,
  highlights,
}) {
  return (
    <article className="timeline-item">
      <span className="timeline-icon" aria-hidden="true">
        <Icon size={16} />
      </span>
      <div className="timeline-copy">
        <div className="timeline-head">
          <h4 className={isPlaceholder(title) ? 'is-placeholder' : undefined}>
            {title}
          </h4>
          {period ? (
            <span
              className={`timeline-period ${isPlaceholder(period) ? 'is-placeholder' : ''}`}
            >
              {period}
            </span>
          ) : null}
        </div>
        {subtitle ? (
          <p
            className={`timeline-subtitle ${isPlaceholder(subtitle) ? 'is-placeholder' : ''}`}
          >
            {subtitle}
          </p>
        ) : null}
        {location ? <p className="timeline-location">{location}</p> : null}
        {details ? (
          <p className={isPlaceholder(details) ? 'is-placeholder' : undefined}>
            {details}
          </p>
        ) : null}
        {highlights?.length ? (
          <ul className="timeline-highlights">
            {highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  )
}

export function EducationSection({
  education,
  certifications,
  experience,
  section,
  index,
}) {
  return (
    <SectionShell
      id={section.id}
      index={index}
      kicker="Education, training & experience"
      title={section.title}
      place={section.place}
      align={section.align}
    >
      <div className="timeline-group">
        <h3>{education.title}</h3>
        {education.items.map((item) => (
          <TimelineItem
            key={item.id}
            icon={GraduationCap}
            title={item.degree}
            subtitle={item.institution}
            period={item.period}
            details={item.details}
          />
        ))}
      </div>
      {certifications?.items?.length ? (
        <div className="timeline-group">
          <h3>{certifications.title}</h3>
          {certifications.items.map((item) => (
            <TimelineItem
              key={item.id}
              icon={Award}
              title={item.title}
              subtitle={item.issuer}
              period={item.period}
              details={item.details}
            />
          ))}
        </div>
      ) : null}
      <div className="timeline-group">
        <h3>{experience.title}</h3>
        {experience.items.map((item) => (
          <TimelineItem
            key={item.id}
            icon={Briefcase}
            title={item.role}
            subtitle={item.organization}
            location={item.location}
            period={item.period}
            highlights={item.highlights}
          />
        ))}
      </div>
    </SectionShell>
  )
}
