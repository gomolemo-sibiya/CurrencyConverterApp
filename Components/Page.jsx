import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';

const Home = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [showFromCurrencyModal, setShowFromCurrencyModal] = useState(false);
  const [showToCurrencyModal, setShowToCurrencyModal] = useState(false);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
      const { rates } = response.data;
      const currencyList = Object.keys(rates);
      setCurrencies(currencyList);
      setFromCurrency('USD');
      setToCurrency('EUR');
    } catch (error) {
      console.error('Error fetching currencies:', error);
    }
  };

  const convertCurrency = async () => {
    try {
      const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      const { rates } = response.data;
      const rate = rates[toCurrency];
      const converted = (amount * rate).toFixed(2);
      setConvertedAmount(converted);

      // Save transaction to MongoDB
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData) {
        const { token, user } = userData;
        const { _id: userId } = user;
        const transactionData = { userId, amount, currency_from: fromCurrency, currency_to: toCurrency };
        axios.post("http://10.0.0.9:5001/add-transaction", transactionData, { headers: { Authorization: `Bearer ${token}` }})
          .then((res) => {
            console.log(res.data);
          })
          .catch((error) => {
            console.error('Error saving transaction:', error);
          });
      }
    } catch (error) {
      console.error('Error converting currency:', error);
    }
  };

  const selectCurrency = (currency, isFromCurrency) => {
    if (isFromCurrency) {
      setFromCurrency(currency);
      setShowFromCurrencyModal(false);
    } else {
      setToCurrency(currency);
      setShowToCurrencyModal(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Currency Converter</Text>
      <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowFromCurrencyModal(true)}>
        <Text>{fromCurrency}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowToCurrencyModal(true)}>
        <Text>{toCurrency}</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount.toString()}
        onChangeText={(text) => setAmount(text)}
      />
      <Button title="Convert" onPress={convertCurrency} />
      <Text style={styles.result}>{convertedAmount}</Text>

      {/* From Currency Modal */}
      <Modal visible={showFromCurrencyModal} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Currency</Text>
            <TouchableOpacity onPress={() => setShowFromCurrencyModal(false)}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {currencies.map((currency, index) => (
              <TouchableOpacity key={index} style={styles.modalItem} onPress={() => selectCurrency(currency, true)}>
                <Text>{currency}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* To Currency Modal */}
      <Modal visible={showToCurrencyModal} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Currency</Text>
            <TouchableOpacity onPress={() => setShowToCurrencyModal(false)}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {currencies.map((currency, index) => (
              <TouchableOpacity key={index} style={styles.modalItem} onPress={() => selectCurrency(currency, false)}>
                <Text>{currency}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  result: {
    fontSize: 20,
    marginTop: 20,
  },
  dropdownButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    width: '100%',
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    alignItems: 'center',
  },
});

export default Home;
