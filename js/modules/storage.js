export function saveCurrency(currency) {
    localStorage.setItem("currency", currency);
}

export function getCurrency() {
    return localStorage.getItem("currency") || "MAD";
}
