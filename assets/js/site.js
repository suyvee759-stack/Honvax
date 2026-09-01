(() => {
  "use strict";

  const body = document.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const transitionLayer = document.createElement("div");
  transitionLayer.className = "page-transition";
  transitionLayer.setAttribute("aria-hidden", "true");
  body.prepend(transitionLayer);
  body.classList.add("page-arriving");

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      body.classList.add("is-ready");
      window.setTimeout(() => body.classList.remove("page-arriving"), 650);
    });
  });

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-header nav");
  const headerBrand = document.querySelector(".site-header .brand");

  if (headerBrand) {
    headerBrand.textContent = "HONVAX";
    headerBrand.setAttribute("aria-label", "HONVAX home");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.addEventListener("click", (event) => {
      if (!event.target.closest("a")) return;
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  document.querySelectorAll("main > section:not(.network-hero)").forEach((section) => {
    if (!section.hasAttribute("data-reveal")) section.setAttribute("data-reveal", "");
  });

  const revealElements = document.querySelectorAll("[data-reveal]");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );

    revealElements.forEach((element) => observer.observe(element));
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");

    if (
      !link ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const href = link.getAttribute("href");
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      link.hasAttribute("download") ||
      link.target === "_blank"
    ) {
      return;
    }

    const target = new URL(link.href, window.location.href);
    const samePageAnchor =
      target.pathname === window.location.pathname && Boolean(target.hash);

    if (target.origin !== window.location.origin || samePageAnchor || reduceMotion) {
      return;
    }

    event.preventDefault();
    body.classList.add("is-leaving");
    window.setTimeout(() => {
      window.location.href = target.href;
    }, 500);
  });

  const form = document.querySelector(".rfq-form");

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const button = form.querySelector('button[type="submit"]');
      const status = form.querySelector(".form-status");

      if (!button || !status) {
        form.submit();
        return;
      }

      const originalButtonText = button.textContent;
      button.disabled = true;
      button.textContent = "Submitting…";
      status.textContent = "";

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });

        if (!response.ok) throw new Error("Submission failed");

        form.reset();
        status.textContent = "Thank you. Your enquiry has been submitted.";
      } catch (error) {
        status.textContent =
          "The form could not be submitted. Please email info@honvax.com with your documents.";
      } finally {
        button.disabled = false;
        button.textContent = originalButtonText || "Submit RFQ";
      }
    });
  }
})();
