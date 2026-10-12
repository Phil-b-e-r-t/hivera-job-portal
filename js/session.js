/* Hirevera session helper.
   Load this on index.html (login), pages/signup.html and any page that shows the user's name.
   - Sign-up form: saves the full name against the email/phone used.
   - Login form: looks that name up. If the person never signed up on this
     browser, it falls back to the part of their email before the "@".
   Demo only: localStorage is not real authentication. */
(function () {
  var USER_KEY = "hirevera_user";
  var USERS_KEY = "hirevera_users";

  function read(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* storage blocked */ }
  }
  function titleCase(text) {
    return text.replace(/[._-]+/g, " ").replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }
  function nameFromEmail(id) {
    return id.indexOf("@") > 0 ? titleCase(id.split("@")[0]) : "";
  }

  // Runs in the capture phase so it fires before the page's own submit handler.
  document.addEventListener("submit", function (e) {
    var form = e.target;
    if (!form || form.tagName !== "FORM") return;

    var idInput = form.querySelector('[name="identifier"], [name="email"], [type="email"]');
    var nameInput = form.querySelector('[name="fullname"], [name="fullName"], [name="full_name"], [name="name"]');
    var id = idInput ? idInput.value.trim().toLowerCase() : "";
    if (!id && !(nameInput && nameInput.value.trim())) return;

    var users = read(USERS_KEY) || {};

    if (nameInput && nameInput.value.trim()) {            // sign-up
      var fullName = nameInput.value.trim();
      if (id) users[id] = fullName;
      write(USERS_KEY, JSON.stringify(users));
      write(USER_KEY, fullName);
    } else if (id) {                                      // login
      write(USER_KEY, users[id] || nameFromEmail(id));
    }
  }, true);

  window.Hirevera = {
    firstName: function () {
      var name = "";
      try { name = localStorage.getItem(USER_KEY) || ""; } catch (e) { /* ignore */ }
      return name.trim().split(/\s+/)[0] || "";
    },
    greeting: function () {
      var h = new Date().getHours();
      return h < 12 ? "Good Morning" : h < 18 ? "Good Afternoon" : "Good Evening";
    }
  };

  // Fills <h1 data-greeting> and <a data-avatar> on the job listing page.
  document.addEventListener("DOMContentLoaded", function () {
    var name = window.Hirevera.firstName();
    var greeting = document.querySelector("[data-greeting]");
    var avatar = document.querySelector("[data-avatar]");
    if (greeting) greeting.textContent = window.Hirevera.greeting() + (name ? ", " + name : "");
    if (avatar && name) avatar.textContent = name.charAt(0).toUpperCase();
  });
})();