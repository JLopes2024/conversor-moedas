import { currencies } from "../data/currencies";

function CurrencySelect({ value, onChange }) {
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
        >
          {currency.name}
        </option>
      ))}
    </select>
  );
}

export default CurrencySelect;