import { fetchCats } from "./Feeder.js";
import { fetchAll, renderChart } from "./statistics.js";

function navigateTo(path) {
  window.history.pushState({}, path, window.location.origin + path);
}

function renderContent(path) {
  const contentDiv = document.getElementById("content");
  if (path === "/zweiteSeite") {
    contentDiv.innerHTML = "";
    // fetchAll(); 
    renderChart();
  } else {
    contentDiv.innerHTML = "";
    fetchCats();
  }
}

window.navigateTo = navigateTo;
window.renderContent = renderContent;

window.onpopstate = () => {
  renderContent(window.location.pathname);
};

// Initiale Content-Anzeige beim Laden der Seite
document.addEventListener("DOMContentLoaded", () => {
  renderContent(window.location.pathname);

  const notifyBtn = document.getElementById("notifyBtn");
  if (notifyBtn) {
    notifyBtn.addEventListener("click", () => {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("KODZE!", {
            body: "Kodzt!",
          });
        }
      });
    });
  }
});
