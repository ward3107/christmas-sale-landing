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
