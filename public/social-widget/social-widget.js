/**
 * FLOATING SOCIAL & CONTACT WIDGET BAR
 * A zero-dependency widget that displays social/contact buttons
 *
 * Usage: Add these two lines to your HTML:
 *   <link rel="stylesheet" href="social-widget/social-widget.css">
 *   <script src="social-widget/social-widget.js" defer></script>
 *
 * ============================================
 * CONFIGURATION - EDIT THESE VALUES
 * ============================================
 * Set any value to null to hide that button
 */
const SOCIAL_CONFIG = {
  phone:     '+972500000000',           // Phone number for call button
  whatsapp:  '972500000000',            // WhatsApp number (with country code)
  instagram: null,                      // Instagram handle (without @) - set to null to hide
  facebook:  null,                      // Facebook page name/ID - set to null to hide
  google:    null,                      // Google Place ID from g.page URL - set to null to hide
};

/**
 * ============================================
 * WIDGET IMPLEMENTATION - DO NOT EDIT BELOW
 * ============================================
 * Wrapped in IIFE to avoid polluting global scope
 */
(function() {
  'use strict';

  // ============================================
  // SVG ICON DEFINITIONS
  // ============================================
  const ICONS = {
    // Phone handset icon
    phone: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
    </svg>`,

    // WhatsApp logo (speech bubble with phone)
    whatsapp: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>`,

    // Instagram logo (camera outline)
    instagram: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>`,

    // Facebook logo (f letterform)
    facebook: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>`,

    // Google logo (multicolor G)
    google: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>`
  };

  // ============================================
  // BUTTON CONFIGURATIONS
  // ============================================
  const BUTTON_CONFIGS = [
    // BUTTON 1 - PHONE
    {
      id: 'phone',
      type: 'phone',
      tooltip: 'Call us',
      ariaLabel: 'Call us',
      getHref: (config) => `tel:${config.phone}`,
      condition: (config) => config.phone !== null
    },
    // BUTTON 2 - WHATSAPP
    {
      id: 'whatsapp',
      type: 'whatsapp',
      tooltip: 'WhatsApp',
      ariaLabel: 'Chat on WhatsApp',
      getHref: (config) => `https://wa.me/${config.whatsapp.replace(/\D/g, '')}`,
      target: '_blank',
      condition: (config) => config.whatsapp !== null
    },
    // BUTTON 3 - INSTAGRAM
    {
      id: 'instagram',
      type: 'instagram',
      tooltip: 'Instagram',
      ariaLabel: 'Follow us on Instagram',
      getHref: (config) => `https://instagram.com/${config.instagram}`,
      target: '_blank',
      condition: (config) => config.instagram !== null
    },
    // BUTTON 4 - FACEBOOK
    {
      id: 'facebook',
      type: 'facebook',
      tooltip: 'Facebook',
      ariaLabel: 'Follow us on Facebook',
      getHref: (config) => `https://facebook.com/${config.facebook}`,
      target: '_blank',
      condition: (config) => config.facebook !== null
    },
    // BUTTON 5 - GOOGLE REVIEWS
    {
      id: 'google',
      type: 'google',
      tooltip: 'Google Reviews',
      ariaLabel: 'Review us on Google',
      getHref: (config) => `https://g.page/${config.google}/review`,
      target: '_blank',
      condition: (config) => config.google !== null
    }
  ];

  // ============================================
  // BRAND COLOR DETECTION
  // ============================================
  function detectBrandColor() {
    const candidates = [];

    // Check primary buttons
    const buttons = document.querySelectorAll('button, .btn, .button, [class*="btn-"], [class*="button"]');
    buttons.forEach(btn => {
      const bgColor = window.getComputedStyle(btn).backgroundColor;
      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
        candidates.push(bgColor);
      }
    });

    // Check links
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      const color = window.getComputedStyle(link).color;
      if (color && color !== 'rgba(0, 0, 0, 0)') {
        candidates.push(color);
      }
    });

    // Check headers
    const headers = document.querySelectorAll('h1, h2, h3, .heading, [class*="title"], [class*="header"]');
    headers.forEach(header => {
      const color = window.getComputedStyle(header).color;
      if (color && color !== 'rgba(0, 0, 0, 0)') {
        candidates.push(color);
      }
    });

    // Find most common color (excluding white/black/grays)
    if (candidates.length === 0) return null;

    const colorCounts = {};
    candidates.forEach(color => {
      // Normalize color
      const normalized = normalizeColor(color);
      if (normalized && !isGrayish(normalized)) {
        colorCounts[normalized] = (colorCounts[normalized] || 0) + 1;
      }
    });

    // Get most frequent color
    let maxCount = 0;
    let brandColor = null;
    for (const [color, count] of Object.entries(colorCounts)) {
      if (count > maxCount) {
        maxCount = count;
        brandColor = color;
      }
    }

    return brandColor;
  }

  // Convert rgb/rgba to hex
  function normalizeColor(color) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return null;
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  // Check if color is grayish (low saturation)
  function isGrayish(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max === 0 ? 0 : (max - min) / max;
    return saturation < 0.15 || (r > 200 && g > 200 && b > 200);
  }

  // ============================================
  // CREATE BUTTON ELEMENT
  // ============================================
  function createButton(config, index, brandColor) {
    const btnConfig = BUTTON_CONFIGS.find(b => b.id === config.id);
    if (!btnConfig || !btnConfig.condition(SOCIAL_CONFIG)) return null;

    const button = document.createElement('a');
    button.href = btnConfig.getHref(SOCIAL_CONFIG);
    button.className = `social-widget-btn social-widget-btn--${btnConfig.type}`;
    button.setAttribute('role', 'button');
    button.setAttribute('aria-label', btnConfig.ariaLabel);

    if (btnConfig.target) {
      button.target = btnConfig.target;
      button.rel = 'noopener noreferrer';
    }

    // Add brand accent if detected
    if (brandColor) {
      button.classList.add('has-brand-accent');
      button.style.setProperty('--brand-accent-color', brandColor);
    }

    // Add icon
    button.innerHTML = ICONS[btnConfig.id];

    // Add tooltip
    const tooltip = document.createElement('span');
    tooltip.className = 'social-widget-tooltip';
    tooltip.textContent = btnConfig.tooltip;
    button.appendChild(tooltip);

    // Set animation delay (stagger: 0.1s, 0.2s, 0.3s, etc.)
    button.style.transitionDelay = `${(index + 1) * 0.1}s`;

    // Keyboard support (Enter and Space)
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        button.click();
      }
    });

    return button;
  }

  // ============================================
  // INITIALIZE WIDGET
  // ============================================
  function initWidget() {
    // Check if container already exists
    if (document.querySelector('.social-widget-container')) {
      return;
    }

    // Detect brand color
    const brandColor = detectBrandColor();

    // Create container
    const container = document.createElement('div');
    container.className = 'social-widget-container';
    container.setAttribute('aria-label', 'Social and contact links');

    // Create buttons
    let buttonIndex = 0;
    BUTTON_CONFIGS.forEach((btnConfig) => {
      if (btnConfig.condition(SOCIAL_CONFIG)) {
        const button = createButton(btnConfig, buttonIndex, brandColor);
        if (button) {
          container.appendChild(button);
          buttonIndex++;
        }
      }
    });

    // Don't render if no buttons
    if (container.children.length === 0) {
      return;
    }

    // Add to DOM
    document.body.appendChild(container);

    // Trigger entrance animation after a short delay
    requestAnimationFrame(() => {
      // Small delay to ensure styles are computed
      setTimeout(() => {
        const buttons = container.querySelectorAll('.social-widget-btn');
        buttons.forEach((btn, index) => {
          // Staggered animation using the transition-delay already set
          setTimeout(() => {
            btn.classList.add('animate-in');
          }, index * 100);
        });
      }, 100);
    });
  }

  // ============================================
  // INITIALIZE ON DOM READY
  // ============================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    // DOM already loaded
    initWidget();
  }

})();
