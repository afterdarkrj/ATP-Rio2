/* ATP-Rio2 — interações da landing page */
(function () {
  "use strict";

  /* ---- Navbar: sombra ao rolar ---- */
  var navbar = document.getElementById("navbar");
  function onScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 30);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Menu mobile ---- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  navToggle.addEventListener("click", function () {
    var open = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });
  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
    });
  });

  /* ---- Reveal on scroll ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = entry.target.getAttribute("data-delay") || 0;
          setTimeout(function () {
            entry.target.classList.add("visible");
          }, Number(delay));
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---- Contadores animados ---- */
  function animateCount(el) {
    var target = Number(el.getAttribute("data-count")) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1500;
    var start = performance.now();
    function tick(now) {
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("pt-BR") + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var counters = document.querySelectorAll(".stat-num");
  if ("IntersectionObserver" in window) {
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          cObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cObs.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---- Formulário de cadastro (demo) ---- */
  var form = document.getElementById("ctaForm");
  var note = document.getElementById("ctaNote");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name  = document.getElementById("ctaName").value.trim();
    var condo = document.getElementById("ctaCondo").value.trim();
    var apto  = document.getElementById("ctaApto").value.trim();
    var email = document.getElementById("ctaEmail").value.trim();
    var wpp   = document.getElementById("ctaWpp").value.trim();

    if (!name || !condo || !apto || !email || !wpp) {
      note.textContent = "Preencha todos os campos para continuar.";
      note.className = "cta-note err";
      return;
    }
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      note.textContent = "Informe um e-mail válido.";
      note.className = "cta-note err";
      return;
    }
    var wppOk = /^\(?\d{2}\)?[\s-]?9?\d{4}[\s-]?\d{4}$/.test(wpp.replace(/\s/g, ""));
    if (!wppOk) {
      note.textContent = "Informe um WhatsApp válido com DDD (ex: 21 99999-9999).";
      note.className = "cta-note err";
      return;
    }
    note.textContent = "Tudo certo, " + name.split(" ")[0] + "! Seu perfil foi criado. Bem-vindo(a) ao ATP-Rio2 🎾";
    note.className = "cta-note ok";
    form.reset();
  });
})();
