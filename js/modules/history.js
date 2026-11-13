
import { getHistory } from "../services/api.js";
import { displayHistory } from "../ui/ui.js";

const historyMetal = document.querySelector("#history-metal");
const historyPeriod = document.querySelector("#history-period");
const historyStatus = document.querySelector("#history-status");

let currentFxRate = 1;

export function setHistoryCurrency(rate) {
    currentFxRate = rate;
}

export async function loadHistory() {
    historyStatus.textContent = "Chargement de l'historique...";

    try {
        const points = await getHistory(
            historyMetal.value,
            historyPeriod.value,
            currentFxRate
        );

        displayHistory(points);

        historyStatus.textContent =
            `${points.length} points affichés.`;

    } catch (error) {
        historyStatus.textContent =
            "Impossible de charger l'historique.";

        console.error(error);
    }
}

historyMetal.addEventListener("change", loadHistory);
historyPeriod.addEventListener("change", loadHistory);
