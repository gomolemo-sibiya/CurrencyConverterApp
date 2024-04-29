// Conversion.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Picker,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import List from "./List";
import axios from 'axios';
import { AntDesign } from "@expo/vector-icons";

const Conversion = () => {
  const [exchangeRates, setExchangeRates] = useState({});
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const apiKey = 'lNIDQnVKwD7FjrC6Yfye41sXU11LxWNn'; // You need to sign up for an API key at exchangeratesapi.io
        const response = await axios.get(`https://api.exchangeratesapi.io/latest`, {
          params: {
            access_key: apiKey,
            base: fromCurrency,
            symbols: toCurrency
          }
        });

        if (!response.data || response.data.error) {
          throw new Error(`Failed to fetch exchange rates: ${response.data.error}`);
        }
  
        setExchangeRates(response.data.rates);
      } catch (error) {
        console.error('Error fetching exchange rates:', error.message);
      }
    };
  
    if (fromCurrency && toCurrency) {
      fetchExchangeRates();
    }
  }, [fromCurrency, toCurrency]);
  

  const handleFromCurrencySelect = (currency) => {
    setFromCurrency(currency);
  };

  const handleToCurrencySelect = (currency) => {
    setToCurrency(currency);
  };

  const handleValueChange = (value) => {
    setFromValue(value);
    if (value && fromCurrency && toCurrency && exchangeRates[toCurrency]) {
      const convertedValue = (parseFloat(value) / exchangeRates[fromCurrency]) * exchangeRates[toCurrency];
      setToValue(convertedValue.toFixed(2));
    } else {
      setToValue('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.currency}>
          <Text style={styles.currencyText}>Currency</Text>
        </View>
        <View style={styles.dateTime}>
          <Text style={styles.dateTimeText}>Date and Time</Text>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.box}>
          <TextInput
            style={styles.input}
            placeholder="0"
            placeholderTextColor="#4C4D4F"
            value={fromValue}
            onChangeText={handleValueChange}
            keyboardType="numeric"
          />
          <View style={styles.listContainer}>
            <List onSelectCurrency={handleFromCurrencySelect} />
          </View>
        </View>
        <AntDesign name="retweet" size={24} color="black" />
        <View style={styles.box}>
          <TextInput
            style={styles.input}
            placeholder="0"
            placeholderTextColor="#4C4D4F"
            value={toValue}
            editable={false}
          />
          <View style={styles.listContainer}>
            <List onSelectCurrency={handleToCurrencySelect} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#212125",
    borderColor: "#4C4D4F",
    borderWidth: 0.5,
    borderRadius: 10,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderWidth: 0.5,
    borderColor: "#4C4D4F",
  },
  currencyText: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "bold",
  },
  dateTimeText: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "200",
  },
  currency: {
    flex: 1,
  },
  dateTime: {
    flex: 1,
    alignItems: "flex-end",
  },
  body: {
    borderColor: "#4C4D4F",
    padding: 20,
    paddingTop: 30,
    paddingBottom: 30,
  },
  box: {
    backgroundColor: "#1E1E21",
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: "#4C4D4F",
    padding: 10,
    borderRadius: 20,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    marginRight: 5,
    paddingHorizontal: 10,
  },
  listContainer: {
    flex: 1,
  },
});

export default Conversion;
