(() => {
  const cartStorageKey = "learnsphere-cart";
  const enrollmentStorageKey = "learnsphere-enrollments";
  const courses = {
    ai: { title: "Advanced Generative AI", category: "Technology", price: 899 },
    design: { title: "Strategic Product Design", category: "Design", price: 749 },
    leadership: { title: "Emotional Intelligence", category: "Leadership", price: 599 },
    business: { title: "Venture Capital Foundations", category: "Business", price: 1200 },
    "narrative-design": { title: "Advanced Narrative Design", category: "Design", price: 499 },
    data: { title: "Leading with Data", category: "Technology", price: 799 }
  };

  const layout = document.querySelector("#checkout-layout");
  const emptyState = document.querySelector("#checkout-empty");
  const successState = document.querySelector("#checkout-success");
  const errorMessage = document.querySelector("#checkout-error");
  const itemList = document.querySelector("#checkout-items");
  const countLabel = document.querySelector("#checkout-course-count");
  const summaryCount = document.querySelector("#checkout-summary-count");
  const subtotal = document.querySelector("#checkout-subtotal");
  const total = document.querySelector("#checkout-total");
  const completeButton = document.querySelector("#complete-purchase");
  const successMessage = document.querySelector("#checkout-success-message");
  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  });

  function readStoredIds(key) {
    try {
      const savedIds = JSON.parse(window.localStorage.getItem(key) || "[]");
      if (!Array.isArray(savedIds)) return [];
      return [...new Set(savedIds.filter((id) => Object.prototype.hasOwnProperty.call(courses, id)))];
    } catch {
      return [];
    }
  }

  const cartIds = readStoredIds(cartStorageKey);
  const countText = `${cartIds.length} ${cartIds.length === 1 ? "course" : "courses"}`;
  const orderTotal = cartIds.reduce((sum, id) => sum + courses[id].price, 0);

  function renderOrder() {
    itemList.replaceChildren();
    countLabel.textContent = countText;
    summaryCount.textContent = countText;
    subtotal.textContent = money.format(orderTotal);
    total.textContent = money.format(orderTotal);

    cartIds.forEach((id) => {
      const course = courses[id];
      const item = document.createElement("article");
      const detail = document.createElement("div");
      const title = document.createElement("h3");
      const category = document.createElement("p");
      const price = document.createElement("strong");

      item.className = "checkout-item";
      title.textContent = course.title;
      category.textContent = course.category;
      price.textContent = money.format(course.price);
      detail.append(title, category);
      item.append(detail, price);
      itemList.append(item);
    });

    const isEmpty = cartIds.length === 0;
    layout.hidden = isEmpty;
    emptyState.hidden = !isEmpty;
  }

  completeButton.addEventListener("click", () => {
    if (!cartIds.length) return;

    completeButton.disabled = true;
    errorMessage.hidden = true;
    const enrolledIds = [...new Set([...readStoredIds(enrollmentStorageKey), ...cartIds])];

    try {
      window.localStorage.setItem(enrollmentStorageKey, JSON.stringify(enrolledIds));
      window.localStorage.removeItem(cartStorageKey);
    } catch {
      completeButton.disabled = false;
      errorMessage.textContent = "We couldn’t save your purchase. Check your browser storage and try again.";
      errorMessage.hidden = false;
      return;
    }

    layout.hidden = true;
    errorMessage.hidden = true;
    successMessage.textContent = `${cartIds.map((id) => courses[id].title).join(", ")} ${cartIds.length === 1 ? "has" : "have"} been added to My Courses.`;
    successState.hidden = false;
    document.title = "Purchase complete - LearnSphere";
    successState.focus();
  });

  renderOrder();
})();
