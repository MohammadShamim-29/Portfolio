import { FileText, Github, Linkedin, Mail, MapPin } from 'lucide-react'
import { SectionShell } from './SectionShell.jsx'
import {
  getSafeHref,
  isPlaceholder,
} from '../../utils/contentUtils.js'

function ContactLink({ icon: Icon, label, value, href }) {
  if (!href) {
    return (
      <span className="contact-link is-placeholder">
        <span className="contact-icon" aria-hidden="true">
          <Icon size={16} />
        </span>
        <span className="contact-copy">
          <span className="contact-label">{label}</span>
          <span className="contact-value">{value}</span>
        </span>
      </span>
    )
  }

  const external = href.startsWith('http')
  return (
    <a
      className="contact-link"
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer noopener' : undefined}
    >
      <span className="contact-icon" aria-hidden="true">
        <Icon size={16} />
      </span>
      <span className="contact-copy">
        <span className="contact-label">{label}</span>
        <span className="contact-value">{value}</span>
      </span>
    </a>
  )
}

export function ContactSection({ contact, owner, section, index }) {
  const emailHref = getSafeHref(contact.email, { email: true })
  const githubHref = getSafeHref(contact.github)
  const linkedinHref = getSafeHref(contact.linkedin)
  const cvHref = getSafeHref(contact.cv?.url)

  return (
    <SectionShell
      id={section.id}
      index={index}
      kicker={contact.kicker}
      title={contact.title}
      place={section.place}
      align={section.align}
    >
      {contact.body ? (
        <p className={`prose-intro ${isPlaceholder(contact.body) ? 'is-placeholder' : ''}`}>
          {contact.body}
        </p>
      ) : null}
      <div className="contact-meta">
        <span className="contact-location">
          <MapPin size={15} aria-hidden="true" />
          {owner.location}
        </span>
        <span
          className={`contact-availability ${isPlaceholder(owner.availability) ? 'is-placeholder' : ''}`}
        >
          {owner.availability}
        </span>
      </div>
      <div className="contact-grid">
        <ContactLink
          icon={Mail}
          label="Email"
          value={contact.email}
          href={emailHref}
        />
        <ContactLink
          icon={Github}
          label="GitHub"
          value={contact.github}
          href={githubHref}
        />
        <ContactLink
          icon={Linkedin}
          label="LinkedIn"
          value={contact.linkedin}
          href={linkedinHref}
        />
        <ContactLink
          icon={FileText}
          label={contact.cv?.label ?? 'CV'}
          value={contact.cv?.file ?? contact.cv?.url}
          href={cvHref}
        />
      </div>
      {contact.note ? <p className="content-note">{contact.note}</p> : null}
    </SectionShell>
  )
}
