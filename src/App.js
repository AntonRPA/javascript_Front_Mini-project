import { useEffect, useRef, useState } from 'react';
import { Block } from './Block';
import './index.scss';

function App() {
  const [fromCurrency, setFromCurrency] = useState('RUB');
  const [toCurrency, setToCurrency] = useState('USD');
  const [fromPrice, setFromPrice] = useState(0);
  const [toPrice, setToPrice] = useState(1);
  // const [rates, setRates] = useState({});
  const ratesRef = useRef({});

  useEffect(() => {
    fetch('https://www.cbr-xml-daily.ru/latest.js')
      .then((res) => res.json())
      .then((json) => {
        // setRates(json.rates);
        ratesRef.current = json.rates;
        onChangeToPrice(1);
      })
      .catch((err) => {
        console.warn(err);
        alert('Не удалось получить информацию');
      });
  }, []);

  //Вычесление валюты относительно левого поля
  const onChangeFromPrice = (value) => {
    const price = () => {
      if (fromCurrency === 'RUB') {
        return value;
      }
      return value / ratesRef.current[fromCurrency];
    };

    const result = () => {
      if (toCurrency === 'RUB' && fromCurrency === 'RUB') {
        return value;
      }
      if (toCurrency === 'RUB') {
        return (value / ratesRef.current[fromCurrency]).toFixed(3);
      }
      return (price() * ratesRef.current[toCurrency]).toFixed(3);
    };

    setFromPrice(value);
    setToPrice(result());
  };

  //Вычисление валюты относительно правого поля
  const onChangeToPrice = (value) => {
    console.log(value);
    const price1 = () => {
      if (toCurrency === 'RUB') {
        return value;
      }
      return value / ratesRef.current[toCurrency];
    };

    const result = () => {
      if (toCurrency === 'RUB' && fromCurrency === 'RUB') {
        return value;
      }
      if (fromCurrency === 'RUB') {
        return (value / ratesRef.current[toCurrency]).toFixed(3);
      }
      return (price1() * ratesRef.current[fromCurrency]).toFixed(3);
    };

    setFromPrice(result());
    setToPrice(value);
  };

  useEffect(() => {
    onChangeToPrice(toPrice);
  }, [fromCurrency]);

  useEffect(() => {
    onChangeFromPrice(fromPrice);
  }, [toCurrency]);

  return (
    <div className="App">
      <Block
        value={fromPrice}
        currency={fromCurrency}
        onChangeCurrency={setFromCurrency}
        onChangeValue={onChangeFromPrice}
      />
      <Block
        value={toPrice}
        currency={toCurrency}
        onChangeCurrency={setToCurrency}
        onChangeValue={onChangeToPrice}
      />
    </div>
  );
}

export default App;
