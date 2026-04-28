import { profileData } from "./model.js";
import {
  renderHero,
  renderAbout,
  renderIdentity,
  renderResume,
  renderServices,
  renderCanva,
  renderContact
} from "./view.js";

document.addEventListener("DOMContentLoaded", () => {
  renderHero(profileData);
  renderAbout(profileData);
  renderIdentity(profileData);
  renderResume(profileData);
  renderServices(profileData);
  renderCanva(profileData);
  renderContact(profileData);

  const yearEl = document.querySelector("#footer-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
