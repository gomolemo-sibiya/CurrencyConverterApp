import React, { useState, useEffect } from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import useAxios from "../Hooks/useAxios";

const List = ({ onSelectCurrency }) => {
  const [data, loaded, error] = useAxios("https://restcountries.com/v3.1/all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);

  useEffect(() => {
    if (data) {
      const countriesWithCurrencies = data.filter(item => "currencies" in item);
      const sortedCountries = countriesWithCurrencies.sort((a, b) =>
        a.name.common.localeCompare(b.name.common)
      );
      const groupedCountries = {};
      sortedCountries.forEach(item => {
        const initialLetter = item.name.common.charAt(0).toUpperCase();
        if (!(initialLetter in groupedCountries)) {
          groupedCountries[initialLetter] = [];
        }
        groupedCountries[initialLetter].push({
          flag: item.flag,
          currency: Object.keys(item.currencies)[0],
          name: item.name.common,
        });
      });
      setFilteredCountries(Object.entries(groupedCountries));
    }
  }, [data]);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const selectCountry = (country) => {
    onSelectCurrency(country.currency);
    setSelectedItem(`${country.flag} ${country.currency}`);
    toggleModal();
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === "") {
      const sortedCountries = data.filter(item => "currencies" in item).sort((a, b) =>
        a.name.common.localeCompare(b.name.common)
      );
      const groupedCountries = {};
      sortedCountries.forEach(item => {
        const initialLetter = item.name.common.charAt(0).toUpperCase();
        if (!(initialLetter in groupedCountries)) {
          groupedCountries[initialLetter] = [];
        }
        groupedCountries[initialLetter].push({
          flag: item.flag,
          currency: Object.keys(item.currencies)[0],
          name: item.name.common,
        });
      });
      setFilteredCountries(Object.entries(groupedCountries));
    } else {
      const filtered = data.filter(item =>
        item.name.common.toLowerCase().includes(query.toLowerCase()) && "currencies" in item
      );
      const sortedFilteredCountries = filtered.sort((a, b) =>
        a.name.common.localeCompare(b.name.common)
      );
      const groupedFilteredCountries = {};
      sortedFilteredCountries.forEach(item => {
        const initialLetter = item.name.common.charAt(0).toUpperCase();
        if (!(initialLetter in groupedFilteredCountries)) {
          groupedFilteredCountries[initialLetter] = [];
        }
        groupedFilteredCountries[initialLetter].push({
          flag: item.flag,
          currency: Object.keys(item.currencies)[0],
          name: item.name.common,
        });
      });
      setFilteredCountries(Object.entries(groupedFilteredCountries));
    }
  };

  if (error) {
    return <Text>Something went wrong!</Text>;
  }

  return (
    <>
      <TouchableOpacity style={styles.dropdown} onPress={toggleModal}>
        <View style={styles.dropdownText}>
          <Text style={styles.dropdownTxt}>
            {selectedItem ? selectedItem : "Open Dropdown"}
          </Text>
          <Feather
            name="chevron-down"
            size={16}
            color="#4C4D4F"
            style={styles.dropdownIcon}
          />
        </View>
      </TouchableOpacity>
      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.modalBackground} onPress={toggleModal}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeIcon} onPress={toggleModal}>
              <Feather name="x" size={24} color="black" />
            </TouchableOpacity>
            <TextInput
              style={styles.searchBar}
              placeholder="Search country..."
              onChangeText={handleSearch}
              value={searchQuery}
            />
            <ScrollView contentContainerStyle={styles.scrollView}>
              {filteredCountries.map(([initial, countries]) => (
                <View key={initial}>
                  <Text style={styles.initial}>{initial}</Text>
                  {countries.map((country, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.item}
                      onPress={() => selectCountry(country)}
                    >
                      <Text style={styles.itemText}>{`${country.flag} ${country.currency} - ${country.name}`}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    borderWidth: 0.5,
    borderColor: "#4C4D4F",
    padding: 10,
    borderRadius: 10,
  },
  dropdownText: {
    color: "#FFFFFF",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dropdownTxt: {
    color: "#FFFFFF",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 2,
    elevation: 5,
    maxHeight: "90%",
    overflow: "hidden",
  },
  closeIcon: {
    display: 'flex',
    justifyContent: 'space-between',
    marginLeft: 'auto',
    marginHorizontal: 10,
    marginTop: 10
  },
  searchBar: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  scrollView: {
    flexGrow: 1,
  },
  initial: {
    fontWeight: "bold",
    marginVertical: 5,
    marginLeft: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
  },
});

export default List;
