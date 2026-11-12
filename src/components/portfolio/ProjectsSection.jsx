import { ExternalLink } from 'lucide-react'
import { SectionShell } from './SectionShell.jsx'
import {
  getSafeHref,
  isPlaceholder,
} from '../../utils/contentUtils.js'

const LINK_LABELS = {
  live: 'Live site',
  source: 'Source',
  paper: 'Paper',
  demo: 'Demo',
}

export function ProjectsSection({ projects, section, index }) {
  return (
    <SectionShell
      id={section.id}
      index={index}
      kicker={projects.kicker}
      title={projects.title}
      place={section.place}
      align={section.align}
    >
      <p className={`prose-intro ${isPlaceholder(projects.intro) ? 'is-placeholder' : ''}`}>
        {projects.intro}
      </p>
      <div className="project-list">
        {projects.items.map((project, projectIndex) => {
          const links = Object.entries(project.links ?? {})
            .map(([key, value]) => ({
              key,
              label: LINK_LABELS[key] ?? key,
              href: getSafeHref(value),
            }))
            .filter((link) => link.href)

          return (
            <article key={project.id} className="project-card">
              <div className="project-top">
                <span className="project-number" aria-hidden="true">
                  {String(projectIndex + 1).padStart(2, '0')}
                </span>
                <span className="project-category">{project.category}</span>
                {project.status ? (
                  <span className="project-status">{project.status}</span>
                ) : null}
                {project.featured ? (
                  <span className="project-featured">Featured</span>
                ) : null}
                {project.placeholder ? (
                  <span className="placeholder-badge">Placeholder</span>
                ) : null}
              </div>
              <h3 className={isPlaceholder(project.title) ? 'is-placeholder' : undefined}>
                {project.title}
              </h3>
              <p className={isPlaceholder(project.description) ? 'is-placeholder' : undefined}>
                {project.description}
              </p>
              <ul className="tag-list">
                {(project.tags ?? []).map((tag) => (
                  <li
                    key={tag}
                    className={`tag ${isPlaceholder(tag) ? 'is-placeholder' : ''}`}
                  >
                    {tag}
                  </li>
                ))}
              </ul>
              {links.length > 0 ? (
                <div className="project-links">
                  {links.map((link) => (
                    <a
                      key={link.key}
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noreferrer noopener' : undefined}
                      className="text-link"
                    >
                      {link.label}
                      <ExternalLink size={13} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="link-placeholder">
                  Links will appear here once the project is public.
                </p>
              )}
            </article>
          )
        })}
      </div>
    </SectionShell>
  )
}
