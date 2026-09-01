/* =========================================================================
   Cohen & Co. — scroll-scrub hero + interactions (vanilla JS, no build step)
   ========================================================================= */
(function () {
  "use strict";

  var POSTER = "/cinematic/assets/hero-poster.jpg";
  var VIDEO_SRC = "/cinematic/assets/hero.mp4";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var smallOrTouch =
    window.matchMedia("(max-width: 940px)").matches ||
    window.matchMedia("(pointer: coarse)").matches;
  // file:// blocks fetch of the video, so fall back to the still there too.
  var fileProto = location.protocol === "file:";

  var hero = document.getElementById("hero");
  var stage = hero ? hero.querySelector(".hero__stage") : null;
  var spacer = document.getElementById("heroSpacer");
  var video = document.getElementById("heroVideo");
  var still = document.getElementById("heroStill");
  var caps = hero ? Array.prototype.slice.call(hero.querySelectorAll(".cap")) : [];
  var loader = document.getElementById("loader");
  var loaderPct = document.getElementById("loaderPct");
  var scrollHint = document.getElementById("scrollHint");

  // Poster always available as the fallback layer (absolute path so it resolves
  // whether the page is served at / or at /cinematic/).
  if (still) still.style.backgroundImage = "url('" + POSTER + "')";

  function hideLoader() {
    if (loader) loader.classList.add("is-hidden");
  }

  /* ---------------- Static hero (reduced motion / file://) ---------------- */
  function goStatic() {
    if (hero) hero.classList.add("is-static");
    // On the static hero, only band 0 (title) + settle show; CSS handles it.
    caps.forEach(function (c) { c.classList.add("is-active"); });
    hideLoader();
  }

  /* ---------------- Mobile / touch: autoplay the hero video in a loop ------
     Scroll-scrubbing is unreliable on phones, so instead of a still-only hero
     the video plays as a muted, looping, inline background over the poster.
     Autoplay on Android/iOS is finicky (Data Saver, autoplay policy, load
     timing), and a single rejected play() does NOT mean it can't play — so we
     retry when the browser has enough data and on the first user gesture (a
     tap/scroll lifts the autoplay block) instead of giving up to the still. */
  function goStaticVideo() {
    if (hero) hero.classList.add("is-static", "is-playing");
    caps.forEach(function (c) { c.classList.add("is-active"); });
    if (!video) { hideLoader(); return; }

    var canMp4 = !!video.canPlayType &&
      video.canPlayType('video/mp4; codecs="avc1.42E01E"') !== "";
    video.muted = true;                 // required for inline autoplay on iOS/Android
    video.defaultMuted = true;
    video.loop = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("autoplay", "");
    video.src = canMp4 ? VIDEO_SRC : "/cinematic/assets/hero.webm";

    function reveal() { video.classList.add("is-ready"); }
    video.addEventListener("loadeddata", reveal);
    video.addEventListener("canplay", reveal);
    video.addEventListener("playing", reveal);

    var GESTURES = ["touchstart", "pointerdown", "click", "scroll", "keydown"];
    function tryPlay() {
      var pr = video.play();
      if (pr && pr.catch) pr.catch(function () {}); // blocked → wait for canplay / a gesture
    }
    function stopGestureRetry() {
      GESTURES.forEach(function (ev) { window.removeEventListener(ev, tryPlay); });
    }
    // Once it is genuinely playing, stop listening for gestures.
    video.addEventListener("playing", stopGestureRetry);
    // Retry when there is enough data, and on the first user interaction.
    video.addEventListener("canplay", tryPlay);
    GESTURES.forEach(function (ev) { window.addEventListener(ev, tryPlay, { passive: true }); });

    // A real load/decode failure (not an autoplay block) → fall back to the poster.
    video.addEventListener("error", function () {
      stopGestureRetry();
      if (hero) hero.classList.remove("is-playing");
    });

    tryPlay();          // attempt immediate autoplay where the browser allows it
    hideLoader();
  }

  /* ---------------- Scrub hero (desktop) ---------------------------------- */
  function initScrub() {
    var duration = 0;
    var target = 0;      // desired currentTime
    var shown = 0;       // lerped currentTime actually applied
    var seeking = false;
    var ready = false;
    var lastBand = -1;

    function setBand(p) {
      var b = p < 0.26 ? 0 : p < 0.5 ? 1 : p < 0.72 ? 2 : 3;
      if (b === lastBand) return;
      lastBand = b;
      caps.forEach(function (c) {
        c.classList.toggle("is-active", Number(c.getAttribute("data-band")) === b);
      });
    }

    function progress() {
      var vh = window.innerHeight;
      var top = hero.offsetTop;
      var range = hero.offsetHeight - vh;
      if (range <= 0) return 0;
      var p = (window.scrollY - top) / range;
      return p < 0 ? 0 : p > 1 ? 1 : p;
    }

    function onScroll() {
      var p = progress();
      target = p * duration;
      setBand(p);
      if (scrollHint) scrollHint.classList.toggle("is-hidden", p > 0.02);
    }

    // rAF loop: ease shown -> target, seek only on real change, never overlap.
    function tick() {
      if (ready) {
        var diff = target - shown;
        if (Math.abs(diff) > 0.001) {
          shown += diff * 0.12;
          if (!seeking && Math.abs(video.currentTime - shown) > 0.02) {
            seeking = true;
            try { video.currentTime = shown; } catch (e) {}
          }
        }
      }
      requestAnimationFrame(tick);
    }

    video.addEventListener("seeked", function () { seeking = false; });
    video.addEventListener("loadedmetadata", function () {
      duration = video.duration || 6;
      ready = true;
      video.classList.add("is-ready");
      // Prime the decoder so the first frame paints, then hold on the scrub.
      var pr = video.play();
      if (pr && pr.then) {
        pr.then(function () { video.pause(); try { video.currentTime = target || 0.03; } catch (e) {} })
          .catch(function () { try { video.currentTime = 0.03; } catch (e) {} });
      } else {
        try { video.currentTime = 0.03; } catch (e) {}
      }
      onScroll();
    });
    video.addEventListener("error", goStatic);

    // Pick a source this browser can actually decode (some Chromium builds lack H.264).
    var canMp4 = !!video.canPlayType &&
      video.canPlayType('video/mp4; codecs="avc1.42E01E"') !== "";
    var srcUrl = canMp4 ? VIDEO_SRC : "/cinematic/assets/hero.webm";

    // Stream the video behind the loading ring so the page never blocks.
    var xhr = new XMLHttpRequest();
    xhr.open("GET", srcUrl, true);
    xhr.responseType = "blob";
    xhr.onprogress = function (e) {
      if (e.lengthComputable && loaderPct) {
        loaderPct.textContent = " " + Math.round((e.loaded / e.total) * 100) + "%";
      }
    };
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        video.src = URL.createObjectURL(xhr.response);
        video.load();
        hideLoader();
      } else {
        goStatic();
      }
    };
    xhr.onerror = function () { goStatic(); };
    xhr.send();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll(); // activate the first caption band before the video finishes loading
    requestAnimationFrame(tick);

    // Safety net: if metadata never arrives, show the still.
    setTimeout(function () { if (!ready) goStatic(); }, 12000);
  }

  if (hero) {
    if (reduceMotion || fileProto) {
      goStatic();          // respect reduced motion; file:// can't stream the video
    } else if (smallOrTouch) {
      goStaticVideo();     // phones/touch: autoplay the looping video
    } else {
      initScrub();         // desktop: scroll-scrub the video
    }
  }

  /* ---------------- Nav: scrolled state + mobile menu --------------------- */
  var nav = document.getElementById("nav");
  var burger = document.getElementById("burger");
  function onNavScroll() {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onNavScroll, { passive: true });
  onNavScroll();
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll(".nav__links a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------- Reveal on scroll ------------------------------------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------------- Scroll-driven showcase (image transition + depth) ----
     As the sticky section scrolls, the stacked images cross-fade and zoom
     (scale) into one another, with the caption + dot swapping in step. */
  var showcase = document.getElementById("showcase");
  if (showcase && !reduceMotion) {
    var scTrack = showcase.querySelector(".showcase__track");
    var scLayers = showcase.querySelectorAll(".showcase__layer");
    var scCaps = showcase.querySelectorAll(".showcase__cap");
    var scDots = showcase.querySelectorAll(".showcase__dots span");
    var scN = scLayers.length;
    var scTick = false;
    function scRender() {
      scTick = false;
      var vh = window.innerHeight;
      // Absolute document top of the track (offsetTop is relative to the
      // position:relative .showcase parent, so it can't be used here).
      var top = scTrack.getBoundingClientRect().top + window.scrollY;
      var range = scTrack.offsetHeight - vh;
      var p = range > 0 ? (window.scrollY - top) / range : 0;
      p = p < 0 ? 0 : p > 1 ? 1 : p;
      var local = p * (scN - 1);          // 0 .. scN-1
      var active = Math.round(local);
      for (var i = 0; i < scN; i++) {
        var d = Math.abs(local - i);
        var op = d < 1 ? 1 - d : 0;        // triangular cross-fade, peaks on its shot
        scLayers[i].style.opacity = op.toFixed(3);
        scLayers[i].style.transform = "scale(" + (1.06 - 0.06 * op).toFixed(3) + ")";
        if (scCaps[i]) {
          scCaps[i].style.opacity = op.toFixed(3);
          scCaps[i].style.transform = "translateY(" + (20 * (1 - op)).toFixed(1) + "px)";
          scCaps[i].style.pointerEvents = op > 0.6 ? "auto" : "none"; // only the visible slide is clickable
        }
        if (scDots[i]) scDots[i].classList.toggle("is-on", i === active);
      }
    }
    function scOnScroll() { if (!scTick) { scTick = true; requestAnimationFrame(scRender); } }
    window.addEventListener("scroll", scOnScroll, { passive: true });
    window.addEventListener("resize", scOnScroll, { passive: true });
    scRender();
  }

  /* ---------------- Count-up stats --------------------------------------- */
  var counters = document.querySelectorAll(".trust__num[data-count]");
  function runCount(el) {
    var end = Number(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) { el.textContent = end + suffix; return; }
    var start = null, dur = 1400;
    function step(ts) {
      if (start === null) start = ts;
      var t = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(eased * end) + suffix;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { runCount(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  } else {
    counters.forEach(function (c) {
      c.textContent = c.getAttribute("data-count") + (c.getAttribute("data-suffix") || "");
    });
  }

  /* ---------------- FAQ: single-open accordion --------------------------- */
  var qas = document.querySelectorAll(".qa");
  qas.forEach(function (qa) {
    qa.addEventListener("toggle", function () {
      if (qa.open) {
        qas.forEach(function (o) { if (o !== qa) o.open = false; });
      }
    });
  });

  /* ---------------- Lead form: local success state ----------------------- */
  var form = document.getElementById("leadForm");
  var formOk = document.getElementById("formOk");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("name");
      var phone = document.getElementById("phone");
      if (!name.value.trim() || !phone.value.trim()) {
        (name.value.trim() ? phone : name).focus();
        return;
      }
      form.querySelector("button[type=submit]").disabled = true;
      if (formOk) formOk.hidden = false;
    });
  }

  /* ---------------- Footer year ------------------------------------------ */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();

/* =========================================================================
   iOS-minimal accessibility widget + cookie banner + WhatsApp button.
   Self-contained and injected on every page that loads this script.
   ========================================================================= */
(function () {
  "use strict";
  var WHATSAPP = "972500000000";   // TODO: replace with the firm's real WhatsApp number (digits only, incl. country code)
  var WA_MSG = "היי, הגעתי דרך האתר ואשמח לתאם פגישת ייעוץ.";
  var root = document.documentElement;
  var store; try { store = window.localStorage; } catch (e) { store = null; }
  function get(k, d) { try { var v = store && store.getItem(k); return v == null ? d : v; } catch (e) { return d; } }
  function set(k, v) { try { store && store.setItem(k, v); } catch (e) {} }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  /* ---- Accessibility preferences ---- */
  var A11Y_KEY = "a11yPrefs";
  var prefs = { zoom: 0, contrast: false, links: false, readable: false, nomotion: false, cursor: false };
  try { var saved = JSON.parse(get(A11Y_KEY, "null")); if (saved && typeof saved === "object") { for (var p in prefs) if (p in saved) prefs[p] = saved[p]; } } catch (e) {}

  function applyPrefs() {
    root.classList.toggle("a11y-zoom-1", prefs.zoom === 1);
    root.classList.toggle("a11y-zoom-2", prefs.zoom === 2);
    root.classList.toggle("a11y-contrast", !!prefs.contrast);
    root.classList.toggle("a11y-links", !!prefs.links);
    root.classList.toggle("a11y-readable", !!prefs.readable);
    root.classList.toggle("a11y-nomotion", !!prefs.nomotion);
    root.classList.toggle("a11y-cursor", !!prefs.cursor);
  }
  applyPrefs();

  function row(key, label) {
    return '<div class="a11y__row"><span>' + label + '</span>' +
      '<label class="sw"><input type="checkbox" data-k="' + key + '"><i></i></label></div>';
  }

  var ICON_A11Y = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="4.2" r="2.1" fill="currentColor"/><path d="M4.5 8.2c2.4.9 4.9 1.3 7.5 1.3s5.1-.4 7.5-1.3M12 9.6v5.2m0 0l-2.7 5.4M12 14.8l2.7 5.4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ICON_WA = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.52 15.24L2 22l4.9-1.46A10 10 0 1 0 12 2Zm5.27 14.13c-.22.62-1.28 1.19-1.77 1.22-.48.05-.96.24-3.23-.67-2.73-1.08-4.45-3.8-4.58-3.98-.13-.18-1.1-1.46-1.1-2.79 0-1.33.7-1.98.95-2.25.24-.27.53-.34.7-.34l.5.01c.16 0 .38-.06.59.45.22.53.73 1.83.8 1.96.06.13.1.29.02.46-.08.18-.12.29-.24.44l-.36.42c-.12.12-.24.25-.1.49.13.24.6 1 1.29 1.62.88.79 1.63 1.03 1.86 1.15.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.53-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.11.06.62-.16 1.24Z"/></svg>';

  /* ---- WhatsApp button ---- */
  var wa = el("a", "fab fab--wa", ICON_WA);
  wa.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(WA_MSG);
  wa.target = "_blank"; wa.rel = "noopener";
  wa.setAttribute("aria-label", "צ׳אט בוואטסאפ");
  document.body.appendChild(wa);

  /* ---- Accessibility button + panel ---- */
  var btn = el("button", "fab fab--a11y", ICON_A11Y);
  btn.type = "button";
  btn.setAttribute("aria-label", "אפשרויות נגישות");
  btn.setAttribute("aria-expanded", "false");
  document.body.appendChild(btn);

  var panel = el("div", "a11y",
    '<div class="a11y__head"><span class="a11y__title">נגישות</span>' +
    '<button class="a11y__x" type="button" aria-label="סגירה">✕</button></div>' +
    '<div class="a11y__row"><span>גודל טקסט</span>' +
      '<span class="a11y__seg" data-seg="zoom">' +
        '<button type="button" data-v="0">A</button>' +
        '<button type="button" data-v="1">A+</button>' +
        '<button type="button" data-v="2">A++</button></span></div>' +
    row("contrast", "ניגודיות גבוהה") +
    row("links", "הדגשת קישורים") +
    row("readable", "גופן קריא") +
    row("nomotion", "עצירת אנימציות") +
    row("cursor", "סמן גדול") +
    '<div class="a11y__foot"><button class="a11y__reset" type="button">איפוס</button>' +
    '<a class="a11y__link" href="/cinematic/accessibility.html">הצהרת נגישות מלאה</a></div>');
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "אפשרויות נגישות");
  document.body.appendChild(panel);

  function syncUI() {
    var segs = panel.querySelectorAll('[data-seg="zoom"] button');
    for (var i = 0; i < segs.length; i++) segs[i].classList.toggle("is-on", Number(segs[i].getAttribute("data-v")) === prefs.zoom);
    var checks = panel.querySelectorAll("input[data-k]");
    for (var j = 0; j < checks.length; j++) checks[j].checked = !!prefs[checks[j].getAttribute("data-k")];
  }
  function savePrefs() { set(A11Y_KEY, JSON.stringify(prefs)); applyPrefs(); syncUI(); }
  syncUI();

  function openPanel(o) { panel.classList.toggle("is-open", o); btn.setAttribute("aria-expanded", o ? "true" : "false"); }
  btn.addEventListener("click", function () { openPanel(!panel.classList.contains("is-open")); });
  panel.querySelector(".a11y__x").addEventListener("click", function () { openPanel(false); });
  document.addEventListener("click", function (e) {
    if (panel.classList.contains("is-open") && !panel.contains(e.target) && e.target !== btn && !btn.contains(e.target)) openPanel(false);
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") openPanel(false); });
  panel.addEventListener("click", function (e) {
    var seg = e.target.closest && e.target.closest('[data-seg="zoom"] button');
    if (seg) { prefs.zoom = Number(seg.getAttribute("data-v")); savePrefs(); }
  });
  panel.addEventListener("change", function (e) {
    var k = e.target.getAttribute && e.target.getAttribute("data-k");
    if (k) { prefs[k] = !!e.target.checked; savePrefs(); }
  });
  panel.querySelector(".a11y__reset").addEventListener("click", function () {
    prefs = { zoom: 0, contrast: false, links: false, readable: false, nomotion: false, cursor: false };
    savePrefs();
  });

  /* ---- Cookie banner ---- */
  if (get("cookieConsent", "") === "") {
    document.body.classList.add("has-cookie");
    var ck = el("div", "cookie",
      '<p class="cookie__txt">אנחנו משתמשים בעוגיות כדי לשפר את חוויית הגלישה ולנתח שימוש. ' +
      '<a href="/cinematic/privacy.html">מדיניות הפרטיות</a>.</p>' +
      '<div class="cookie__btns">' +
      '<button class="cookie__btn cookie__btn--no" type="button">דחייה</button>' +
      '<button class="cookie__btn cookie__btn--ok" type="button">אישור</button></div>');
    ck.setAttribute("role", "dialog");
    ck.setAttribute("aria-label", "הודעת עוגיות");
    document.body.appendChild(ck);
    var decide = function (v) { set("cookieConsent", v); if (ck.parentNode) ck.parentNode.removeChild(ck); document.body.classList.remove("has-cookie"); };
    ck.querySelector(".cookie__btn--ok").addEventListener("click", function () { decide("accepted"); });
    ck.querySelector(".cookie__btn--no").addEventListener("click", function () { decide("rejected"); });
  }
})();
