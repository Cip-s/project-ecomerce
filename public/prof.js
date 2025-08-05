function showTab(tab) {
  const personalTab = document.getElementById("tab-personal");
  const ordersTab = document.getElementById("tab-orders");
  const personalSection = document.getElementById("section-personal");
  const ordersSection = document.getElementById("section-orders");

  if (tab === "personal") {
    personalTab.classList.add("border-black", "text-black");
    personalTab.classList.remove("text-gray-600");
    ordersTab.classList.remove("border-black");
    ordersTab.classList.add("text-gray-600");

    personalSection.classList.remove("hidden");
    ordersSection.classList.add("hidden");
  } else {
    ordersTab.classList.add("border-black", "text-black");
    ordersTab.classList.remove("text-gray-600");
    personalTab.classList.remove("border-black");
    personalTab.classList.add("text-gray-600");

    ordersSection.classList.remove("hidden");
    personalSection.classList.add("hidden");
  }
}
