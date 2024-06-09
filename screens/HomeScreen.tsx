import React from "react";
import { StyleSheet, Text } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../config";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import ProductList from "../components/ProductList";

export const HomeScreen = () => {
  const [fontsLoaded, fontError] = useFonts({
    Bold: require("../assets/fonts/Poppins-Bold.ttf"),
    Medium: require("../assets/fonts/Poppins-Medium.ttf"),
    Light: require("../assets/fonts/Poppins-Light.ttf"),
    SemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  const handleLogout = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>List Of Products</Text>
      {/* <Button title="Sign Out" onPress={handleLogout} /> */}
      <ProductList />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    textAlign: "center",
    alignContent: "center",
    marginTop: 32,
  },
});
