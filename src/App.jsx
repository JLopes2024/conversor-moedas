import {
  useEffect,
  useMemo,
  useState,
} from "react";

import CurrencySelect from "./components/CurrencySelect";

import "./App.css";

function App() {
  // Valor que será convertido
  const [amount, setAmount] = useState(1);

  // Moeda de origem
  const [fromCurrency, setFromCurrency] = useState("USD");

  // Moeda de destino
  const [toCurrency, setToCurrency] = useState("BRL");

  // Taxa recebida da API
  const [rate, setRate] = useState(null);

  // Informa se a requisição está acontecendo
  const [loading, setLoading] = useState(false);

  // Armazena uma possível mensagem de erro
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRate() {
      try {
        // Inicia o carregamento e limpa erros anteriores
        setLoading(true);
        setError("");

        const response = await fetch(
          `https://api.frankfurter.dev/v2/rate/${fromCurrency}/${toCurrency}`
        );

        // O fetch não lança erros automaticamente para status 404 ou 500
        if (!response.ok) {
          throw new Error(
            "Não foi possível buscar a cotação."
          );
        }

        const data = await response.json();

        // Guarda somente a taxa retornada pela API
        setRate(data.rate);
      } catch (error) {
        // Remove uma taxa antiga e apresenta o erro
        setRate(null);
        setError(error.message);
      } finally {
        // Executa tanto em caso de sucesso quanto de erro
        setLoading(false);
      }
    }

    fetchRate();
  }, [fromCurrency, toCurrency]);

  // Recalcula somente quando o valor ou a taxa mudar
  const convertedAmount = useMemo(() => {
    if (amount === "" || rate === null) {
      return null;
    }

    return Number(amount) * rate;
  }, [amount, rate]);

  return (
    <main>
      <h1>Conversor de moedas</h1>

      <section>
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(event) =>
            setAmount(event.target.value)
          }
          placeholder="Digite um valor"
        />

        <CurrencySelect
          value={fromCurrency}
          onChange={setFromCurrency}
        />

        <span>para</span>

        <CurrencySelect
          value={toCurrency}
          onChange={setToCurrency}
        />
      </section>

      {loading && <p>Buscando cotação...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <section>
          <p>
            {amount || 0} {fromCurrency} equivalem a
          </p>

          <strong>
            {convertedAmount === null
              ? "Digite um valor"
              : `${convertedAmount.toFixed(2)} ${toCurrency}`}
          </strong>

          <p>
            Taxa: 1 {fromCurrency} = {rate}{" "}
            {toCurrency}
          </p>
        </section>
      )}
    </main>
  );
}

export default App;