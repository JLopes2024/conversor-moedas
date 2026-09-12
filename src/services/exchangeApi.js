const BASE_URL = "https://api.frankfurter.dev/v2";

export async function getExchangeRate(
  fromCurrency,
  toCurrency
) {
  const response = await fetch(
    `${BASE_URL}/rate/${fromCurrency}/${toCurrency}`
  );

  if (!response.ok) {
    throw new Error(
      "Não foi possível buscar a cotação."
    );
  }

  return response.json();
}