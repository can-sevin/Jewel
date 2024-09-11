import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Canvas } from "@react-three/fiber/native";
import useControls from "r3f-native-orbitcontrols";
import { Suspense } from "react";
import { useGLTF } from "@react-three/drei/native";
import { threeDownload } from "../providers/StorageProvider";
import * as FileSystem from "expo-file-system";

export const ProductScreen = ({ navigation, route }) => {
  const [OrbitControls, events] = useControls();
  const [glbSource, setGlbSource] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { index, item } = route.params;

  useEffect(() => {
    const fetchModel = async () => {
      setIsLoading(true);
      const downloadGlb = await threeDownload(item.name);
      setGlbSource(downloadGlb);
      setIsLoading(false);
    };

    fetchModel();
  }, [item.name]);

  function Model(props: any) {
    const gltf = useGLTF(glbSource ? glbSource : "");
    return <primitive {...props} object={gltf.scene} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Product Detail</Text>
      <View style={{ flex: 1 }} {...events}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading 3D Model...</Text>
          </View>
        ) : (
          <Canvas>
            <OrbitControls enablePan={false} enableZoom={true} />
            <directionalLight position={[1, 0, 0]} args={["white", 5]} />
            <directionalLight position={[-1, 0, 0]} args={["white", 5]} />
            <directionalLight position={[0, 0, 1]} args={["white", 5]} />
            <directionalLight position={[0, 0, -1]} args={["white", 5]} />
            <directionalLight position={[0, 1, 0]} args={["white", 5]} />
            <directionalLight position={[0, -1, 0]} args={["white", 5]} />
            <Suspense fallback={null}>
              {glbSource && (
                <group scale={30} dispose={null} position={[0, 0, 0]}>
                  <Model />
                </group>
              )}
            </Suspense>
          </Canvas>
        )}
      </View>
      <View style={styles.detail_view}>
        <View>
          <Text style={styles.detail_text}>Name:{item.name}</Text>
          <Text style={styles.detail_text}>Price:{item.price}</Text>
          <Text style={styles.detail_text}>Type:{item.type}</Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL("whatsapp://send?text=Merhaba,&phone=5437468463")
          }
        >
          <Image
            style={styles.wp_icon}
            source={require("../assets/whatsapp.png")}
          />
        </TouchableOpacity>
      </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  detail_view: {
    flex: 1,
    borderRadius: 16,
    maxHeight: 120,
    backgroundColor: "#eab676",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  detail_text: {
    fontSize: 18,
    color: "#f5f5f5",
    marginTop: 8,
  },
  wp_icon: {
    height: 32,
    width: 32,
  },
});
