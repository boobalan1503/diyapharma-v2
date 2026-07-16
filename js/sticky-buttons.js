/* ============================================
   DHIYA MEDICAL AGENCY — Sticky Call & WhatsApp Buttons
   Auto-injects floating buttons on all pages
   ============================================ */

(function() {
  'use strict';

  const PHONE_NUMBER = '918428622844';
  const WHATSAPP_MESSAGE = encodeURIComponent('Hi Dhiya Medical Agency! I would like to enquire about your products.');

  function createStickyButtons() {
    // Avoid double injection
    if (document.querySelector('.sticky-buttons')) return;

    const container = document.createElement('div');
    container.className = 'sticky-buttons';
    container.setAttribute('id', 'stickyButtons');

    container.innerHTML = `
      <a href="https://wa.me/${PHONE_NUMBER}?text=${WHATSAPP_MESSAGE}"
         target="_blank"
         rel="noopener noreferrer"
         class="sticky-btn sticky-btn-whatsapp"
         aria-label="Chat on WhatsApp"
         title="Chat on WhatsApp">
        <span class="sticky-btn-icon">
          <i class="fa-brands fa-whatsapp"></i>
        </span>
        <span class="sticky-btn-label">WhatsApp</span>
      </a>
      <a href="tel:+${PHONE_NUMBER}"
         class="sticky-btn sticky-btn-call"
         aria-label="Call Now"
         title="Call Now">
        <span class="sticky-btn-icon">
          <i class="fa-solid fa-phone"></i>
        </span>
        <span class="sticky-btn-label">Call Now</span>
      </a>
    `;

    document.body.appendChild(container);
  }

  // Init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createStickyButtons);
  } else {
    createStickyButtons();
  }
})();
