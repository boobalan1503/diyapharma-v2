/* ============================================
   DHIYA MEDICAL AGENCY — Pincode Auto-Verification
   Checks delivery serviceability for Indian pincodes
   ============================================ */

const PincodeChecker = (function() {
  'use strict';

  // Serviceable pincode ranges (Tamil Nadu + Major metros)
  // Format: { start, end, area, days }
  const SERVICEABLE_RANGES = [
    // Tamil Nadu — Primary service area (2-3 days)
    { start: 600001, end: 600127, area: 'Chennai', days: '2-3' },
    { start: 601001, end: 601206, area: 'Kancheepuram', days: '2-3' },
    { start: 602001, end: 602117, area: 'Tiruvallur', days: '2-3' },
    { start: 603001, end: 603406, area: 'Chengalpattu', days: '2-3' },
    { start: 604001, end: 604408, area: 'Villupuram', days: '3-4' },
    { start: 605001, end: 605110, area: 'Puducherry', days: '3-4' },
    { start: 606001, end: 606903, area: 'Cuddalore', days: '3-4' },
    { start: 607001, end: 607901, area: 'Cuddalore', days: '3-4' },
    { start: 608001, end: 608902, area: 'Mayiladuthurai', days: '3-4' },
    { start: 609001, end: 609902, area: 'Nagapattinam', days: '3-4' },
    { start: 610001, end: 610906, area: 'Thanjavur', days: '3-4' },
    { start: 611001, end: 611112, area: 'Thanjavur', days: '3-4' },
    { start: 612001, end: 612904, area: 'Thanjavur', days: '3-4' },
    { start: 613001, end: 613703, area: 'Thanjavur', days: '3-4' },
    { start: 614001, end: 614904, area: 'Pudukkottai', days: '3-4' },
    { start: 620001, end: 620027, area: 'Tiruchirappalli', days: '2-3' },
    { start: 621001, end: 621802, area: 'Tiruchirappalli', days: '3-4' },
    { start: 622001, end: 622515, area: 'Pudukkottai', days: '3-4' },
    { start: 623001, end: 623806, area: 'Sivaganga', days: '2-3' },
    { start: 624001, end: 624802, area: 'Dindigul', days: '2-3' },
    { start: 625001, end: 625022, area: 'Madurai', days: '1-2' },
    { start: 625101, end: 625706, area: 'Madurai', days: '2-3' },
    // Virudhunagar — Home base (1-2 days)
    { start: 626001, end: 626612, area: 'Virudhunagar', days: '1-2' },
    { start: 627001, end: 627951, area: 'Tirunelveli', days: '2-3' },
    { start: 628001, end: 628906, area: 'Thoothukudi', days: '2-3' },
    { start: 629001, end: 629901, area: 'Kanyakumari', days: '3-4' },
    { start: 630001, end: 630611, area: 'Sivaganga', days: '2-3' },
    { start: 631001, end: 631604, area: 'Vellore', days: '3-4' },
    { start: 632001, end: 632602, area: 'Vellore', days: '3-4' },
    { start: 633001, end: 633503, area: 'Krishnagiri', days: '3-4' },
    { start: 634001, end: 634502, area: 'Tiruvannamalai', days: '3-4' },
    { start: 635001, end: 635901, area: 'Krishnagiri', days: '3-4' },
    { start: 636001, end: 636906, area: 'Salem', days: '3-4' },
    { start: 637001, end: 637505, area: 'Namakkal', days: '3-4' },
    { start: 638001, end: 638812, area: 'Erode', days: '3-4' },
    { start: 639001, end: 639207, area: 'Karur', days: '3-4' },
    { start: 641001, end: 641114, area: 'Coimbatore', days: '2-3' },
    { start: 642001, end: 642207, area: 'Coimbatore', days: '3-4' },
    { start: 643001, end: 643253, area: 'Nilgiris', days: '4-5' },

    // Major Indian metros — Extended delivery (4-6 days)
    { start: 110001, end: 110097, area: 'New Delhi', days: '4-6' },
    { start: 400001, end: 400107, area: 'Mumbai', days: '4-6' },
    { start: 500001, end: 500100, area: 'Hyderabad', days: '3-5' },
    { start: 560001, end: 560110, area: 'Bangalore', days: '3-4' },
    { start: 700001, end: 700157, area: 'Kolkata', days: '5-7' },
    { start: 380001, end: 380061, area: 'Ahmedabad', days: '5-7' },
    { start: 302001, end: 302039, area: 'Jaipur', days: '5-7' },
    { start: 226001, end: 226031, area: 'Lucknow', days: '5-7' },
    { start: 411001, end: 411062, area: 'Pune', days: '4-6' },
    { start: 682001, end: 682041, area: 'Kochi', days: '3-4' },

    // Kerala — Nearby state (3-5 days)
    { start: 670001, end: 695615, area: 'Kerala', days: '3-5' },

    // Karnataka — Nearby state (3-5 days)
    { start: 560001, end: 591346, area: 'Karnataka', days: '3-5' },

    // Andhra Pradesh / Telangana (3-5 days)
    { start: 500001, end: 535594, area: 'Andhra Pradesh / Telangana', days: '3-5' },
  ];

  const STORAGE_KEY = 'diya_last_pincode';

  /**
   * Check if a pincode is serviceable
   * @param {string} pincode - 6-digit Indian pincode
   * @returns {{ valid: boolean, serviceable: boolean, area: string, estimatedDays: string }}
   */
  function checkPincode(pincode) {
    const pin = String(pincode).trim();

    // Validate format: exactly 6 digits, starts with 1-9
    if (!/^[1-9]\d{5}$/.test(pin)) {
      return { valid: false, serviceable: false, area: '', estimatedDays: '' };
    }

    const num = parseInt(pin, 10);

    // Check against serviceable ranges
    for (const range of SERVICEABLE_RANGES) {
      if (num >= range.start && num <= range.end) {
        // Save to localStorage
        try { localStorage.setItem(STORAGE_KEY, pin); } catch(e) {}
        return {
          valid: true,
          serviceable: true,
          area: range.area,
          estimatedDays: range.days
        };
      }
    }

    // Valid pincode but not serviceable
    return { valid: true, serviceable: false, area: '', estimatedDays: '' };
  }

  /**
   * Get last-used pincode from localStorage
   * @returns {string}
   */
  function getLastPincode() {
    try { return localStorage.getItem(STORAGE_KEY) || ''; } catch(e) { return ''; }
  }

  /**
   * Render pincode checker widget HTML
   * @returns {string}
   */
  function renderWidget() {
    const lastPin = getLastPincode();
    return `
      <div class="pincode-checker" id="pincodeChecker">
        <div class="pincode-label">
          <i class="fa-solid fa-location-dot"></i> Check Delivery Availability
        </div>
        <div class="pincode-input-row">
          <input type="text"
                 class="pincode-input"
                 id="pincodeInput"
                 placeholder="Enter 6-digit pincode"
                 maxlength="6"
                 inputmode="numeric"
                 pattern="[0-9]*"
                 value="${lastPin}"
                 autocomplete="postal-code">
          <span class="pincode-flag">🇮🇳</span>
        </div>
        <div class="pincode-result" id="pincodeResult">
          ${lastPin ? PincodeChecker.getResultHTML(PincodeChecker.checkPincode(lastPin)) : ''}
        </div>
      </div>
    `;
  }

  /**
   * Get result HTML based on check result
   * @param {{ valid: boolean, serviceable: boolean, area: string, estimatedDays: string }} result
   * @returns {string}
   */
  function getResultHTML(result) {
    if (!result.valid) {
      return '<div class="pincode-msg pincode-error"><i class="fa-solid fa-circle-exclamation"></i> Please enter a valid 6-digit pincode</div>';
    }
    if (result.serviceable) {
      return `
        <div class="pincode-msg pincode-success">
          <i class="fa-solid fa-circle-check"></i>
          <div>
            <strong>Delivery Available</strong>
            <span class="pincode-meta">Estimated delivery in <strong>${result.estimatedDays} days</strong> to ${result.area}</span>
          </div>
        </div>`;
    }
    return `
      <div class="pincode-msg pincode-unavailable">
        <i class="fa-solid fa-circle-xmark"></i>
        <div>
          <strong>Delivery Not Available</strong>
          <span class="pincode-meta">We currently don't deliver to this area. <a href="contact.html">Contact us</a> for assistance.</span>
        </div>
      </div>`;
  }

  /**
   * Initialize auto-check behavior on input
   */
  function initAutoCheck() {
    const input = document.getElementById('pincodeInput');
    const resultEl = document.getElementById('pincodeResult');
    if (!input || !resultEl) return;

    let debounceTimer;

    input.addEventListener('input', function(e) {
      // Allow only digits
      this.value = this.value.replace(/\D/g, '').slice(0, 6);

      clearTimeout(debounceTimer);
      const val = this.value;

      if (val.length === 0) {
        resultEl.innerHTML = '';
        return;
      }

      if (val.length < 6) {
        resultEl.innerHTML = '<div class="pincode-msg pincode-typing"><i class="fa-solid fa-keyboard"></i> Enter 6 digits...</div>';
        return;
      }

      // Debounce for instant feel but avoid flickering
      debounceTimer = setTimeout(() => {
        const result = checkPincode(val);
        resultEl.innerHTML = getResultHTML(result);
        // Add animation
        const msg = resultEl.querySelector('.pincode-msg');
        if (msg) {
          msg.style.animation = 'pincodeFadeIn 0.3s ease';
        }
      }, 150);
    });

    // If there's a pre-filled value, trigger check
    if (input.value.length === 6) {
      const result = checkPincode(input.value);
      resultEl.innerHTML = getResultHTML(result);
    }
  }

  return {
    checkPincode,
    getLastPincode,
    renderWidget,
    getResultHTML,
    initAutoCheck
  };
})();
