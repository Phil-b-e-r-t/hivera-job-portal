/* Hirevera job-details.html
   Reads ?id= from the URL and fills the page with that job's data
   from js/jobs-data.js. */
(function () {
  function logoHTML(job) {
    if (job.logoIcon) return '<i data-lucide="' + job.logoIcon + '"></i>';
    return job.logoLetter || "";
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var params = new URLSearchParams(window.location.search);
    var id = parseInt(params.get("id"), 10) || 2;
    var jobs = window.HIREVERA_JOBS || {};
    var job = jobs[id] || jobs[2];
    if (!job) return;

    document.getElementById("page-title").textContent = job.title + " \u00b7 " + job.company + " \u00b7 Hirevera";

    setText("d-company", job.company);
    setText("d-posted", "Posted " + job.posted);
    setText("d-title", job.title);
    setText("d-location", job.location);
    setText("d-salary", job.salary);
    setText("d-per", job.per);
    document.getElementById("d-new-badge").style.display = job.isNew ? "" : "none";
    document.getElementById("d-easy-badge").style.display = job.easy ? "" : "none";

    ["d-logo", "d-logo-2"].forEach(function (lid) {
      var el = document.getElementById(lid);
      el.className = "logo-tile " + job.logoClass;
      el.innerHTML = logoHTML(job);
    });

    document.getElementById("d-facts").innerHTML = job.facts
      .map(function (f) { return '<span class="fact">' + f + '</span>'; })
      .join("");

    setText("d-about", job.about);
    document.getElementById("d-responsibilities").innerHTML = job.responsibilities
      .map(function (r) { return "<li>" + r + "</li>"; }).join("");
    document.getElementById("d-requirements").innerHTML = job.requirements
      .map(function (r) { return "<li>" + r + "</li>"; }).join("");

    setText("d-company-name", "About " + job.company);
    setText("d-company-sub", job.companySub);
    setText("d-company-about", job.companyAbout);

    document.getElementById("d-apply").href = "application-form.html?id=" + id;

    var others = Object.keys(jobs).filter(function (k) { return +k !== id; }).slice(0, 2);
    document.getElementById("d-similar").innerHTML = others.map(function (k) {
      var j = jobs[k];
      return '<a class="similar-card" href="job-details.html?id=' + k + '">' +
        '<span class="similar-card__company"><span class="logo-tile ' + j.logoClass + '">' + logoHTML(j) + '</span>' + j.company + '</span>' +
        '<span class="similar-card__title">' + j.title + '</span>' +
        '<span class="similar-card__loc">' + j.location + '</span>' +
        '<span class="similar-card__salary">' + j.salary + ' ' + j.per + '</span>' +
        '</a>';
    }).join("");

    if (window.lucide) window.lucide.createIcons();
  });
})();