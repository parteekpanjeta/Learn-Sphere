const courseSearchInput = document.querySelector("#course-search-input");
const courseCards = document.querySelectorAll("#course-list .course-card");
const courseSearchStatus = document.querySelector("#course-search-status");
const courseFilterButtons = document.querySelectorAll("[data-course-filter]");
let activeCourseFilter = "all";

if (courseSearchInput && courseSearchStatus && courseCards.length) {
  const updateCourses = () => {
    const query = courseSearchInput.value.trim().toLocaleLowerCase();
    let visibleCourses = 0;

    courseCards.forEach((card) => {
      const searchableText = `${card.textContent} ${card.dataset.search || ""}`.toLocaleLowerCase();
      const matchesCategory = activeCourseFilter === "all" || card.dataset.category === activeCourseFilter;
      const matchesSearch = !query || searchableText.includes(query);
      const matches = matchesCategory && matchesSearch;

      card.hidden = !matches;
      if (matches) visibleCourses += 1;
    });

    courseSearchStatus.hidden = visibleCourses !== 0;
  };

  courseSearchInput.addEventListener("input", updateCourses);

  courseFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCourseFilter = button.dataset.courseFilter;

      courseFilterButtons.forEach((filterButton) => {
        const isActive = filterButton === button;
        filterButton.classList.toggle("active", isActive);
        filterButton.setAttribute("aria-pressed", String(isActive));
      });

      updateCourses();
    });
  });
}
