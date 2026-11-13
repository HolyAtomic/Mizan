
const API_URL = "https://xaus.com/api/v1";
const GRAMS_PER_OUNCE = 31.1034768;

function normalizeCurrency(currency) {
    return String(currency || "USD").trim().toUpperCase();
}

function getChartRange(period) {
    const normalizedPeriod = Number(period);

    if (normalizedPeriod <= 7) {
        return "7d";
    }

    if (normalizedPeriod <= 30) {
        return "30d";
    }

    return "1mo";
}

export async function getPrices(currency) {
    const safeCurrency = normalizeCurrency(currency);
    const url = `${API_URL}/spot?currency=${safeCurrency}&unit=gram&compact=1`;

    const response = await fetch(url);

    if (response.status === 429) {
        throw new Error("QUOTA");
    }

    if (!response.ok) {
        throw new Error(`HTTP_${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.xau || typeof data.xau !== "object" ||
        !Number.isFinite(data.xau.price) ||
        data.silver_usd_oz == null ||
        !Number.isFinite(data.fx_rate)) {
        throw new Error("INVALID_DATA");
    }

    const silverPrice =
        (Number(data.silver_usd_oz) * Number(data.fx_rate)) / GRAMS_PER_OUNCE;

    if (!Number.isFinite(silverPrice)) {
        throw new Error("INVALID_DATA");
    }

    const prices = [
        {
            symbol: "XAU",
            name: "Or",
            price: data.xau.price,
            currency: data.xau.currency,
            updatedAt: data.price_as_of || data.updated_at,
            stale: Boolean(data.stale)
        },
        {
            symbol: "XAG",
            name: "Argent",
            price: silverPrice,
            currency: data.xau.currency,
            updatedAt: data.updated_at,
            stale: Boolean(data.silver_source?.includes("last known good"))
        }
    ];

    return {
        prices: prices,
        fxRate: Number(data.fx_rate),
        dataState: data.data_state
    };
}


export async function getHistory(metal, period, fxRate) {
    const symbol = metal === "XAU" ? "xau" : "silver";
    const range = getChartRange(period);
    const effectiveFxRate = Number(fxRate) || 1;
    const url = `${API_URL}/chart?symbol=${symbol}&range=${range}&interval=1d`;

    const response = await fetch(url);

    if (response.status === 429) {
        throw new Error("QUOTA");
    }

    if (!response.ok) {
        throw new Error(`HTTP_${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data.points)) {
        throw new Error("INVALID_DATA");
    }

    const points = data.points.slice(-Number(period || 7));

    return points.map(function (point) {
        const value = Number(point?.c);

        if (!Number.isFinite(value)) {
            return null;
        }

        return {
            date: new Date(Number(point.t) * 1000),
            price: (value * effectiveFxRate) / GRAMS_PER_OUNCE
        };
    }).filter(Boolean);
}
