
const priceCards = document.querySelector("#price-cards");
const requestStatus = document.querySelector("#request-status");
const errorMessage = document.querySelector("#error-message");
const errorText = document.querySelector("#error-text");
const lastUpdated = document.querySelector("#last-updated");

export function showLoading() {
    requestStatus.textContent = "Chargement des prix...";
    errorMessage.classList.add("hidden");
}

export function showSuccess() {
    requestStatus.textContent = "Les prix sont à jour.";
    errorMessage.classList.add("hidden");
}

export function showError(message) {
    requestStatus.textContent = "Une erreur est survenue.";
    errorText.textContent = message;
    errorMessage.classList.remove("hidden");
}

export function displayPrices(prices) {
    priceCards.replaceChildren();

    prices.forEach(function (metal) {
        const card = document.createElement("div");
        card.className = "bg-white rounded-xl shadow-sm p-6 border";

        const title = document.createElement("h3");
        title.className = "text-xl font-bold";
        title.textContent = metal.name;

        const price = document.createElement("p");
        price.className = "text-3xl font-bold text-yellow-600 mt-4";
        price.textContent =
            `${metal.price.toFixed(2)} ${metal.currency}`;

        const unit = document.createElement("p");
        unit.className = "text-gray-500 text-sm mt-2";
        unit.textContent = "Prix par gramme";

        const freshness = document.createElement("p");
        freshness.className = "text-sm mt-3";

        freshness.textContent = metal.stale
            ? "Prix précédent disponible"
            : "Prix actualisé";

        card.append(title, price, unit, freshness);
        priceCards.appendChild(card);
    });

    if (prices.length > 0) {
        lastUpdated.textContent =
            new Date(prices[0].updatedAt).toLocaleString("fr-FR");
    }
}

export function displayHistory(points) {
    const chart = document.querySelector("#history-chart");

    chart.replaceChildren();

    if (points.length === 0) {
        chart.textContent = "Aucune donnée disponible.";
        return;
    }

    const svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );

    svg.setAttribute("viewBox", "0 0 600 220");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "220");

    const prices = points.map(function (point) {
        return point.price;
    });

    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const difference = maxPrice - minPrice || 1;

    const coordinates = [];

    points.forEach(function (point, index) {
        let x = 20;

        if (points.length > 1) {
            x = 20 + (index / (points.length - 1)) * 560;
        }

        const y = 190 -
            ((point.price - minPrice) / difference) * 160;

        coordinates.push(`${x},${y}`);
    });

    const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polyline"
    );

    line.setAttribute("points", coordinates.join(" "));
    line.setAttribute("fill", "none");
    line.setAttribute("stroke", "#D6A52C");
    line.setAttribute("stroke-width", "3");

    svg.appendChild(line);
    chart.appendChild(svg);
}
