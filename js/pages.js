/* Hirevera · small interactions for Home / Applications / Messages / Profile */
(function () {
  var H = window.Hirevera;
  var name = H && H.firstName ? H.firstName() : "";
  document.querySelectorAll("[data-name]").forEach(function (el) { el.textContent = name || "there"; });

  var applicationList = document.querySelector("[data-applications-list]");
  if (applicationList) {
    try {
      var savedApplications = JSON.parse(localStorage.getItem("hirevera_applications") || "[]");
      if (Array.isArray(savedApplications)) {
        savedApplications.forEach(function (application) {
          var job = (window.HIREVERA_JOBS || {})[application.jobId] || {};
          var row = document.createElement("div");
          row.className = "row";
          row.setAttribute("data-status", "sent");
          row.setAttribute("data-demo-application", "true");

          var logo = document.createElement("span");
          logo.className = "logo-tile " + (job.logoClass || "");
          if (job.logoIcon) {
            var icon = document.createElement("i");
            icon.setAttribute("data-lucide", job.logoIcon);
            logo.appendChild(icon);
          } else {
            logo.textContent = job.logoLetter || application.company.charAt(0);
          }

          var main = document.createElement("span");
          main.className = "row__main";
          var title = document.createElement("span");
          title.className = "row__title";
          title.textContent = application.title;
          var sub = document.createElement("span");
          sub.className = "row__sub";
          sub.textContent = application.company + " · Applied just now";
          main.appendChild(title);
          main.appendChild(sub);

          var status = document.createElement("span");
          status.className = "status status--sent";
          status.textContent = "Sent";
          row.appendChild(logo);
          row.appendChild(main);
          row.appendChild(status);
          applicationList.insertBefore(row, document.getElementById("filter-empty"));
        });
      }
    } catch (error) {
      /* Keep the sample applications visible if browser storage is unavailable. */
    }
    if (window.lucide) window.lucide.createIcons();
  }

  var pills = document.querySelectorAll(".pill[data-filter]");
  var rows = document.querySelectorAll(".row[data-status]");
  var note = document.getElementById("filter-empty");
  pills.forEach(function (pill) {
    pill.addEventListener("click", function () {
      pills.forEach(function (p) { p.classList.remove("is-active"); });
      pill.classList.add("is-active");
      var f = pill.getAttribute("data-filter"), n = 0;
      rows.forEach(function (r) {
        var show = f === "all" || r.getAttribute("data-status") === f;
        r.style.display = show ? "" : "none";
        if (show) n++;
      });
      if (note) note.style.display = n ? "none" : "block";
    });
  });

  document.querySelectorAll(".row[data-read]").forEach(function (r) {
    r.addEventListener("click", function () {
      var d = r.querySelector(".dot");
      if (d) d.remove();
    });
  });
})();