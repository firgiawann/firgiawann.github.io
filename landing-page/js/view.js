const renderList = (items, renderer) => items.map(renderer).join("");

export const renderHero = (data) => {
  const heroName = document.querySelector("#hero-name");
  const heroEyebrow = document.querySelector("#hero-eyebrow");
  const heroTagline = document.querySelector("#hero-tagline");
  const heroRoles = document.querySelector("#hero-roles");
  const heroActions = document.querySelector("#hero-actions");
  const heroSocials = document.querySelector("#hero-socials");
  const heroLocation = document.querySelector("#hero-location");

  heroName.textContent = `${data.name} (${data.nickname})`;
  heroEyebrow.textContent = data.title;
  heroTagline.textContent = data.tagline;
  heroLocation.textContent = data.location;

  heroRoles.innerHTML = renderList(
    data.roles,
    (role) => `<span class="role-pill">${role}</span>`
  );

  heroActions.innerHTML = renderList(data.ctas, (cta) => {
    const classes = cta.variant === "primary" ? "btn-glass btn-primary-glass" : "btn-glass";
    const target = cta.external ? "_blank" : "_self";
    const rel = cta.external ? "rel=\"noreferrer\"" : "";
    return `
      <a class="${classes}" href="${cta.href}" target="${target}" ${rel}>
        <i class="${cta.icon}"></i>
        ${cta.label}
      </a>
    `;
  });

  heroSocials.innerHTML = renderList(
    data.socials,
    (social) => `<a href="${social.href}" target="_blank" rel="noreferrer"><i class="${social.icon}"></i></a>`
  );
};

export const renderAbout = (data) => {
  const summary = document.querySelector("#about-summary");
  const highlights = document.querySelector("#about-highlights");

  summary.innerHTML = `
    <h3>Halo, aku ${data.nickname} 👋</h3>
    <p>${data.intro}</p>
  `;

  highlights.innerHTML = `
    <h3>Highlight Personal</h3>
    ${renderList(
      data.highlights,
      (item) => `
        <div class="mb-3">
          <h4 class="mb-1">${item.title}</h4>
          <p class="mb-0 text-secondary">${item.description}</p>
        </div>
      `
    )}
  `;
};

export const renderIdentity = (data) => {
  const identity = document.querySelector("#identity-grid");
  identity.innerHTML = `
    <div class="info-grid">
      ${renderList(
        data.identity,
        (item) => `
          <div class="info-item">
            <span>${item.label}</span>
            <strong>${item.value}</strong>
          </div>
        `
      )}
    </div>
  `;
};

export const renderResume = (data) => {
  const education = document.querySelector("#education-timeline");
  const skills = document.querySelector("#skill-matrix");

  education.innerHTML = `
    <h3>Education Journey</h3>
    <div class="timeline">
      ${renderList(
        data.education,
        (item) => `
          <div class="timeline-item">
            <h4>${item.year}</h4>
            <p><strong>${item.title}</strong></p>
            <p>${item.detail}</p>
          </div>
        `
      )}
    </div>
  `;

  skills.innerHTML = `
    <h3>Skill Matrix</h3>
    <div class="skill-list">
      ${renderList(
        data.skills,
        (skill) => `
          <div>
            <div class="d-flex justify-content-between">
              <strong>${skill.label}</strong>
              <span class="text-secondary">${skill.level}%</span>
            </div>
            <div class="skill-bar">
              <span style="width: ${skill.level}%;"></span>
            </div>
          </div>
        `
      )}
    </div>
  `;
};

export const renderServices = (data) => {
  const services = document.querySelector("#service-grid");
  services.innerHTML = renderList(
    data.services,
    (service) => `
      <div class="service-card">
        <i class="${service.icon}"></i>
        <h4>${service.title}</h4>
        <p class="text-secondary mb-0">${service.desc}</p>
      </div>
    `
  );
};

export const renderCanva = (data) => {
  const panel = document.querySelector("#canva-panel");
  panel.innerHTML = `
    <div class="row align-items-center g-4">
      <div class="col-lg-7">
        <h3>${data.canva.title}</h3>
        <p class="text-secondary">${data.canva.description}</p>
        <div class="highlight-list">
          ${renderList(
            data.canva.steps,
            (step) => `
              <div class="highlight-item">
                <i class="fa-solid fa-check-circle"></i>
                <span>${step}</span>
              </div>
            `
          )}
        </div>
      </div>
      <div class="col-lg-5 text-lg-end">
        <a class="btn-glass btn-primary-glass" href="${data.canva.action.href}" target="_blank" rel="noreferrer">
          <i class="${data.canva.action.icon}"></i>
          ${data.canva.action.label}
        </a>
      </div>
    </div>
  `;
};

export const renderContact = (data) => {
  const contactCard = document.querySelector("#contact-card");
  const contactLinks = document.querySelector("#contact-links");

  contactCard.innerHTML = `
    <h3>${data.contact.headline}</h3>
    <p class="text-secondary">${data.contact.description}</p>
  `;

  contactLinks.innerHTML = `
    <div class="contact-links">
      ${renderList(
        data.contact.links,
        (link) => `
          <a class="contact-link" href="${link.href}" target="_blank" rel="noreferrer">
            <i class="${link.icon}"></i>
            <span>${link.label}</span>
          </a>
        `
      )}
    </div>
  `;
};
