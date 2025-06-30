document.addEventListener("DOMContentLoaded", () => {
  async function fetchPaintings() {
    const redPaintings = [];
    const bluePaintings = [];

    // List of painting filenames (manually added or generated automatically if using a static site generator)
    const files = [
      "paintings/red-motion.md",
      "paintings/ocean-calm.md",
      // Add more here or auto-generate with a build step
    ];

    for (let file of files) {
      try {
        const res = await fetch(file);
        const text = await res.text();

        const frontmatter = parseFrontMatter(text);
        if (!frontmatter || !frontmatter.available) continue;

        if (frontmatter.category === "red") {
          redPaintings.push(frontmatter);
        } else if (frontmatter.category === "blue") {
          bluePaintings.push(frontmatter);
        }
      } catch (err) {
        console.error(`Error loading ${file}`, err);
      }
    }

    renderPaintings(redPaintings, ".red-category .items");
    renderPaintings(bluePaintings, ".blue-category .items");
  }

  function parseFrontMatter(mdText) {
    const match = /^---\n([\s\S]+?)\n---/.exec(mdText);
    if (!match) return null;

    const yaml = match[1];
    const data = {};
    yaml.split("\n").forEach(line => {
      const [key, ...rest] = line.split(":");
      const value = rest.join(":").trim();
      if (value === "true") data[key.trim()] = true;
      else if (value === "false") data[key.trim()] = false;
      else if (!isNaN(value)) data[key.trim()] = Number(value);
      else data[key.trim()] = value.replace(/^"|"$/g, "");
    });

    return data;
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

  fetchPaintings();

  const modal = document.getElementById("modal");
  const modalContent = document.querySelector(".modal-content");

  document.body.addEventListener("click", (e) => {
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
