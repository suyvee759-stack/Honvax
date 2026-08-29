(() => {
  "use strict";
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-header nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const form = document.querySelector(".rfq-form");
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = form.querySelector("button[type=submit]");
      const status = form.querySelector(".form-status");
      button.disabled = true;
      button.textContent = "Submitting…";
      status.textContent = "";
      try {
        const response = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
        if (!response.ok) throw new Error("Submission failed");
        form.reset();
        status.textContent = "Thank you. Your enquiry has been submitted.";
      } catch (error) {
        status.textContent = "The form could not be submitted. Please email info@honvax.com with your documents.";
      } finally {
        button.disabled = false;
        button.textContent = "Submit RFQ";
      }
    });
  }
})();
