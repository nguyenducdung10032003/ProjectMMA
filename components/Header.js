import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Header() {
  const { setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    setUser(null);
    Alert.alert("Đã đăng xuất", "Bạn đã được đăng xuất.");
  };

  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/logo-ruby-chan.jpg')} // Đường dẫn đến file logo
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Ruby Chan</Text>
      </View>
      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.logout}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 80,
    paddingTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f7f9fc",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  logout: {
    fontSize: 14,
    color: "#ef4444",
    fontWeight: "500",
  },
});