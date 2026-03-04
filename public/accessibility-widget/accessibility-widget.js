/**
 * =============================================================================
 * ACCESSIBILITY WIDGET JS
 * =============================================================================
 * Complies with Israel's IS 5568 standard and WCAG 2.0 AA
 * Zero dependencies - works on any project
 *
 * Features:
 * 1. Font size control (A-/A+)
 * 2. High contrast mode
 * 3. Grayscale mode
 * 4. Underline links
 * 5. Readable font
 * 6. Letter spacing
 * 7. Increased line height
 * 8. Pause animations
 * 9. Highlight on hover/focus
 * 10. Reset all settings
 * =============================================================================
 */
(function() {
  'use strict';

  // =============================================================================
  // CONFIGURATION
  // =============================================================================
  const CONFIG = {
    storageKey: 'a11y-settings',
    dismissKey: 'a11y-dismissed',
    minFontSize: 70,
    maxFontSize: 150,
    fontSizeStep: 10,
    defaultFontSize: 100
  };

  // =============================================================================
  // STATE
  // =============================================================================
  let state = {
    fontSize: CONFIG.defaultFontSize,
    contrast: false,
    grayscale: false,
    links: false,
    font: false,
    spacing: false,
    lineHeight: false,
    noAnimations: false,
    highlight: false
  };

  // =============================================================================
  // BRAND COLOR DETECTION
  // =============================================================================
  function detectBrandColor() {
    const selectors = [
      'a.bg-blue-600',
      'button.bg-blue-600',
      '.bg-primary',
      '.btn-primary',
      'a[class*="primary"]',
      'button[class*="primary"]',
      'h1', 'h2', 'h3',
      'nav a:first-child',
      '.text-blue-600',
      '.text-primary'
    ];

    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el) {
        const style = getComputedStyle(el);
        let color = style.backgroundColor || style.color;

        if (color && color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
          const rgb = parseColor(color);
          if (rgb && isColorUsable(rgb)) {
            return rgb;
          }
        }
      }
    }

    // Fallback to default blue
    return { r: 37, g: 99, b: 235 };
  }

  function parseColor(color) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3])
      };
    }
    return null;
  }

  function isColorUsable(rgb) {
    const lightness = (rgb.r + rgb.g + rgb.b) / (3 * 255);
    const saturation = Math.max(rgb.r, rgb.g, rgb.b) - Math.min(rgb.r, rgb.g, rgb.b);
    return lightness > 0.2 && lightness < 0.8 && saturation > 20;
  }

  function setBrandColor(rgb) {
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    document.documentElement.style.setProperty('--a11y-brand', `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
    document.documentElement.style.setProperty('--a11y-brand-dark', `hsl(${hsl.h}, ${hsl.s}%, ${Math.max(0, hsl.l - 10)}%)`);
    document.documentElement.style.setProperty('--a11y-brand-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  // =============================================================================
  // DOM CREATION
  // =============================================================================
  function createWidget() {
    // Detect and set brand color
    const brandColor = detectBrandColor();
    setBrandColor(brandColor);

    // Create live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.id = 'a11y-live';
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    document.body.appendChild(liveRegion);

    // Create trigger button
    const trigger = document.createElement('button');
    trigger.id = 'a11y-trigger';
    trigger.setAttribute('aria-label', 'הגדרות נגישות');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', 'a11y-panel');
    trigger.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="8" r="2" fill="currentColor"/>
        <path d="M12 10v4M9 18l3-4 3 4M7 14h10" stroke-linecap="round"/>
      </svg>
    `;

    // Create panel
    const panel = document.createElement('div');
    panel.id = 'a11y-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'a11y-panel-title');
    panel.innerHTML = `
      <!-- Panel Header -->
      <div id="a11y-panel-header">
        <h2 id="a11y-panel-title">כלי נגישות / Accessibility</h2>
        <button id="a11y-close" aria-label="Close accessibility panel">&times;</button>
      </div>

      <!-- Panel Content -->
      <div id="a11y-panel-content">
        <!-- Feature 1: Font Size Control -->
        <div class="a11y-feature">
          <div class="a11y-font-control">
            <button id="a11y-font-decrease" class="a11y-font-btn" aria-label="Decrease font size">A-</button>
            <span class="a11y-font-value" id="a11y-font-value" aria-live="polite">100%</span>
            <button id="a11y-font-increase" class="a11y-font-btn" aria-label="Increase font size">A+</button>
          </div>
        </div>

        <!-- Feature 2: High Contrast -->
        <div class="a11y-feature">
          <label class="a11y-feature-label">
            <span>High Contrast</span>
            <div class="a11y-toggle">
              <input type="checkbox" id="a11y-toggle-contrast" aria-label="Toggle high contrast mode">
              <span class="a11y-toggle-slider"></span>
            </div>
          </label>
        </div>

        <!-- Feature 3: Grayscale -->
        <div class="a11y-feature">
          <label class="a11y-feature-label">
            <span>Grayscale</span>
            <div class="a11y-toggle">
              <input type="checkbox" id="a11y-toggle-grayscale" aria-label="Toggle grayscale mode">
              <span class="a11y-toggle-slider"></span>
            </div>
          </label>
        </div>

        <!-- Feature 4: Underline Links -->
        <div class="a11y-feature">
          <label class="a11y-feature-label">
            <span>Underline Links</span>
            <div class="a11y-toggle">
              <input type="checkbox" id="a11y-toggle-links" aria-label="Toggle underline links">
              <span class="a11y-toggle-slider"></span>
            </div>
          </label>
        </div>

        <!-- Feature 5: Readable Font -->
        <div class="a11y-feature">
          <label class="a11y-feature-label">
            <span>Readable Font</span>
            <div class="a11y-toggle">
              <input type="checkbox" id="a11y-toggle-font" aria-label="Toggle readable font">
              <span class="a11y-toggle-slider"></span>
            </div>
          </label>
        </div>

        <!-- Feature 6: Letter Spacing -->
        <div class="a11y-feature">
          <label class="a11y-feature-label">
            <span>Letter Spacing</span>
            <div class="a11y-toggle">
              <input type="checkbox" id="a11y-toggle-spacing" aria-label="Toggle letter spacing">
              <span class="a11y-toggle-slider"></span>
            </div>
          </label>
        </div>

        <!-- Feature 7: Increased Line Height -->
        <div class="a11y-feature">
          <label class="a11y-feature-label">
            <span>Increased Line Height</span>
            <div class="a11y-toggle">
              <input type="checkbox" id="a11y-toggle-lineheight" aria-label="Toggle increased line height">
              <span class="a11y-toggle-slider"></span>
            </div>
          </label>
        </div>

        <!-- Feature 8: Pause Animations -->
        <div class="a11y-feature">
          <label class="a11y-feature-label">
            <span>Pause Animations</span>
            <div class="a11y-toggle">
              <input type="checkbox" id="a11y-toggle-noanim" aria-label="Toggle pause animations">
              <span class="a11y-toggle-slider"></span>
            </div>
          </label>
        </div>

        <!-- Feature 9: Highlight on Hover/Focus -->
        <div class="a11y-feature">
          <label class="a11y-feature-label">
            <span>Highlight on Hover/Focus</span>
            <div class="a11y-toggle">
              <input type="checkbox" id="a11y-toggle-highlight" aria-label="Toggle highlight on hover and focus">
              <span class="a11y-toggle-slider"></span>
            </div>
          </label>
        </div>

        <!-- Reset Button -->
        <button id="a11y-reset" class="a11y-reset-btn">Reset All Settings</button>
      </div>

      <!-- Panel Footer -->
      <div id="a11y-panel-footer">
        <a href="/accessibility" id="a11y-statement-link">Accessibility Statement</a>
        <button id="a11y-dismiss">Hide widget for this session</button>
      </div>
    `;

    document.body.appendChild(trigger);
    document.body.appendChild(panel);

    // Check if dismissed this session
    if (sessionStorage.getItem(CONFIG.dismissKey)) {
      trigger.style.display = 'none';
    }

    // Setup event listeners
    setupEventListeners(trigger, panel);

    // Apply saved state
    loadState();
    applyState();
  }

  // =============================================================================
  // EVENT LISTENERS
  // =============================================================================
  function setupEventListeners(trigger, panel) {
    // Toggle panel
    trigger.addEventListener('click', () => {
      const isOpen = panel.classList.toggle('open');
      trigger.setAttribute('aria-expanded', isOpen);
      if (isOpen) {
        document.getElementById('a11y-close').focus();
        trapFocus(panel);
      }
    });

    // Close button
    document.getElementById('a11y-close').addEventListener('click', () => {
      panel.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.focus();
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.classList.contains('open')) {
        panel.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    });

    // Font size controls
    document.getElementById('a11y-font-decrease').addEventListener('click', () => {
      if (state.fontSize > CONFIG.minFontSize) {
        state.fontSize -= CONFIG.fontSizeStep;
        applyFontSize();
        saveState();
        announce(`Font size ${state.fontSize}%`);
      }
    });

    document.getElementById('a11y-font-increase').addEventListener('click', () => {
      if (state.fontSize < CONFIG.maxFontSize) {
        state.fontSize += CONFIG.fontSizeStep;
        applyFontSize();
        saveState();
        announce(`Font size ${state.fontSize}%`);
      }
    });

    // Toggle switches
    const toggles = [
      { id: 'a11y-toggle-contrast', key: 'contrast', class: 'a11y-contrast', label: 'High contrast' },
      { id: 'a11y-toggle-grayscale', key: 'grayscale', class: 'a11y-gray', target: 'html', label: 'Grayscale' },
      { id: 'a11y-toggle-links', key: 'links', class: 'a11y-links', label: 'Underline links' },
      { id: 'a11y-toggle-font', key: 'font', class: 'a11y-font', label: 'Readable font' },
      { id: 'a11y-toggle-spacing', key: 'spacing', class: 'a11y-spacing', label: 'Letter spacing' },
      { id: 'a11y-toggle-lineheight', key: 'lineHeight', class: 'a11y-lh', label: 'Increased line height' },
      { id: 'a11y-toggle-noanim', key: 'noAnimations', class: 'a11y-noanim', label: 'Animations paused' },
      { id: 'a11y-toggle-highlight', key: 'highlight', class: 'a11y-highlight', label: 'Highlight on hover' }
    ];

    toggles.forEach(toggle => {
      const el = document.getElementById(toggle.id);
      el.addEventListener('change', () => {
        state[toggle.key] = el.checked;
        const target = toggle.target === 'html' ? document.documentElement : document.body;
        target.classList.toggle(toggle.class, el.checked);
        saveState();
        announce(`${toggle.label} ${el.checked ? 'enabled' : 'disabled'}`);
      });
    });

    // Reset button
    document.getElementById('a11y-reset').addEventListener('click', () => {
      resetAll();
      announce('All accessibility settings reset');
    });

    // Dismiss button
    document.getElementById('a11y-dismiss').addEventListener('click', () => {
      sessionStorage.setItem(CONFIG.dismissKey, 'true');
      trigger.style.display = 'none';
      panel.classList.remove('open');
      announce('Accessibility widget hidden for this session');
    });

    // Update button states
    updateFontButtons();
  }

  // =============================================================================
  // FOCUS TRAP
  // =============================================================================
  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      }
    });
  }

  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================
  function loadState() {
    try {
      const saved = localStorage.getItem(CONFIG.storageKey);
      if (saved) {
        state = { ...state, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load accessibility settings:', e);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save accessibility settings:', e);
    }
  }

  function applyState() {
    // Apply font size
    applyFontSize();

    // Apply toggle states
    const toggleMap = [
      { id: 'a11y-toggle-contrast', key: 'contrast', class: 'a11y-contrast' },
      { id: 'a11y-toggle-grayscale', key: 'grayscale', class: 'a11y-gray', target: 'html' },
      { id: 'a11y-toggle-links', key: 'links', class: 'a11y-links' },
      { id: 'a11y-toggle-font', key: 'font', class: 'a11y-font' },
      { id: 'a11y-toggle-spacing', key: 'spacing', class: 'a11y-spacing' },
      { id: 'a11y-toggle-lineheight', key: 'lineHeight', class: 'a11y-lh' },
      { id: 'a11y-toggle-noanim', key: 'noAnimations', class: 'a11y-noanim' },
      { id: 'a11y-toggle-highlight', key: 'highlight', class: 'a11y-highlight' }
    ];

    toggleMap.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) {
        el.checked = state[item.key];
        const target = item.target === 'html' ? document.documentElement : document.body;
        target.classList.toggle(item.class, state[item.key]);
      }
    });
  }

  function applyFontSize() {
    document.documentElement.style.setProperty('--base-font-size', `${state.fontSize}%`);
    document.documentElement.style.fontSize = `${state.fontSize}%`;
    document.getElementById('a11y-font-value').textContent = `${state.fontSize}%`;
    updateFontButtons();
  }

  function updateFontButtons() {
    const decreaseBtn = document.getElementById('a11y-font-decrease');
    const increaseBtn = document.getElementById('a11y-font-increase');
    if (decreaseBtn) decreaseBtn.disabled = state.fontSize <= CONFIG.minFontSize;
    if (increaseBtn) increaseBtn.disabled = state.fontSize >= CONFIG.maxFontSize;
  }

  function resetAll() {
    state = {
      fontSize: CONFIG.defaultFontSize,
      contrast: false,
      grayscale: false,
      links: false,
      font: false,
      spacing: false,
      lineHeight: false,
      noAnimations: false,
      highlight: false
    };

    // Remove all classes
    document.body.classList.remove('a11y-contrast', 'a11y-links', 'a11y-font', 'a11y-spacing', 'a11y-lh', 'a11y-highlight');
    document.documentElement.classList.remove('a11y-gray');
    document.documentElement.style.fontSize = '';

    // Update UI
    applyState();
    saveState();
  }

  // =============================================================================
  // ANNOUNCEMENTS
  // =============================================================================
  function announce(message) {
    const liveRegion = document.getElementById('a11y-live');
    if (liveRegion) {
      liveRegion.textContent = '';
      setTimeout(() => {
        liveRegion.textContent = message;
      }, 100);
    }
  }

  // =============================================================================
  // INITIALIZE
  // =============================================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();
