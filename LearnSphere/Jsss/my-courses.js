const enrolledCoursesKey = "learnsphere-enrollments";
const availableCourses = {
  ai: {
    title: "Advanced Generative AI",
    category: "Technology",
    image: "ai",
    duration: "12 weeks",
    price: "$899",
    description: "Build useful AI workflows and evaluate them responsibly."
  },
  design: {
    title: "Strategic Product Design",
    category: "Design",
    image: "design",
    duration: "8 weeks",
    price: "$749",
    description: "Turn unclear problems into thoughtful, useful products."
  },
  leadership: {
    title: "Emotional Intelligence",
    category: "Leadership",
    image: "leadership",
    duration: "6 weeks",
    price: "$599",
    description: "Develop empathy, awareness, and clear communication."
  },
  business: {
    title: "Venture Capital Foundations",
    category: "Business",
    image: "business",
    duration: "10 weeks",
    price: "$1,200",
    description: "Understand early-stage funding and investment decisions."
  },
  "narrative-design": {
    title: "Advanced Narrative Design",
    category: "Design",
    image: "story",
    duration: "4 weeks",
    price: "$499",
    description: "Create clear, memorable stories for digital products."
  },
  data: {
    title: "Leading with Data",
    category: "Technology",
    image: "data",
    duration: "8 weeks",
    price: "$799",
    description: "Turn evidence into decisions your team can act on."
  }
};

const enrolledCount = document.querySelector("#enrolled-count");
const emptyState = document.querySelector("#my-courses-empty");
const courseGrid = document.querySelector("#my-courses-grid");

function readEnrolledCourseIds() {
  try {
    const storedIds = JSON.parse(window.localStorage.getItem(enrolledCoursesKey) || "[]");
    if (!Array.isArray(storedIds)) return [];

    return [...new Set(storedIds.filter((courseId) =>
      Object.prototype.hasOwnProperty.call(availableCourses, courseId)
    ))];
  } catch {
    return [];
  }
}

function createCourseCard(courseId) {
  const course = availableCourses[courseId];
  const card = document.createElement("article");
  const image = document.createElement("div");
  const content = document.createElement("div");
  const topline = document.createElement("div");
  const category = document.createElement("p");
  const badge = document.createElement("span");
  const title = document.createElement("h3");
  const description = document.createElement("p");
  const footer = document.createElement("div");
  const metadata = document.createElement("span");
  const continueLink = document.createElement("a");

  card.className = "my-course-card";
  image.className = `course-image image-${course.image}`;
  image.setAttribute("role", "img");
  image.setAttribute("aria-label", `${course.title} course image`);
  content.className = "my-course-content";
  topline.className = "my-course-topline";
  category.className = "my-course-category";
  category.textContent = course.category;
  badge.className = "enrolled-badge";
  badge.textContent = "Enrolled";
  title.textContent = course.title;
  description.className = "my-course-description";
  description.textContent = course.description;
  footer.className = "my-course-footer";
  metadata.className = "my-course-meta";
  metadata.textContent = `${course.duration} · ${course.price}`;
  continueLink.className = "continue-link";
  continueLink.href = `course-details.html?id=${encodeURIComponent(courseId)}`;
  continueLink.textContent = "Continue learning";

  topline.append(category, badge);
  footer.append(metadata, continueLink);
  content.append(topline, title, description, footer);
  card.append(image, content);
  return card;
}

function renderMyCourses() {
  const courseIds = readEnrolledCourseIds();
  courseGrid.replaceChildren(...courseIds.map(createCourseCard));
  enrolledCount.textContent = `${courseIds.length} ${courseIds.length === 1 ? "course" : "courses"}`;
  emptyState.hidden = courseIds.length !== 0;
  courseGrid.hidden = courseIds.length === 0;
}

renderMyCourses();
window.addEventListener("storage", (event) => {
  if (event.key === enrolledCoursesKey) renderMyCourses();
});
