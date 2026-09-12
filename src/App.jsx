import {useEffect, useMemo,  useState} from "react";
import CurrencySelect from "./components/CurrencySelect";
import { getExchangeRate } from "./services/exchangeApi";

import "./App.css";

const HISTORY_STORAGE_KEY =
  "currency-converter-history";

function App() {
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] =
    useState("USD");
  const [toCurrency, setToCurrency] =
    useState("BRL");

  const [rate, setRate] = useState(null);
  const [rateDate, setRateDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Recupera o histórico salvo no navegador.
  const [history, setHistory] = useState(() => {
    try {
      const savedHistory = localStorage.getItem(
        HISTORY_STORAGE_KEY
      );

      return savedHistory
        ? JSON.parse(savedHistory)
        : [];
    } catch {
      return [];
    }
  });

  // Busca uma nova taxa quando uma das moedas mudar.
  useEffect(() => {
    let ignoreResponse = false;

    async function fetchRate() {
      try {
        setLoading(true);
        setError("");

        const data = await getExchangeRate(
          fromCurrency,
          toCurrency
        );

        if (!ignoreResponse) {
          setRate(data.rate);
          setRateDate(data.date);
        }
      } catch (requestError) {
        if (!ignoreResponse) {
          setRate(null);
          setRateDate("");

          setError(
            requestError.message ||
              "Não foi possível buscar a cotação."
          );
        }
      } finally {
        if (!ignoreResponse) {
          setLoading(false);
        }
      }
    }

    fetchRate();

    // Impede respostas antigas de atualizarem a tela.
    return () => {
      ignoreResponse = true;
    };
  }, [fromCurrency, toCurrency]);

  // Salva o histórico sempre que ele for alterado.
  useEffect(() => {
    try {
      localStorage.setItem(
        HISTORY_STORAGE_KEY,
        JSON.stringify(history)
      );
    } catch {
      // O aplicativo continua funcionando mesmo se
      // o armazenamento estiver indisponível.
    }
  }, [history]);

  // Calcula o resultado apenas quando os dados mudam.
  const convertedAmount = useMemo(() => {
    if (
      amount === "" ||
      rate === null ||
      Number.isNaN(Number(amount))
    ) {
      return null;
    }

    return Number(amount) * rate;
  }, [amount, rate]);

  // Formata o resultado conforme a moeda de destino.
  const formattedResult = useMemo(() => {
    if (convertedAmount === null) {
      return null;
    }

    return formatCurrency(
      convertedAmount,
      toCurrency
    );
  }, [convertedAmount, toCurrency]);

  // Formata a taxa sem ocupar espaço excessivo.
  const formattedRate =
    rate === null
      ? ""
      : new Intl.NumberFormat("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 6,
        }).format(rate);

  function handleAmountChange(event) {
    const value = event.target.value;

    if (value === "") {
      setAmount("");
      return;
    }

    // Impede valores negativos, mas preserva os decimais.
    if (Number(value) >= 0) {
      setAmount(value);
    }
  }

  function swapCurrencies() {
    const previousFromCurrency = fromCurrency;

    setFromCurrency(toCurrency);
    setToCurrency(previousFromCurrency);
  }

  function saveConversion() {
    if (
      convertedAmount === null ||
      loading ||
      error
    ) {
      return;
    }

    const conversion = {
      id:
        crypto.randomUUID?.() ??
        `${Date.now()}-${Math.random()}`,
      amount: Number(amount),
      fromCurrency,
      toCurrency,
      result: convertedAmount,
      rate,
      date: rateDate,
    };

    // Guarda no máximo as dez conversões mais recentes.
    setHistory((currentHistory) => [
      conversion,
      ...currentHistory,
    ].slice(0, 10));
  }

  function clearHistory() {
    setHistory([]);
  }

  return (
    <main className="app">
      <section className="converter-card">
        <header className="app-header">
          <div className="app-icon" aria-hidden="true">
            $
          </div>

          <div>
            <p className="eyebrow">
              COTAÇÃO INTERNACIONAL
            </p>

            <h1>Conversor de moedas</h1>

            <p className="subtitle">
              Converta valores utilizando taxas
              atualizadas de câmbio.
            </p>
          </div>
        </header>

        <div className="converter-form">
          <div className="field amount-field">
            <label htmlFor="amount">
              Valor
            </label>

            <input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0,00"
            />
          </div>

          <div className="currency-grid">
            <div className="field">
              <label htmlFor="from-currency">
                De
              </label>

              <CurrencySelect
                id="from-currency"
                value={fromCurrency}
                onChange={setFromCurrency}
                excludedCurrency={toCurrency}
              />
            </div>

            <button
              className="swap-button"
              type="button"
              onClick={swapCurrencies}
              aria-label="Inverter moedas"
              title="Inverter moedas"
            >
              ⇄
            </button>

            <div className="field">
              <label htmlFor="to-currency">
                Para
              </label>

              <CurrencySelect
                id="to-currency"
                value={toCurrency}
                onChange={setToCurrency}
                excludedCurrency={fromCurrency}
              />
            </div>
          </div>
        </div>

        <div
          className={`result-card ${
            error ? "result-card--error" : ""
          }`}
        >
          {loading && (
            <div
              className="loading"
              role="status"
            >
              <span className="spinner" />
              Buscando cotação...
            </div>
          )}

          {!loading && error && (
            <>
              <p className="error-message" role="alert">
                {error}
              </p>

              <p className="error-help">
                Verifique sua conexão e altere uma das
                moedas para tentar novamente.
              </p>
            </>
          )}

          {!loading && !error && (
            <>
              <p className="result-label">
                {amount || 0} {fromCurrency} equivalem a
              </p>

              <strong className="result-value">
                {formattedResult ??
                  "Digite um valor"}
              </strong>

              {rate !== null && (
                <p className="rate">
                  1 {fromCurrency} = {formattedRate}{" "}
                  {toCurrency}
                </p>
              )}

              {rateDate && (
                <p className="update-date">
                  Cotação de {rateDate}
                </p>
              )}

              <button
                className="save-button"
                type="button"
                onClick={saveConversion}
                disabled={convertedAmount === null}
              >
                Salvar no histórico
              </button>
            </>
          )}
        </div>
      </section>

      <section className="history-card">
        <div className="history-header">
          <div>
            <p className="eyebrow">
              CONVERSÕES RECENTES
            </p>

            <h2>Histórico</h2>
          </div>

          {history.length > 0 && (
            <button
              className="clear-button"
              type="button"
              onClick={clearHistory}
            >
              Limpar
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="empty-history">
            <span aria-hidden="true">↗</span>

            <p>
              As conversões salvas aparecerão aqui.
            </p>
          </div>
        ) : (
          <ul className="history-list">
            {history.map((conversion) => (
              <li
                className="history-item"
                key={conversion.id}
              >
                <div>
                  <span className="history-origin">
                    {formatCurrency(
                      conversion.amount,
                      conversion.fromCurrency
                    )}
                  </span>

                  <span className="history-arrow">
                    →
                  </span>

                  <strong>
                    {formatCurrency(
                      conversion.result,
                      conversion.toCurrency
                    )}
                  </strong>
                </div>

                <small>
                  {conversion.fromCurrency}/
                  {conversion.toCurrency}
                  {conversion.date &&
                    ` • ${conversion.date}`}
                </small>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer>
        Taxas de referência fornecidas pela
        Frankfurter API.
      </footer>
    </main>
  );
}

function formatCurrency(value, currency) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(value);
}

export default App;