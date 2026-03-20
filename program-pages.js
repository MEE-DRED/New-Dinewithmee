(function () {
  function getPrograms() {
    return Array.isArray(window.DWM_PROGRAMS) ? window.DWM_PROGRAMS : [];
  }

  function getProgramFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const programId = params.get("id") || "chronic-disease";
    return window.getDwmProgramById ? window.getDwmProgramById(programId) : null;
  }

  function createMealPlanTable(mealPlan) {
    if (!Array.isArray(mealPlan) || !mealPlan.length) return "";

    const rows = mealPlan
      .map(
        item => `
          <tr>
            <td>${item.day}</td>
            <td>${item.breakfast}</td>
            <td>${item.lunch}</td>
            <td>${item.dinner}</td>
          </tr>
        `
      )
      .join("");

    return `
      <div class="program-table-wrap">
        <table class="program-meal-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Breakfast</th>
              <th>Lunch</th>
              <th>Dinner</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }

  function createSectionMarkup(section) {
    const paragraphs = Array.isArray(section.paragraphs)
      ? section.paragraphs.map(text => `<p>${text}</p>`).join("")
      : "";

    const list = Array.isArray(section.list)
      ? `<ul class="program-list">${section.list.map(item => `<li>${item}</li>`).join("")}</ul>`
      : "";

    const mealPlanTable = section.mealPlan ? createMealPlanTable(section.mealPlan) : "";

    return `
      <section class="program-section-block">
        <h2>${section.heading}</h2>
        ${paragraphs}
        ${list}
        ${mealPlanTable}
      </section>
    `;
  }

  function renderProgramsList() {
    const mount = document.getElementById("programs-list");
    if (!mount) return;

    const programs = getPrograms();
    if (!programs.length) {
      mount.innerHTML = `<p class="program-empty">No clinical programs are available right now.</p>`;
      return;
    }

    mount.innerHTML = programs
      .map(
        program => `
          <article class="programs-page-card">
            <img src="${program.image}" alt="${program.title}" class="programs-page-image" loading="lazy" />
            <div class="programs-page-content">
              <div class="programs-page-meta">
                <span>${program.date}</span>
                <span>${program.readTime}</span>
                <span>${program.category}</span>
              </div>
              <h3>${program.title}</h3>
              <p>${program.preview}</p>
              <a href="program.html?id=${program.id}" class="programs-page-btn" data-program-nav>View Program</a>
            </div>
          </article>
        `
      )
      .join("");
  }

  function renderProgramArticle() {
    const mount = document.getElementById("program-article");
    if (!mount) return;

    const programs = getPrograms();
    const selected = getProgramFromUrl() || programs[0];

    if (!selected) {
      mount.innerHTML = `<p class="program-empty">Article unavailable.</p>`;
      return;
    }

    document.title = `${selected.title} | Dine with Mee`;

    const tags = Array.isArray(selected.tags)
      ? selected.tags.map(tag => `<span class="program-tag-chip">${tag}</span>`).join("")
      : "";

    const sections = Array.isArray(selected.sections)
      ? selected.sections.map(createSectionMarkup).join("")
      : `<p>${selected.content || ""}</p>`;

    mount.innerHTML = `
      <header class="program-article-header">
        <div class="program-article-actions top-actions">
          <a href="index.html#clinical-focus" class="program-nav-btn" data-program-nav>Return Home</a>
          <a href="programs.html" class="program-nav-btn secondary" data-program-nav>Explore All Programs</a>
        </div>
        <div class="program-article-meta">
          <span>${selected.date}</span>
          <span>${selected.readTime}</span>
          <span>${selected.category}</span>
        </div>
        <h1>${selected.title}</h1>
        <div class="program-tag-row">${tags}</div>
      </header>

      <div class="program-article-body">
        ${sections}
      </div>

      <footer class="program-article-actions bottom-actions">
        <a href="index.html#clinical-focus" class="program-nav-btn" data-program-nav>Return Home</a>
        <a href="programs.html" class="program-nav-btn secondary" data-program-nav>Explore All Programs</a>
      </footer>
    `;
  }

  document.addEventListener("DOMContentLoaded", () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    renderProgramsList();
    renderProgramArticle();
  });
})();
