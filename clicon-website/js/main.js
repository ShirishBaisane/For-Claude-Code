/* ==========================================================================
   Clicon Climate Control Solutions — site scripts
   No build step, no dependencies. Works as a plain <script> include.
   ========================================================================== */
(function () {
  "use strict";

  /* ---- Config: replace before go-live (see CONTENT-TODO.md) ---- */
  var CLICON = {
    whatsappNumber: "919900000000", // TODO: replace with real WhatsApp number, digits only, country code first
    phoneNumber: "+919900000000",   // TODO: replace with real phone number
    defaultWhatsappMessage: "Hi Clicon, I would like to enquire about commercial vehicle cooling / reefer service support."
  };
  window.CLICON_CONFIG = CLICON;

  document.addEventListener("DOMContentLoaded", function () {
    initMobileNav();
    initWhatsappLinks();
    initFaqAnalytics();
    initFilters();
    initContactForm();
    initActiveNav();
    trackOutboundClicks();
    setYear();
    prefillServiceFromQuery();
  });

  function setYear() {
    var year = String(new Date().getFullYear());
    document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = year; });
  }

  /* Home/service CTA links can pass ?service=Fleet%20AMC to preselect the enquiry form's service dropdown */
  function prefillServiceFromQuery() {
    var select = document.querySelector("#enquiryForm select[name='service']");
    if (!select) return;
    var params = new URLSearchParams(window.location.search);
    var service = params.get("service");
    if (service) {
      var opt = Array.prototype.find.call(select.options, function (o) { return o.value === service; });
      if (opt) select.value = service;
    }
  }

  /* Mobile nav toggle */
  function initMobileNav() {
    var toggle = document.getElementById("navToggle");
    var nav = document.getElementById("mainNav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* Build WhatsApp links dynamically so each page/service can pass its own message
     via data-wa-message on any element with class "js-whatsapp" or wa.me placeholder hrefs */
  function initWhatsappLinks() {
    document.querySelectorAll("a.js-whatsapp, a[href^='https://wa.me/']").forEach(function (a) {
      var msg = a.getAttribute("data-wa-message") || CLICON.defaultWhatsappMessage;
      a.href = "https://wa.me/" + CLICON.whatsappNumber + "?text=" + encodeURIComponent(msg);
    });
    document.querySelectorAll("a.js-call").forEach(function (a) {
      a.href = "tel:" + CLICON.phoneNumber;
    });
  }

  /* Highlight current page in nav */
  function initActiveNav() {
    var path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".main-nav a").forEach(function (a) {
      var href = a.getAttribute("href");
      if (href === path || (path === "" && href === "index.html")) {
        a.classList.add("active");
      }
    });
  }

  /* Optional GA4 event pushes if gtag is configured (see SEO-ANALYTICS.md) */
  function gaEvent(name, params) {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params || {});
    }
  }

  function trackOutboundClicks() {
    document.querySelectorAll("a.js-call").forEach(function (a) {
      a.addEventListener("click", function () { gaEvent("call_click", { link_url: a.href }); });
    });
    document.querySelectorAll("a.js-whatsapp, a[href^='https://wa.me/']").forEach(function (a) {
      a.addEventListener("click", function () { gaEvent("whatsapp_click", { link_url: a.href }); });
    });
  }

  function initFaqAnalytics() {
    document.querySelectorAll(".faq details").forEach(function (d) {
      d.addEventListener("toggle", function () {
        if (d.open) gaEvent("faq_open", { question: d.querySelector("summary") ? d.querySelector("summary").textContent.trim() : "" });
      });
    });
  }

  /* Generic filter buttons: [data-filter] on buttons toggles [data-category] cards */
  function initFilters() {
    document.querySelectorAll(".filter-bar").forEach(function (bar) {
      var targetSelector = bar.getAttribute("data-target");
      var items = targetSelector ? document.querySelectorAll(targetSelector) : [];
      bar.querySelectorAll(".filter-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          bar.querySelectorAll(".filter-btn").forEach(function (b) { b.classList.remove("active"); });
          btn.classList.add("active");
          var filter = btn.getAttribute("data-filter");
          items.forEach(function (item) {
            var cats = (item.getAttribute("data-category") || "").split(",");
            item.style.display = (filter === "all" || cats.indexOf(filter) !== -1) ? "" : "none";
          });
        });
      });
    });
  }

  /* Contact / enquiry form: posts to php/contact-handler.php, with graceful fallback */
  function initContactForm() {
    var form = document.getElementById("enquiryForm");
    if (!form) return;
    var status = form.querySelector(".form-status");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Honeypot spam check
      var hp = form.querySelector("input[name='website']");
      if (hp && hp.value) { return; }

      var required = form.querySelectorAll("[required]");
      var missing = false;
      required.forEach(function (field) {
        if (!field.value || !field.value.trim()) missing = true;
      });
      if (missing) {
        showStatus(status, "error", "Please fill in all required fields (Name, Mobile Number and Service Required).");
        return;
      }

      var mobile = form.querySelector("[name='mobile']");
      if (mobile && !/^[6-9]\d{9}$/.test(mobile.value.replace(/\D/g, "").slice(-10))) {
        showStatus(status, "error", "Please enter a valid 10-digit mobile number.");
        return;
      }

      var submitBtn = form.querySelector("button[type='submit']");
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending..."; }

      var formData = new FormData(form);
      formData.append("page_url", window.location.href);
      formData.append("referrer", document.referrer || "direct");

      fetch("php/contact-handler.php", { method: "POST", body: formData })
        .then(function (res) { return res.json().catch(function () { return { success: res.ok }; }); })
        .then(function (data) {
          if (data && data.success) {
            gaEvent("generate_lead", { service: formData.get("service") || "" });
            showStatus(status, "success", "Thank you! Your enquiry has been received. Our service team will contact you shortly. For urgent breakdown support, please call or WhatsApp us directly.");
            form.reset();
          } else {
            showStatus(status, "error", "We could not submit your enquiry right now. Please call or WhatsApp us directly, or try again.");
          }
        })
        .catch(function () {
          showStatus(status, "error", "We could not reach the server. Please call or WhatsApp us directly, or try again in a moment.");
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Submit Enquiry"; }
        });
    });
  }

  function showStatus(el, type, message) {
    if (!el) return;
    el.className = "form-status " + type;
    el.textContent = message;
    el.style.display = "block";
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
})();
