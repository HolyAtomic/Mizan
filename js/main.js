import '../css/style.css'

import { getPrices } from "./services/api.js";
import { calculateValue } from "./modules/calculator.js";
import { saveCurrency, getCurrency } from "./modules/storage.js";

import {
    showLoading,
    showSuccess,
    showError,
    displayPrices
} from "./ui/ui.js";

import { loadHistory, setHistoryCurrency } from "./modules/history.js";

const currencySelect = document.querySelector("#currency");
const refreshButton = document.querySelector("#refresh-btn");
const retryButton = document.querySelector("#retry-btn");

const calculatorForm = document.querySelector("#calculator-form");
const weightInput = document.querySelector("#weight");
const metalSelect = document.querySelector("#metal");

const weightError = document.querySelector("#weight-error");
const estimatedValue = document.querySelector("#estimated-value");

const requestLog = document.querySelector("#request-log");
const emptyLog = document.querySelector("#empty-log");

let currentPrices = [];
let isLoading = false;
let lastRequestTime = 0;
let lastCurrency = getCurrency();

currencySelect.value = lastCurrency;


// Request Logger
function addLog(url, status, duration) {
    const row = document.createElement("tr");

    const methodCell = document.createElement("td");
    methodCell.className = "p-3";
    methodCell.textContent = "GET";

    const urlCell = document.createElement("td");
    urlCell.className = "p-3";
    urlCell.textContent = url;

    const statusCell = document.createElement("td");
    statusCell.className = "p-3";
    statusCell.textContent = status;

    const durationCell = document.createElement("td");
    durationCell.className = "p-3";
    durationCell.textContent = `${duration} ms`;

    row.append(
        methodCell,
        urlCell,
        statusCell,
        durationCell
    );

    requestLog.prepend(row);

    emptyLog.classList.add("hidden");

    if (requestLog.children.length > 10) {
        requestLog.lastElementChild.remove();
    }
}


// Load Prices
async function loadPrices() {
    if (isLoading) {
        return;
    }

    isLoading = true;

    refreshButton.disabled = true;
    retryButton.disabled = true;

    showLoading();

    const startTime = Date.now();
    const url = `https://xaus.com/api/v1/spot?currency=${currencySelect.value}&unit=gram&compact=1`;

    try {
        const result = await getPrices(currencySelect.value);

        currentPrices = result.prices;

        displayPrices(currentPrices);

        setHistoryCurrency(result.fxRate);

        showSuccess();

        lastCurrency = currencySelect.value;
        lastRequestTime = Date.now();

        addLog(url, 200, Date.now() - startTime);

    } catch (error) {
        console.error(error);

        let message = "Une erreur est survenue.";

        if (!navigator.onLine) {
            message = "Vous êtes hors ligne.";
        } else if (error.message === "QUOTA") {
            message = "Quota dépassé. Réessayez après une minute.";
        } else if (error.message === "INVALID_DATA") {
            message = "Les données reçues sont invalides.";
        } else if (error.message.startsWith("HTTP_")) {
            message = `Erreur serveur : ${error.message}`;
        } else if (error instanceof SyntaxError) {
            message = "La réponse JSON est illisible.";
        } else if (error instanceof TypeError) {
            message = "Erreur de connexion.";
        }

        showError(message);

        const status = error.message.startsWith("HTTP_")
            ? error.message.replace("HTTP_", "")
            : error.message === "QUOTA" ? "429" : "Erreur";

        addLog(url, status, Date.now() - startTime);

    } finally {
        isLoading = false;

        refreshButton.disabled = false;
        retryButton.disabled = false;
    }
}


// Currency
currencySelect.addEventListener("change", function () {
    saveCurrency(currencySelect.value);
    loadPrices();
});


// Refresh
refreshButton.addEventListener("click", function () {
    if (Date.now() - lastRequestTime < 60000) {
        showError("Veuillez attendre 60 secondes avant le prochain rafraîchissement.");
        return;
    }

    loadPrices();
});


// Retry
retryButton.addEventListener("click", loadPrices);


// Calculator
calculatorForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const weight = Number(weightInput.value);
    const selectedMetal = metalSelect.value;

    const metal = currentPrices.find(function (item) {
        return item.symbol === selectedMetal;
    });

    weightError.textContent = "";
    estimatedValue.textContent = "--";

    if (weightInput.value.trim() === "" ||
        !Number.isFinite(weight) ||
        weight <= 0) {

        weightError.textContent =
            "Veuillez saisir un poids valide.";

        return;
    }

    if (!metal) {
        weightError.textContent =
            "Le prix du métal est indisponible.";

        return;
    }

    try {
        const result = calculateValue(weight, metal.price);

        estimatedValue.textContent =
            `${result.toLocaleString("fr-FR", {
                maximumFractionDigits: 2
            })} ${metal.currency}`;

    } catch (error) {
        weightError.textContent =
            "Impossible de calculer la valeur.";
    }
});


// Start application
async function startApp() {
    await loadPrices();
    await loadHistory();
}

startApp();
