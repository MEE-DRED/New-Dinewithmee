(function () {
  function getPrograms() {
    return Array.isArray(window.DWM_PATHWAY_PROGRAMS) ? window.DWM_PATHWAY_PROGRAMS : [];
  }

  function getProgramFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || "glycemic-reset";
    return window.getPathwayProgramById ? window.getPathwayProgramById(id) : null;
  }

  function renderPathwaysList() {
    const listEl = document.getElementById("pathways-list");
    if (!listEl) return;

    const programs = getPrograms();
    if (!programs.length) {
      listEl.innerHTML = '<p class="program-empty">No programs available right now.</p>';
      return;
    }

    listEl.innerHTML = programs
      .map(
        program => `
          <article class="programs-page-card">
            <div class="programs-page-content">
              <div class="programs-page-meta">
                <span>${program.date}</span>
                <span>${program.readTime}</span>
                <span>${program.category}</span>
              </div>
              <h3>${program.title}</h3>
              <p>${program.preview}</p>
              <a href="pathway.html?id=${program.id}" class="programs-page-btn" data-program-nav>View Program</a>
            </div>
          </article>
        `
      )
      .join("");
  }

  function renderProgramArticle() {
    const articleEl = document.getElementById("pathway-article");
    if (!articleEl) return;

    const selected = getProgramFromUrl() || getPrograms()[0];
    if (!selected) {
      articleEl.innerHTML = '<p class="program-empty">Program unavailable.</p>';
      return;
    }

    document.title = `${selected.title} | Dine with Mee`;

    const bodyMarkup = (selected.content || [])
      .map(paragraph => `<p>${paragraph}</p>`)
      .join("");

    articleEl.innerHTML = `
      <header class="program-article-header">
        <div class="program-article-actions top-actions">
          <a href="index.html#clinical-programs" class="program-nav-btn" data-program-nav>Return Home</a>
          <a href="pathways.html" class="program-nav-btn secondary" data-program-nav>View All</a>
        </div>
        <div class="program-article-meta">
          <span>${selected.date}</span>
          <span>${selected.readTime}</span>
          <span>${selected.category}</span>
        </div>
        <h1>${selected.title}</h1>
      </header>

      <div class="program-article-body">
        ${bodyMarkup}
      </div>

      <footer class="program-article-actions bottom-actions">
        <a href="index.html#clinical-programs" class="program-nav-btn" data-program-nav>Return Home</a>
        <a href="pathways.html" class="program-nav-btn secondary" data-program-nav>View All</a>
      </footer>
    `;
  }

  document.addEventListener("DOMContentLoaded", function () {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    renderPathwaysList();
    renderProgramArticle();
  });
})();
