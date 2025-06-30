document.addEventListener("DOMContentLoaded", () => {
  async function fetchPaintings() {
    const redPaintings = [];
    const bluePaintings = [];

    try {
      // Fetch all paintings data directly from index.json
      const res = await fetch("/paintings/index.json");
      const paintings = await res.json();

      for (let painting of paintings) {
        if (!painting.available) continue;

        if (painting.category === "red") {
          redPaintings.push(painting);
        } else if (painting.category === "blue") {
          bluePaintings.push(painting);
        }
      }

      renderPaintings(redPaintings, ".red-category .items");
      renderPaintings(bluePaintings, ".blue-category .items");
    } catch (err) {
      console.error("Error loading paintings", err);
    }
  }

  function renderPaintings(paintings, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    container.innerHTML = ""; // Clear previous items

    paintings.forEach((p) => {
      const item = document.createElement("div");
      item.className = "item";
      item.innerHTML = `
        <img src="${p.img}" alt="${p.title}">
        <h4>${p.title}</h4>
        <p>${p.size} – $${p.price}</p>
        <button ${p.available ? "" : "disabled"}>
          ${p.available ? "Request" : "Sold Out"}
        </button>
      `;
      container.appendChild(item);
    });
  }

  // Modal logic
  const modal = document.getElementById("modal");
  const modalContent = document.querySelector(".modal-content");

  document.body.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON" && e.target.textContent.trim() === "Request") {
      const item = e.target.closest(".item");
      if (!item) return;

      const title = item.querySelector("h4").innerText;
      const img = item.querySelector("img").src;
      const [size, price] = item.querySelector("p").innerText.split("–").map((s) => s.trim());

      document.getElementById("modal-title").innerText = title;
      document.getElementById("modal-img").src = img;
      document.getElementById("modal-size").innerText = size;
      document.getElementById("modal-price").innerText = price;

      document.getElementById("form-title").value = title;
      document.getElementById("form-size").value = size;
      document.getElementById("form-price").value = price;

      modal.classList.remove("hidden");
      modal.classList.add("show");
    }

    if (e.target.id === "close-modal") {
      modal.classList.remove("show");
      modal.classList.add("hidden");
    }
  });

  modal.addEventListener("click", (e) => {
    if (!modalContent.contains(e.target)) {
      modal.classList.add("hidden");
    }
  });

  fetchPaintings();
});

window.addEventListener("scroll", () => {
  document.body.classList.toggle("scrolled", window.scrollY > 80);
});
