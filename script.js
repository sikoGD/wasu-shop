document.addEventListener("DOMContentLoaded", () => {
    const redPaintings = [
      {
        title: "Red Motion",
        size: "40×50 cm",
        price: 200,
        img: "https://pbs.twimg.com/media/Gjr0Hh1aAAAz9RG?format=jpg&name=large",
        available: true,
      },
      {
        title: "Crimson Dream",
        size: "60×70 cm",
        price: 500,
        img: "https://pbs.twimg.com/media/GqWYet7aEAAV1zK?format=jpg&name=large",
        available: false,
      },
    ];
  
    const bluePaintings = [
      {
        title: "Ocean Calm",
        size: "30×40 cm",
        price: 150,
        img: "https://pbs.twimg.com/media/GqEq43tbMAAgbwn?format=jpg&name=large",
        available: true,
      },
      {
        title: "Deep Sea",
        size: "50×60 cm",
        price: 100,
        img: "https://pbs.twimg.com/media/GnD4wmzaEAAuSsE?format=jpg&name=large",
        available: false,
      },
    ];
  
    function renderPaintings(paintings, containerSelector) {
      const container = document.querySelector(containerSelector);
      if (!container) return;
  
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
  
    renderPaintings(redPaintings, ".red-category .items");
    renderPaintings(bluePaintings, ".blue-category .items");
  
    document.body.addEventListener("click", (e) => {
      const modal = document.getElementById("modal");
  
      // Handle Buy Now click
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
  
      // Handle close
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
  });
  
  window.addEventListener("scroll", () => {
    document.body.classList.toggle("scrolled", window.scrollY > 80);
  });