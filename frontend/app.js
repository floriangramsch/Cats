const createCatDiv = (cat) => {
  const catsDiv = document.getElementById("cats");
  const container = document.createElement("div");
  container.id = cat.id;

  const name = document.createElement("div");
  const age = document.createElement("div");
  const birthDate = new Date(cat.birth);
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth()+1;
  const day = birthDate.getDate();
  const weight = document.createElement("div");
  name.textContent = cat.name;
  age.textContent = `Geboren am: ${day}.${month}.${year}`
  weight.textContent = "Wiegt: " + cat.body_weight + "kg";

  const feed = document.createElement("button");
  feed.textContent = `Fuettere ${cat.name}`;
  feed.addEventListener("click", () => {
    feedCat(cat.name);
  });

  container.appendChild(name);
  container.appendChild(age);
  container.appendChild(weight);
  if (cat.name !== "Lucy") container.appendChild(feed);
  catsDiv.appendChild(container);
};

const fetchCats = async () => {
  try {
    const response = await fetch("/api/cats", {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
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

const uneat = async (ate_id) => {
  const response = await fetch(`/api/uneat/${ate_id}`, {
    method: "DELETE",
  });
  if (response.ok) {
    window.location.reload();
    console.log("Kodze gegodzt!");
  } else {
    console.error("Failed to delete ate record.");
  }
};

const ateToday = async (cat) => {
  const response = await fetch(
    `/api/ate/today/${cat.name}`
  );
  const ate = await response.json();

  const ateContainer = document.createElement("div");
  ate.forEach((e) => {
    const ateDiv = document.createElement("div");
    ateDiv.id = e.id;
    let formattedTime = new Date(e.time);
    formattedTime = `${formattedTime.getHours()}:${formattedTime.getMinutes()}Uhr`;
    ateDiv.textContent = formattedTime;
    const button = document.createElement("button");
    button.textContent = `X`;
    button.addEventListener("click", () => {
      uneat(e.id);
    });

    ateDiv.appendChild(button);
    ateContainer.appendChild(ateDiv);
  });

  const catsDiv = document.getElementById(cat.id);
  catsDiv.appendChild(ateContainer);
};

const feedCat = async (cat) => {
  const response = await fetch("/api/feed", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cat: cat }),
  });
  if (response.ok) {
    window.location.reload();
    console.log("Cat fed successfully!");
  } else {
    console.error("Failed to feed cat.");
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
