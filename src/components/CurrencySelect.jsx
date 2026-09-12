import { currencies } from "../data/currencies";

function CurrencySelect({
  value,
  onChange,
  excludedCurrency,
}) {
  return (
    <select
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
    >
      {currencies.map((currency) => (
        <option
          key={currency.code}
          value={currency.code}
          disabled={
            currency.code === excludedCurrency
          }
        >
          {currency.name}
        </option>
      ))}
    </select>
  );
}

export default CurrencySelect;