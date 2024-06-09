import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { fetchProducts } from "../providers/StorageProvider";
import { getDatabase, ref, set } from "firebase/database";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const database = getDatabase();

  useEffect(() => {
    const loadProducts = async () => {
      const fetchedProducts = await fetchProducts();
      const productNames = fetchedProducts.map((product) => product.name);

      productNames.map((product) =>
        set(ref(database, "products/" + product.name), {
          name: product.name,
          price: 1000,
          type: "ring",
        })
      );

      setProducts(fetchedProducts);
    };
    loadProducts();
  }, []);

  const renderItem = ({ item }) => {
    console.log("item", item);

    return (
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <Text style={styles.text}>{item.name}</Text>
        <Text style={styles.price}>{item.price}</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  itemContainer: {
    flex: 1,
    margin: 10,
    alignItems: "center",
  },
  image: {
    width: Dimensions.get("window").width / 2 - 30,
    height: Dimensions.get("window").width / 2 - 30,
    borderRadius: 10,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  price: {
    marginTop: 5,
    fontSize: 14,
    color: "gray",
  },
});

export default ProductList;
