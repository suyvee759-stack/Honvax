(() => {
  "use strict";

  const body = document.body;

  /*
   * Create the page-transition layer automatically.
   * This avoids adding the element manually to every HTML page.
   */

  const transitionLayer = document.createElement("div");
  transitionLayer.className = "page-transition";
  transitionLayer.setAttribute("aria-hidden", "true");

  body.prepend(transitionLayer);
  body.classList.add("page-arriving");

  /*
   * Start entrance animation after the first page frame.
   */

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      body.classList.add("is-ready");

      window.setTimeout(() => {
        body.classList.remove("page-arriving");
      }, 650);
    });
  });

  /*
   * Mobile navigation.
   */

  const navigationToggle =
    document.querySelector(".nav-toggle");

  const navigation =
    document.querySelector(".site-header nav");

  if (navigationToggle && navigation) {
    navigationToggle.addEventListener("click", () => {
      const isOpen =
        navigation.classList.toggle("open");

      navigationToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    });
  }

  /*
   * Current year.
   */

  const year =
    document.getElementById("year");

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }

  /*
   * Reveal sections when they enter the viewport.
   */

  const revealElements =
    document.querySelectorAll("[data-reveal]");

  const reduceMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  if (reduceMotion) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  } else {
    const revealObserver =
      new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add(
              "is-visible"
            );

            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -50px 0px"
        }
      );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  /*
   * Smooth transition between local HONVAX pages.
   */

  document.addEventListener("click", (event) => {
    const link =
      event.target.closest("a");

    if (!link) {
      return;
    }

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const href =
      link.getAttribute("href");

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

    const targetURL =
      new URL(link.href, window.location.href);

    if (
      targetURL.origin !==
      window.location.origin
    ) {
      return;
    }

    if (
      targetURL.pathname ===
        window.location.pathname &&
      targetURL.hash
    ) {
      return;
    }

    if (reduceMotion) {
      return;
    }

    event.preventDefault();

    body.classList.add("is-leaving");

    window.setTimeout(() => {
      window.location.href =
        targetURL.href;
    }, 500);
  });

  /*
   * RFQ form submission.
   */

  const form =
    document.querySelector(".rfq-form");

  if (form) {
    form.addEventListener(
      "submit",
      async (event) => {
        event.preventDefault();

        const button =
          form.querySelector(
            'button[type="submit"]'
          );

        const status =
          form.querySelector(
            ".form-status"
          );

        if (!button || !status) {
          form.submit();
          return;
        }

        button.disabled = true;
        button.textContent =
          "Submitting…";

        status.textContent = "";

        try {
          const response =
            await fetch(
              form.action,
              {
                method: "POST",
                body: new FormData(form),
                headers: {
                  Accept: "application/json"
                }
              }
            );

          if (!response.ok) {
            throw new Error(
              "Submission failed"
            );
          }

          form.reset();

          status.textContent =
            "Thank you. Your enquiry has been submitted.";
        } catch (error) {
          status.textContent =
            "The form could not be submitted. Please email info@honvax.com with your documents.";
        } finally {
          button.disabled = false;
          button.textContent =
            "Submit RFQ";
        }
      }
    );
  }
})();
