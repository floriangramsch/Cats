const createOldCatDiv = (cat) => {
  const cardText = document.createElement("p");
  cardText.classList.add("card-text");

  const adopted = formatDate(new Date(cat.adopted));
  const end = formatDate(new Date(cat.death));
  if (cat.deceased) {
    cardText.textContent = `R.I.P ${cat.name} <3 ${adopted}-${end}`;
  } else if (cat.gave_away) {
    cardText.textContent = `Farewell ${cat.name} <3 ${adopted}-${end}`;
  }
  cardText.textContent += ` (Born ${cat.birth})`;

  return cardText;
};

export const fetchOldCats = async () => {
  try {
    const response = await fetch("/api/old_cats", {
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

    const container = document.createElement("div");
    container.id = cat.id;
    container.classList.add("col-md-4", "mb-4");

    const card = document.createElement("div");
    card.id = "goneCats";
    card.classList.add("card", "text-white", "bg-dark", "h-100");

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const name = document.createElement("h5");
    name.classList.add("card-title");
    name.textContent = "Gone Kodzies <3";

    cardBody.append(name);

    data.forEach((cat) => {
      cardBody.append(createOldCatDiv(cat));
    });

    card.append(cardBody);
    container.append(card);
    catsDiv.append(container);
  } catch (error) {
    console.error("Fetch-Fehler:", error);
  }
};