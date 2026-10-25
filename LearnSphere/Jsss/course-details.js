const courseDetails = {
  ai: {
    title: "Advanced Generative AI",
    category: "Technology",
    image: "ai",
    duration: "12 weeks",
    hours: "6 hours per week",
    rating: "4.9",
    instructor: "Dr. Arun Mehta",
    price: "$899",
    description: "Move beyond prompts and learn to build useful AI systems.",
    outcomes: [
      "Choose the right model for a task.",
      "Design reliable prompts and context.",
      "Evaluate quality and safety.",
      "Build a practical final project."
    ],
    lessons: [
      ["Models without mythology", "Week 1-2"],
      ["Prompt and context systems", "Week 3-4"],
      ["Useful evaluation", "Week 5-7"],
      ["Final project", "Week 8-12"]
    ],
    ctaTitle: "Build something useful.",
    ctaDescription: "Enrollment includes workshops, feedback, and course materials."
  },
  design: {
    title: "Strategic Product Design",
    category: "Design",
    image: "design",
    duration: "8 weeks",
    hours: "5 hours per week",
    rating: "4.8",
    instructor: "Dr. Lena Ortiz",
    price: "$749",
    description: "Turn unclear problems into thoughtful, useful products.",
    outcomes: [
      "Research user needs and frame a clear problem.",
      "Explore and compare product concepts.",
      "Prototype and test useful interactions.",
      "Present a product direction with evidence."
    ],
    lessons: [
      ["Research and problem framing", "Week 1-2"],
      ["Product principles and concepts", "Week 3-4"],
      ["Prototyping and testing", "Week 5-6"],
      ["Final product proposal", "Week 7-8"]
    ],
    ctaTitle: "Design with purpose.",
    ctaDescription: "Practice research, prototyping, and critique with instructor feedback."
  },
  leadership: {
    title: "Emotional Intelligence",
    category: "Leadership",
    image: "leadership",
    duration: "6 weeks",
    hours: "4 hours per week",
    rating: "4.9",
    instructor: "Marcus Lee",
    price: "$599",
    description: "Develop empathy, awareness, and clear communication.",
    outcomes: [
      "Recognize how emotions shape decisions.",
      "Listen actively and respond with empathy.",
      "Navigate difficult conversations constructively.",
      "Build healthier team habits."
    ],
    lessons: [
      ["Self-awareness at work", "Week 1"],
      ["Empathy and active listening", "Week 2-3"],
      ["Difficult conversations", "Week 4-5"],
      ["Team practice plan", "Week 6"]
    ],
    ctaTitle: "Lead with greater awareness.",
    ctaDescription: "Build practical communication habits through guided exercises and feedback."
  },
  business: {
    title: "Venture Capital Foundations",
    category: "Business",
    image: "business",
    duration: "10 weeks",
    hours: "6 hours per week",
    rating: "4.7",
    instructor: "Aisha Rahman",
    price: "$1,200",
    description: "Understand early-stage funding and investment decisions.",
    outcomes: [
      "Understand venture funds and their incentives.",
      "Assess early-stage markets and business models.",
      "Review startup financials and deal terms.",
      "Write a clear investment recommendation."
    ],
    lessons: [
      ["How venture funds work", "Week 1-2"],
      ["Markets and business models", "Week 3-5"],
      ["Diligence and deal mechanics", "Week 6-8"],
      ["Investment recommendation", "Week 9-10"]
    ],
    ctaTitle: "Make better investment decisions.",
    ctaDescription: "Work through practical cases, deal analysis, and a final investment memo."
  },
  "narrative-design": {
    title: "Advanced Narrative Design",
    category: "Design",
    image: "story",
    duration: "4 weeks",
    hours: "3 hours per week",
    rating: "4.8",
    instructor: "Zoe Williams",
    price: "$499",
    description: "Create clear, memorable stories for digital products.",
    outcomes: [
      "Shape a story around a user's goals.",
      "Write concise content for key interactions.",
      "Map narrative choices across a product flow.",
      "Present a polished interactive story."
    ],
    lessons: [
      ["Story foundations for products", "Week 1"],
      ["Voice and interaction flows", "Week 2"],
      ["Prototyping narrative choices", "Week 3"],
      ["Final story presentation", "Week 4"]
    ],
    ctaTitle: "Tell a clearer product story.",
    ctaDescription: "Develop a narrative prototype with feedback at every stage."
  },
  data: {
    title: "Leading with Data",
    category: "Technology",
    image: "data",
    duration: "8 weeks",
    hours: "5 hours per week",
    rating: "4.9",
    instructor: "Dr. Samuel Okafor",
    price: "$799",
    description: "Turn evidence into decisions your team can act on.",
    outcomes: [
      "Frame decisions as measurable questions.",
      "Choose useful metrics and data sources.",
      "Read analysis and communicate uncertainty.",
      "Present an evidence-based recommendation."
    ],
    lessons: [
      ["Questions, metrics, and evidence", "Week 1-2"],
      ["Collecting and exploring data", "Week 3-4"],
      ["Analysis and interpretation", "Week 5-6"],
      ["Decision brief and presentation", "Week 7-8"]
    ],
    ctaTitle: "Turn evidence into action.",
    ctaDescription: "Practice using data to explain options and guide team decisions."
  }
};

const requestedCourseId = new URLSearchParams(window.location.search).get("id");
const selectedCourseId = Object.prototype.hasOwnProperty.call(courseDetails, requestedCourseId)
  ? requestedCourseId
  : "ai";
const selectedCourse = courseDetails[selectedCourseId];
document.querySelector("#add-to-cart").dataset.cartCourse = selectedCourseId;

document.title = `${selectedCourse.title} - LearnSphere`;
document.querySelector("#course-title").textContent = selectedCourse.title;
document.querySelector("#course-category").textContent = `${selectedCourse.category} - Autumn cohort`;
document.querySelector("#course-description").textContent = selectedCourse.description;
document.querySelector("#course-duration").textContent = selectedCourse.duration;
document.querySelector("#course-hours").textContent = selectedCourse.hours;
document.querySelector("#course-rating").textContent = `Rating ${selectedCourse.rating}`;
document.querySelector("#course-instructor").textContent = selectedCourse.instructor;
document.querySelector("#course-price").textContent = `${selectedCourse.price} USD`;
document.querySelector("#buy-course").textContent = `Buy now - ${selectedCourse.price}`;
document.querySelector("#course-cta-title").textContent = selectedCourse.ctaTitle;
document.querySelector("#course-cta-description").textContent = selectedCourse.ctaDescription;
document.querySelector("#course-cta-button").textContent = `Buy course - ${selectedCourse.price}`;

const courseImage = document.querySelector("#course-image");
courseImage.className = `detail-image image-${selectedCourse.image}`;
courseImage.setAttribute("aria-label", `${selectedCourse.title} course image`);

const outcomesList = document.querySelector("#course-outcomes");
selectedCourse.outcomes.forEach((outcome) => {
  const item = document.createElement("li");
  item.textContent = outcome;
  outcomesList.append(item);
});

const curriculum = document.querySelector("#course-curriculum");
selectedCourse.lessons.forEach(([title, weeks]) => {
  const lesson = document.createElement("div");
  const lessonTitle = document.createElement("span");
  const lessonWeeks = document.createElement("span");

  lesson.className = "lesson";
  lessonTitle.textContent = title;
  lessonWeeks.textContent = weeks;
  lesson.append(lessonTitle, lessonWeeks);
  curriculum.append(lesson);
});

const enrollmentStorageKey = "learnsphere-enrollments";
const enrollmentButtons = document.querySelectorAll("[data-enroll-course]");
const enrollmentFeedback = document.querySelector("#enrollment-feedback");
const enrollmentMessage = document.querySelector("#enrollment-message");

function readEnrollments() {
  try {
    const savedEnrollments = JSON.parse(window.localStorage.getItem(enrollmentStorageKey) || "[]");
    if (!Array.isArray(savedEnrollments)) return [];

    return [...new Set(savedEnrollments.filter((courseId) =>
      Object.prototype.hasOwnProperty.call(courseDetails, courseId)
    ))];
  } catch {
    return [];
  }
}

let enrolledCourseIds = readEnrollments();

function enrollInSelectedCourse() {
  const alreadyEnrolled = enrolledCourseIds.includes(selectedCourseId);

  if (!alreadyEnrolled) {
    enrolledCourseIds.push(selectedCourseId);
    try {
      window.localStorage.setItem(enrollmentStorageKey, JSON.stringify(enrolledCourseIds));
    } catch {
      // Keep this session's enrollment visible if browser storage is unavailable.
    }
  }

  enrollmentMessage.textContent = alreadyEnrolled
    ? `${selectedCourse.title} is already in your courses.`
    : `${selectedCourse.title} added to your courses!`;
  enrollmentFeedback.hidden = false;
}

enrollmentButtons.forEach((button) => {
  button.addEventListener("click", enrollInSelectedCourse);
});
