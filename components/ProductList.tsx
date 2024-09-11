import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import {
  downloadPreview,
  fetchProductPreviews,
  fetchProducts,
  getAllOfItems,
  setAllOfItems,
  threeDownload,
} from "../providers/StorageProvider";
import { TouchableOpacity } from "react-native-gesture-handler";

const ProductList = ({ navigation }) => {
  const [products, setProducts] = useState(null);
  const [previews, setPrewiews] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      const fetchedProducts = await fetchProducts();
      const fetchedProductPreviews = await fetchProductPreviews();

      const productNames = fetchedProducts.map((product) => product.name);

      setAllOfItems(productNames);

      const previewPromises = fetchedProductPreviews.map((product) =>
        downloadPreview(product.name)
      );

      Promise.all(previewPromises)
        .then(async (previews: any) => {
          setPrewiews(previews);
          try {
            const productsDatabase = await getAllOfItems();
            setProducts(productsDatabase);
          } catch (error) {
            console.error("Error fetching products:", error);
          }
        })
        .catch((error) => {
          console.log("Error fetching previews:", error);
        });
    };
    loadProducts();
  }, []);

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("Product",{index: index, item: item})}
        style={styles.itemContainer}
      >
        <Image
          source={{
            uri: previews[index],
          }}
          style={styles.image}
        />
        <Text style={styles.text}>{item.name}</Text>
        <Text style={styles.price}>{item.price}TL</Text>
      </TouchableOpacity>
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
    alignItems: "center",
  },
  image: {
    width: 160,
    height: 160,
    flex: 1,
    margin: 12,
    borderRadius: 8,
  },
  text: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  price: {
    marginTop: 12,
    fontSize: 14,
    color: "gray",
  },
});

export default ProductList;
