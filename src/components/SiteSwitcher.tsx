import { getSite, setSite, SITES, SiteKey } from '../services/site';

/**
 * Chooses which site the CMS is editing.
 *
 * Deliberately prominent rather than tucked into a settings menu: the two sites
 * have pages with identical names — About, Impact, Contact — so "which site am
 * I editing?" has to be answerable at a glance. Editing the wrong About page is
 * the mistake this component exists to prevent, and it is one you would not
 * notice until it was published.
 */
interface SiteSwitcherProps {
  /** Called after the site changes, so the caller can reload its data. */
  onChange?: (site: SiteKey) => void;
}

export default function SiteSwitcher({ onChange }: SiteSwitcherProps) {
  const active = getSite();

  const choose = (site: SiteKey) => {
    if (site === active) return;
    setSite(site);
    onChange?.(site);
  };

  return (
    <div
      className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 p-1"
      role="group"
      aria-label="Which site to edit"
    >
      {SITES.map((site) => {
        const isActive = site.key === active;
        return (
          <button
            key={site.key}
            type="button"
            onClick={() => choose(site.key)}
            aria-pressed={isActive}
            title={site.hint}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {site.label}
            {/* The domain, so there is no doubt which live site this writes to. */}
            <span className="hidden sm:inline ml-2 text-xs font-normal text-gray-400">
              {site.hint}
            </span>
          </button>
        );
      })}
    </div>
  );
}
