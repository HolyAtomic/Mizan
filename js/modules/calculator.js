export function calculateValue(weight, price) {
    if (!Number.isFinite(weight) || weight <= 0) {
        throw new Error("INVALID_WEIGHT");
    }

    if (!Number.isFinite(price) || price <= 0) {
        throw new Error("INVALID_PRICE");
    }

    return weight * price;
}
