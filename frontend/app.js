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
  const birthDate = new Date(cat.birth);
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  age.textContent = `Geboren am: ${day}.${month}.${year}`;

  const weight = document.createElement("p");
  weight.classList.add("card-text");
  weight.textContent = `Wiegt: ${cat.body_weight} kg`;

  const feed = document.createElement("button");
  feed.textContent = `Füttere ${cat.name}`;
  feed.classList.add("btn", "btn-primary", "mt-2", "btn-light", "black-font-color");
  feed.addEventListener("click", () => {
    feedCat(cat);
  });

  cardBody.appendChild(name);
  cardBody.appendChild(age);
  cardBody.appendChild(weight);
  if (cat.name !== "Lucy") cardBody.appendChild(feed);
  card.appendChild(cardBody);
  container.appendChild(card);
  catsDiv.appendChild(container);
};

const fetchCats = async () => {
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
    const catsDiv = document.getElementById("cats");
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
      ateToday(cat);``
      console.log("Katze erfolgreich gefüttert!");
    } else {
      throw new Error("Fehler beim Füttern der Katze.");
    }
  } catch (error) {
    console.error("FeedCat-Fehler:", error);
  }
};

fetchCats();

// document.addEventListener('DOMContentLoaded', () => {
//   fetch('/api/cats')
//     .then(response => response.json())
//     .then(data => {
//       console.log(data);
//     })
//     .catch(error => {
//       console.error('Error:', error);
//     });
// });

// window.onload = fetchCats;
