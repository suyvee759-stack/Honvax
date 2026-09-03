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
        ["Pumps & Water Equipment", "Split-case, vertical-turbine, slurry and dewatering pumps", "pumps-water-equipment.html"],
        ["Industrial Generators", "Generator sets and project control packages", "generators.html"],
        ["Pipes, Valves & Project Materials", "Pipework, valves and fabricated materials", "infrastructure-supplies.html"],
        ["Wear Parts & Components", "Screening media, machine parts and attachments", "product-catalogue.html#wear-parts"],
        ["Grid & Cable Accessories", "Line hardware, insulators and terminations", "product-catalogue.html#power-accessories"]
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

  const routeName = window.location.pathname.replace(/\/$/, "").split("/").pop() || "index.html";
  const currentPage = routeName.includes(".") ? routeName : `${routeName}.html`;
  const pageContext = {
    "industries.html": { section: "Industries", parent: "industries.html", links: [["Services", "services.html"], ["Products & Equipment", "products-equipment.html"], ["Send Your RFQ", "send-your-rfq.html"]] },
    "power-energy.html": { section: "Power & Energy", parent: "industries.html", parentLabel: "Industries", links: [["Related products", "generators.html"], ["How we work", "services.html#how-we-work"], ["Send Your RFQ", "send-your-rfq.html"]] },
    "water-municipal.html": { section: "Water & Municipal", parent: "industries.html", parentLabel: "Industries", links: [["Related products", "infrastructure-supplies.html"], ["How we work", "services.html#how-we-work"], ["Send Your RFQ", "send-your-rfq.html"]] },
    "mining-industrial.html": { section: "Mining & Industrial", parent: "industries.html", parentLabel: "Industries", links: [["Used equipment", "used-equipment.html"], ["Product catalogue", "product-catalogue.html"], ["Send Your RFQ", "send-your-rfq.html"]] },
    "infrastructure-construction.html": { section: "Infrastructure & Construction", parent: "industries.html", parentLabel: "Industries", links: [["Infrastructure supplies", "infrastructure-supplies.html"], ["Product catalogue", "product-catalogue.html"], ["Send Your RFQ", "send-your-rfq.html"]] },
    "services.html": { section: "Services & Process", parent: "services.html", links: [["Industries", "industries.html"], ["Products & Equipment", "products-equipment.html"], ["Send Your RFQ", "send-your-rfq.html"]] },
    "requirement-review.html": { section: "Requirement Review", parent: "services.html", parentLabel: "Services", links: [["Supplier sourcing", "china-supplier-sourcing.html"], ["Complete process", "services.html#how-we-work"], ["Send Your RFQ", "send-your-rfq.html"]] },
    "china-supplier-sourcing.html": { section: "China Supplier Sourcing", parent: "services.html", parentLabel: "Services", links: [["Requirement review", "requirement-review.html"], ["Comparison", "technical-commercial-comparison.html"], ["Send Your RFQ", "send-your-rfq.html"]] },
    "technical-commercial-comparison.html": { section: "Technical & Commercial Comparison", parent: "services.html", parentLabel: "Services", links: [["Supplier sourcing", "china-supplier-sourcing.html"], ["Supply execution", "supply-execution.html"], ["Send Your RFQ", "send-your-rfq.html"]] },
    "supply-execution.html": { section: "Supply Execution", parent: "services.html", parentLabel: "Services", links: [["Complete process", "services.html#how-we-work"], ["Products & Equipment", "products-equipment.html"], ["Send Your RFQ", "send-your-rfq.html"]] },
    "products-equipment.html": { section: "Products & Equipment", parent: "products-equipment.html", links: [["Used equipment", "used-equipment.html"], ["Product catalogue", "product-catalogue.html"], ["Send Your RFQ", "send-your-rfq.html"]] },
    "used-equipment.html": { section: "Used Equipment", parent: "products-equipment.html", parentLabel: "Products & Equipment", links: [["Mining & Industrial", "mining-industrial.html"], ["All products", "products-equipment.html"], ["Send Your RFQ", "send-your-rfq.html?subject=Used%20equipment%20request"]] },
    "infrastructure-supplies.html": { section: "Infrastructure Supplies", parent: "products-equipment.html", parentLabel: "Products & Equipment", links: [["Infrastructure industry", "infrastructure-construction.html"], ["Water industry", "water-municipal.html"], ["Send Your RFQ", "send-your-rfq.html"]] },
    "generators.html": { section: "Power & Generators", parent: "products-equipment.html", parentLabel: "Products & Equipment", links: [["Power & Energy", "power-energy.html"], ["All products", "products-equipment.html"], ["Send Your RFQ", "send-your-rfq.html"]] },
    "product-catalogue.html": { section: "Parts & Accessories", parent: "products-equipment.html", parentLabel: "Products & Equipment", links: [["All products", "products-equipment.html"], ["Send Your RFQ", "send-your-rfq.html"]] },
    "pumps-water-equipment.html": { section: "Pumps & Water Equipment", parent: "products-equipment.html", parentLabel: "Products & Equipment", links: [["Water & Municipal", "water-municipal.html"], ["Send Your RFQ", "send-your-rfq.html?subject=Pump%20enquiry"]] },
    "about.html": { section: "About HONVAX", parent: "about.html", links: [["Industries", "industries.html"], ["How we work", "services.html#how-we-work"], ["Send Your RFQ", "send-your-rfq.html"]] },
    "send-your-rfq.html": { section: "Send Your RFQ", parent: "send-your-rfq.html", links: [["What we support", "industries.html"], ["Products & Equipment", "products-equipment.html"], ["How we work", "services.html#how-we-work"]] }
  };

  const activeParent = pageContext[currentPage]?.parent || currentPage;
  document.querySelectorAll(".site-header nav a[href]").forEach((link) => {
    const href = link.getAttribute("href").split("#")[0].split("?")[0].split("/").pop();
    const active = href === activeParent;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  const contextData = pageContext[currentPage];
  if (header && contextData && currentPage !== "send-your-rfq.html" && !document.querySelector(".page-context")) {
    const context = document.createElement("div");
    context.className = "page-context";
    const parentCrumb = contextData.parentLabel
      ? `<a href="${contextData.parent}">${contextData.parentLabel}</a><span aria-hidden="true">/</span>`
      : "";
    context.innerHTML = `
      <div class="wrap page-context-inner">
        <nav class="page-breadcrumb" aria-label="Breadcrumb">
          <a href="index.html">Home</a><span aria-hidden="true">/</span>${parentCrumb}<strong>${contextData.section}</strong>
        </nav>
        <nav class="page-context-links" aria-label="Related pages">
          ${contextData.links.map(([label, href]) => `<a href="${href}">${label}<span aria-hidden="true">→</span></a>`).join("")}
        </nav>
      </div>`;
    header.insertAdjacentElement("afterend", context);
  }

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
    const parameters = new URLSearchParams(window.location.search);
    const requirement = form.elements.namedItem("requirement");
    const sourcePage = form.elements.namedItem("source_page");
    if (requirement && parameters.has("subject") && !requirement.value) {
      requirement.value = parameters.get("subject").slice(0, 500);
    }
    if (sourcePage) {
      try {
        const referringPage = new URL(document.referrer);
        if (referringPage.origin === window.location.origin) sourcePage.value = referringPage.pathname;
      } catch (_) { /* Direct visits have no referring page. */ }
    }
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
      form.setAttribute("aria-busy", "true");
      button.textContent = "Submitting…";
      status.textContent = "";

      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 30000);
      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
          signal: controller.signal
        });
        if (!response.ok) throw new Error("Submission failed");
        form.reset();
        status.textContent = "Thank you. Your enquiry has been submitted. HONVAX will review the information and contact you about the next step.";
      } catch (error) {
        status.textContent = error.name === "AbortError"
          ? "We could not confirm submission. Your details are still here. Please email info@honvax.com if you need to confirm receipt."
          : "Your enquiry could not be submitted. Your details are still here. Try again, submit without the attachment, or email info@honvax.com.";
      } finally {
        window.clearTimeout(timeout);
        form.removeAttribute("aria-busy");
        button.disabled = false;
        button.textContent = originalButtonText || "Send My Enquiry";
      }
    });
  }
})();
