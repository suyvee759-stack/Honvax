(() => {
  "use strict";

  const body = document.body;
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-header nav");
  const headerBrand = document.querySelector(".site-header .brand");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (headerBrand) {
    headerBrand.textContent = "HONVAX";
    headerBrand.setAttribute("aria-label", "HONVAX home");
  }

  requestAnimationFrame(() => body.classList.add("is-ready"));

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      body.classList.toggle("mobile-nav-open", open);
    });

    nav.addEventListener("click", (event) => {
      if (!event.target.closest("a")) return;
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      body.classList.remove("mobile-nav-open");
    });
  }

  const previewContent = {
    "industries.html": {
      eyebrow: "CORE INDUSTRIES",
      title: "Engineering and industrial supply",
      text: "Focused supply categories where China has mature manufacturing capability and importing can make technical and commercial sense.",
      links: [
        ["Power & Energy", "Grid, electrical and renewable-energy supply", "power-energy.html"],
        ["Water & Municipal", "Pipes, valves, meters, pumps and network equipment", "water-municipal.html"],
        ["Mining & Industrial", "Wear parts, screening products and industrial components", "mining-industrial.html"],
        ["Infrastructure & Construction", "Steel, pipework, fasteners and fabricated items", "infrastructure-construction.html"]
      ]
    },
    "services.html": {
      eyebrow: "OUR SERVICES",
      title: "Support built around the RFQ",
      text: "HONVAX can support the sourcing process from the initial requirement review through supplier development, quality control and delivery coordination.",
      links: [
        ["Requirement Review", "RFQs, BOQs, drawings and specifications", "requirement-review.html"],
        ["China Supplier Sourcing", "RFQ-specific manufacturer identification", "china-supplier-sourcing.html"],
        ["Technical & Commercial Comparison", "Compliance, lead time, terms and landed cost", "technical-commercial-comparison.html"],
        ["Supply Execution", "Quality, documentation, export and delivery", "supply-execution.html"]
      ]
    },
    "products-equipment.html": {
      eyebrow: "PRODUCTS & EQUIPMENT",
      title: "Real supply categories",
      text: "Explore selected equipment and engineering supply areas, then send the exact requirement for availability and technical confirmation.",
      links: [
        ["Used Equipment", "Available excavators and changing SANY inventory", "used-equipment.html"],
        ["Infrastructure Supplies", "Water, steel, pipework, valves and project materials", "infrastructure-supplies.html"],
        ["Power & Generators", "Grid products and project backup-power packages", "generators.html"],
        ["Product Catalogue", "Selected equipment, parts and engineering products", "product-catalogue.html"]
      ]
    }
  };

  if (header && nav) {
    const preview = document.createElement("div");
    preview.className = "nav-preview";
    preview.setAttribute("aria-hidden", "true");
    preview.innerHTML = '<div class="wrap nav-preview-inner"></div>';
    header.append(preview);

    const previewInner = preview.querySelector(".nav-preview-inner");
    let closeTimer;

    const closePreview = () => {
      window.clearTimeout(closeTimer);
      header.classList.remove("preview-open");
      preview.setAttribute("aria-hidden", "true");
      nav.querySelectorAll("a.preview-active").forEach((link) => link.classList.remove("preview-active"));
    };

    const openPreview = (link, data) => {
      if (window.matchMedia("(max-width: 780px)").matches) return;
      window.clearTimeout(closeTimer);
      nav.querySelectorAll("a.preview-active").forEach((item) => item.classList.remove("preview-active"));
      link.classList.add("preview-active");
      previewInner.innerHTML = `
        <div class="nav-preview-intro">
          <p>${data.eyebrow}</p>
          <h2>${data.title}</h2>
          <span>${data.text}</span>
        </div>
        <div class="nav-preview-links">
          ${data.links.map(([title, text, href], index) => `
            <a href="${href}">
              <small>0${index + 1}</small>
              <strong>${title}</strong>
              <span>${text}</span>
              <b aria-hidden="true">→</b>
            </a>
          `).join("")}
        </div>`;
      preview.setAttribute("aria-hidden", "false");
      header.classList.add("preview-open");
    };

    nav.querySelectorAll("a[href]").forEach((link) => {
      const href = link.getAttribute("href").split("#")[0].split("/").pop();
      const data = previewContent[href];
      if (!data) return;
      link.classList.add("has-preview");
      link.addEventListener("mouseenter", () => openPreview(link, data));
      link.addEventListener("focus", () => openPreview(link, data));
    });

    header.addEventListener("mouseleave", () => {
      closeTimer = window.setTimeout(closePreview, 120);
    });
    header.addEventListener("mouseenter", () => window.clearTimeout(closeTimer));

    nav.querySelectorAll("a:not(.has-preview)").forEach((link) => {
      link.addEventListener("mouseenter", closePreview);
      link.addEventListener("focus", closePreview);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closePreview();
    });

    window.addEventListener("resize", () => {
      if (window.matchMedia("(max-width: 780px)").matches) closePreview();
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
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach((element) => observer.observe(element));
  }

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
        status.textContent = "The form could not be submitted. Please email info@honvax.com with your documents.";
      } finally {
        button.disabled = false;
        button.textContent = originalButtonText || "Submit RFQ";
      }
    });
  }
})();
