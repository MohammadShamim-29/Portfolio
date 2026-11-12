import { SectionShell } from './SectionShell.jsx'
import { isPlaceholder } from '../../utils/contentUtils.js'

export function SkillsSection({ skills, section, index }) {
  return (
    <SectionShell
      id={section.id}
      index={index}
      kicker={skills.kicker}
      title={skills.title}
      place={section.place}
      align={section.align}
    >
      {skills.intro ? (
        <p className={`prose-intro ${isPlaceholder(skills.intro) ? 'is-placeholder' : ''}`}>
          {skills.intro}
        </p>
      ) : null}
      <div className="skill-grid">
        {skills.groups.map((group) => (
          <article key={group.id} className="skill-card">
            <h3>{group.title}</h3>
            {group.note ? (
              <p className={isPlaceholder(group.note) ? 'is-placeholder' : undefined}>
                {group.note}
              </p>
            ) : null}
            <ul className="tag-list">
              {group.items.map((item) => (
                <li
                  key={item}
                  className={`tag ${isPlaceholder(item) ? 'is-placeholder' : ''}`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </SectionShell>
  )
}
