import avatar from './assets/avatar.png'
import { profileData } from './data/profile'

const navLinks = [
  { label: 'Tentang', href: '#about' },
  { label: 'Identitas', href: '#identity' },
  { label: 'Resume', href: '#resume' },
  { label: 'Layanan', href: '#services' },
  { label: 'Canva', href: '#canva' },
  { label: 'Kontak', href: '#contact' }
]

function App() {
  const year = new Date().getFullYear()

  return (
    <>
      <div className="background">
        <span className="orb orb-1"></span>
        <span className="orb orb-2"></span>
        <span className="orb orb-3"></span>
        <span className="orb orb-4"></span>
      </div>

      <nav className="glass-nav">
        <div className="container">
          <div className="nav-inner">
            <a className="brand" href="#home">
              {profileData.nickname}
            </a>
            <div className="nav-links">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <header id="home" className="section hero-section">
        <div className="container">
          <div className="glass-panel hero-panel">
            <div className="row align-items-center g-4">
              <div className="col-lg-4 text-center">
                <div className="avatar-wrap">
                  <img src={avatar} alt={`Foto ${profileData.name}`} />
                  <span className="status-pill">{profileData.location}</span>
                </div>
              </div>
              <div className="col-lg-8">
                <p className="eyebrow">{profileData.title}</p>
                <h1>
                  {profileData.name} ({profileData.nickname})
                </h1>
                <p className="hero-tagline">{profileData.tagline}</p>
                <div className="hero-roles">
                  {profileData.roles.map((role) => (
                    <span key={role} className="role-pill">
                      {role}
                    </span>
                  ))}
                </div>
                <div className="hero-actions">
                  {profileData.ctas.map((cta) => {
                    const actionClass =
                      cta.variant === 'primary' ? 'btn-glass btn-primary-glass' : 'btn-glass'
                    return (
                      <a
                        key={cta.label}
                        className={actionClass}
                        href={cta.href}
                        target={cta.external ? '_blank' : '_self'}
                        rel={cta.external ? 'noreferrer' : undefined}
                      >
                        <i className={cta.icon}></i>
                        {cta.label}
                      </a>
                    )
                  })}
                </div>
                <div className="hero-socials">
                  {profileData.socials.map((social) => (
                    <a key={social.href} href={social.href} target="_blank" rel="noreferrer">
                      <i className={social.icon}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section id="about" className="section">
          <div className="container">
            <div className="section-heading">
              <p className="section-kicker">Tentang Saya</p>
              <h2>Personal branding yang profesional dan hangat</h2>
            </div>
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="glass-panel">
                  <h3>Halo, aku {profileData.nickname} 👋</h3>
                  <p>{profileData.intro}</p>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="glass-panel">
                  <h3>Highlight Personal</h3>
                  {profileData.highlights.map((item) => (
                    <div key={item.title} className="mb-3">
                      <h4 className="mb-1">{item.title}</h4>
                      <p className="mb-0 text-secondary">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="identity" className="section">
          <div className="container">
            <div className="section-heading">
              <p className="section-kicker">Identitas</p>
              <h2>Data pribadi & karakter singkat</h2>
            </div>
            <div className="glass-panel">
              <div className="info-grid">
                {profileData.identity.map((item) => (
                  <div key={item.label} className="info-item">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="resume" className="section">
          <div className="container">
            <div className="section-heading">
              <p className="section-kicker">Resume</p>
              <h2>Perjalanan pendidikan & fokus keahlian</h2>
            </div>
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="glass-panel">
                  <h3>Education Journey</h3>
                  <div className="timeline">
                    {profileData.education.map((item) => (
                      <div key={item.year} className="timeline-item">
                        <h4>{item.year}</h4>
                        <p>
                          <strong>{item.title}</strong>
                        </p>
                        <p>{item.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="glass-panel">
                  <h3>Skill Matrix</h3>
                  <div className="skill-list">
                    {profileData.skills.map((skill) => (
                      <div key={skill.label}>
                        <div className="d-flex justify-content-between">
                          <strong>{skill.label}</strong>
                          <span className="text-secondary">{skill.level}%</span>
                        </div>
                        <div className="skill-bar">
                          <span style={{ width: `${skill.level}%` }}></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="section">
          <div className="container">
            <div className="section-heading">
              <p className="section-kicker">Kuotanya Awan</p>
              <h2>Layanan digital yang aku kelola</h2>
            </div>
            <div className="service-grid">
              {profileData.services.map((service) => (
                <div key={service.title} className="service-card">
                  <i className={service.icon}></i>
                  <h4>{service.title}</h4>
                  <p className="text-secondary mb-0">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="canva" className="section">
          <div className="container">
            <div className="glass-panel highlight-panel">
              <div className="row align-items-center g-4">
                <div className="col-lg-7">
                  <h3>{profileData.canva.title}</h3>
                  <p className="text-secondary">{profileData.canva.description}</p>
                  <div className="highlight-list">
                    {profileData.canva.steps.map((step) => (
                      <div key={step} className="highlight-item">
                        <i className="fa-solid fa-check-circle"></i>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-lg-5 text-lg-end">
                  <a
                    className="btn-glass btn-primary-glass"
                    href={profileData.canva.action.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className={profileData.canva.action.icon}></i>
                    {profileData.canva.action.label}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section">
          <div className="container">
            <div className="section-heading">
              <p className="section-kicker">Kontak</p>
              <h2>Mari terhubung & berkolaborasi</h2>
            </div>
            <div className="row g-4">
              <div className="col-lg-5">
                <div className="glass-panel">
                  <h3>{profileData.contact.headline}</h3>
                  <p className="text-secondary">{profileData.contact.description}</p>
                </div>
              </div>
              <div className="col-lg-7">
                <div className="glass-panel">
                  <div className="contact-links">
                    {profileData.contact.links.map((link) => (
                      <a
                        key={link.href}
                        className="contact-link"
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i className={link.icon}></i>
                        <span>{link.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <span>© {year} Firgiawan Listianto.</span>
            <span>Dibuat dengan gaya glassmorphism ala iOS.</span>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
