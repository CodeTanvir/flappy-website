// utils/getExchangeRates.js  (create this helper)
export async function getCNYtoBDTRate() {
  try {
    // Example using ExchangeRate-API (replace YOUR_KEY)
    const res = await fetch(
      " https://v6.exchangerate-api.com/v6/d2f2cbf0f972679e5893bd82/latest/CNY"
    );
    const data = await res.json();

    if (data.result !== "success") throw new Error("Rate fetch failed");

    const rateBDT = data.conversion_rates.BDT + 1;   // CNY → BDT direct
    if (!rateBDT) throw new Error("BDT rate not available");

    return rateBDT;
  } catch (err) {
    console.error("Exchange rate error:", err);
   
    return 18.80;
  }
}