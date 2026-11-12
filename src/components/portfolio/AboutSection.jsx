import { SectionShell } from './SectionShell.jsx'
import { isPlaceholder } from '../../utils/contentUtils.js'

export function AboutSection({ about, section, index }) {
  return (
    <SectionShell
      id={section.id}
      index={index}
      kicker={about.kicker}
      title={about.title}
      place={section.place}
      align={section.align}
    >
      <div className="prose">
        {about.body.map((paragraph, paragraphIndex) => (
          <p
            key={paragraphIndex}
            className={isPlaceholder(paragraph) ? 'is-placeholder' : undefined}
          >
            {paragraph}
          </p>
        ))}
        {about.academicBackground ? (
          <p
            className={
              isPlaceholder(about.academicBackground) ? 'is-placeholder' : undefined
            }
          >
            {about.academicBackground}
          </p>
        ) : null}
      </div>
      <dl className="facts">
        {about.facts.map((fact) => (
          <div key={fact.label} className="fact">
            <dt>{fact.label}</dt>
            <dd className={isPlaceholder(fact.value) ? 'is-placeholder' : undefined}>
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
      {about.interests?.length ? (
        <div className="interest-groups">
          {about.interests.map((group) => (
            <div key={group.label} className="interest-group">
              <h3>{group.label}</h3>
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
            </div>
          ))}
        </div>
      ) : null}
    </SectionShell>
  )
}
