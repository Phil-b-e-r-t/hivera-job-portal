/* Hirevera · small interactions for Home / Applications / Messages / Profile */
(function () {
  var H = window.Hirevera;
  var name = H && H.firstName ? H.firstName() : "";
  document.querySelectorAll("[data-name]").forEach(function (el) { el.textContent = name || "there"; });

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