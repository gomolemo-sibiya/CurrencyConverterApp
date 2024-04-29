import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { Feather } from "@expo/vector-icons";
import Conversion from "../Components/Conversion";

const Converter = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Converter</Text>
        <Feather
          name="log-in"
          size={20}
          color="#fff"
          style={styles.logoutIcon}
          onPress={() => FIREBASE_AUTH.signOut()}
        />
      </View>
      <View style={styles.section}>
        <Conversion />
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Footer</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1E",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 25,
  },
  headerText: {
    color: "#F35D4D",
    fontSize: 16,
    fontWeight: 'bold'
  },
  logoutIcon: {
    fontWeight: '200'
  },
  section: {
    flex: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1, 
    borderColor: "#4C4D4F",
    padding: 25,
  },
  footer: {
    padding: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    color: "white",
    fontSize: 20,
  },
});

export default Converter;