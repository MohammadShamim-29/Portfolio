export function Footer({ meta, onScrollTo }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p className="footer-brand">
          <strong>{meta.siteName}</strong>
          <span>{meta.tagline}</span>
        </p>
        <p className="footer-meta">
          All times shown in Asia/Dhaka · Seasons are fixed Gregorian
          approximations · Event dates marked estimated are not official.
        </p>
        <button
          type="button"
          className="text-link footer-top"
          onClick={() => onScrollTo('hero')}
        >
          Back to the river
        </button>
      </div>
    </footer>
  )
}
