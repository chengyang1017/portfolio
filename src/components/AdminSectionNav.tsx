import { NavLink } from 'react-router-dom';

export function AdminSectionNav() {
  return (
    <div className="admin-section-nav-shell">
      <nav className="admin-section-nav shell" aria-label="Portfolio administration">
        <div className="admin-section-nav-brand">
          <span>LCY / CONTROL</span>
          <small>Portfolio CMS</small>
        </div>
        <div className="admin-section-nav-links">
          <NavLink to="/admin" end>
            Workspace
          </NavLink>
          <NavLink to="/admin/content">
            Page copy &amp; media
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
