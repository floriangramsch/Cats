// import { fetchAll, fetchOne } from "./statistics.js";
import { formatDate } from "./Helper.js";

const createCatDiv = (cat) => {
  const catsDiv = document.getElementById("cats");
  const container = document.createElement("div");
  container.id = cat.id;
  container.classList.add("col-md-4", "mb-4");

  const card = document.createElement("div");
  card.id = "card" + cat.id;
  card.classList.add("card", "text-white", "bg-dark", "h-100");

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  const name = document.createElement("h5");
  name.classList.add("card-title");
  name.textContent = cat.name;

  const age = document.createElement("p");
  age.classList.add("card-text");
  const time = formatDate(new Date(cat.birth));
  age.textContent = `Geboren am: ${time}`;

  const weight = document.createElement("p");
  weight.classList.add("card-text");
  weight.textContent = `Wiegt: ${cat.body_weight} kg`;

  const feed = document.createElement("button");
  feed.textContent = `Füttere ${cat.name}`;
  feed.classList.add(
    "btn",
    "btn-primary",
    "mt-2",
    "btn-light",
    "black-font-color"
  );
  feed.addEventListener("click", () => {
    feedCat(cat);
  });

  // gone cats..
  if (cat.name === "Lucy") {
    const lucy = document.createElement("div");
    lucy.textContent = "R.I.P Lucy <3 1.4.2017-~Weihnachten 2023";
    const leonie = document.createElement("div");
    leonie.textContent = "R.I.P Leonie <3";
    const daisy = document.createElement("div");
    daisy.textContent = "Live well Daisy <3";
    const tmp = document.createElement("div");
    tmp.textContent = "Muddi, kannst du mir Daten nennen?";
    cardBody.appendChild(lucy);
    cardBody.appendChild(leonie);
    cardBody.appendChild(daisy);
    cardBody.appendChild(tmp);
  } else {
    cardBody.appendChild(name);
    cardBody.appendChild(age);
    cardBody.appendChild(weight);
    cardBody.appendChild(feed);
  }
  card.appendChild(cardBody);
  container.appendChild(card);
  catsDiv.appendChild(container);
};

export const fetchCats = async () => {
  try {
    const response = await fetch("/api/cats", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP-Fehler! Status: ${response.status}`);
    }

    const data = await response.json();
    let catsDiv = document.getElementById("cats");
    if (!catsDiv) {
      const content = document.getElementById("content");
      catsDiv = document.createElement("div");
      catsDiv.id = "cats";
      catsDiv.classList.add("row");
      const header = document.createElement("h1");
      header.classList.add("text-center", "mb-4");
      header.textContent = "Kodzies";
      content.appendChild(header);
      content.appendChild(catsDiv);
    }
    catsDiv.innerHTML = "";
    data.forEach((cat) => {
      createCatDiv(cat);
      ateToday(cat);
    });
  } catch (error) {
    console.error("Fetch-Fehler:", error);
  }
};

const uneat = async (ate_id, cat) => {
  const response = await fetch(`/api/uneat/${ate_id}`, {
    method: "DELETE",
  });
  if (response.ok) {
    ateToday(cat);
    console.log("Kodze gegodzt!");
  } else {
    console.error("Failed to delete ate record.");
  }
};

const ateToday = async (cat) => {
  try {
    const response = await fetch(`/api/ate/today/${cat.name}`);
    const ate = await response.json();

    let ateContainer = document.getElementById("ate" + cat.id);
    if (!ateContainer) {
      ateContainer = document.createElement("div");
      ateContainer.id = "ate" + cat.id;
      ateContainer.classList.add("list-group", "mt-2");
    } else {
      ateContainer.innerHTML = "";
    }

    ate.forEach((e) => {
      const ateDiv = document.createElement("li");
      ateDiv.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center",
        "text-white",
        "bg-dark"
      );
      ateDiv.style.borderColor = "#212529";
      let formattedTime = new Date(e.time);
      formattedTime = `${formattedTime.getHours()}:${formattedTime.getMinutes()} Uhr`;
      ateDiv.textContent = formattedTime;

      const button = document.createElement("button");
      button.textContent = `X`;
      // const icon = document.createElement("i");
      // icon.classList.add("fas", "fa-times");
      // button.appendChild(icon);
      button.classList.add("btn", "btn-danger", "btn-sm");
      button.addEventListener("click", () => {
        uneat(e.id, cat);
      });

      ateDiv.appendChild(button);
      ateContainer.appendChild(ateDiv);
    });

    const catsDiv = document.getElementById("card" + cat.id);
    catsDiv.appendChild(ateContainer);
  } catch (error) {
    console.error("AteToday-Fehler:", error);
  }
};

const feedCat = async (cat) => {
  try {
    const response = await fetch("/api/feed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cat: cat.name }),
    });
    if (response.ok) {
      ateToday(cat);
      ``;
      console.log("Katze erfolgreich gefüttert!");
    } else {
      throw new Error("Fehler beim Füttern der Katze.");
    }
  } catch (error) {
    console.error("FeedCat-Fehler:", error);
  }
};
