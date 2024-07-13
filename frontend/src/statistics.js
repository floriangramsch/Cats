import { formatDateTime } from "./Helper.js";

const fetchAll = () => {
  fetch("/api/ate")
    .then((response) => response.json())
    .then((data) => {
      const content = document.getElementById("content");
      // Leere den Inhalt, bevor du neue Daten hinzufügst
      content.innerHTML = "";

      // Erstelle ein Container für das Grid
      const ateContainer = document.createElement("div");
      ateContainer.classList.add("container", "mt-4");

      // Erstelle eine Zeile für das Grid
      const row = document.createElement("div");
      row.classList.add("row", "g-3");

      // Optionales Debugging
      const debug = false;
      data.slice(0, debug ? 10 : data.length).forEach((item) => {
        const col = document.createElement("div");
        col.classList.add("col-md-4", "col-lg-3", "col-xl-2");

        // Erstelle eine Karte für jeden Eintrag
        const card = document.createElement("div");
        card.classList.add("card", "bg-dark", "text-light", "h-100");

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        const cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        cardTitle.textContent = item.cat_name;

        const cardText = document.createElement("p");
        cardText.classList.add("card-text");
        cardText.textContent = formatDateTime(new Date(item.time));

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        card.appendChild(cardBody);
        col.appendChild(card);
        row.appendChild(col);
      });

      ateContainer.appendChild(row);
      content.appendChild(ateContainer);
    });
};

const fetchOne = () => {};

export { fetchAll, fetchOne };
