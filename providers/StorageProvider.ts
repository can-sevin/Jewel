import {
  getDatabase,
  set,
  ref as databaseRef,
  get,
  child,
} from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  listAll,
  getDownloadURL,
} from "firebase/storage";
import * as FileSystem from "expo-file-system";

export const BASE_URL_STORAGE = "https://gs://jewel-bbdfa.appspot.com/";

const database = getDatabase();

export const fetchProducts = async () => {
  const storage = getStorage();

  // Create a reference under which you want to list
  const listRef = storageRef(storage, "models");

  // Find all the prefixes and items.
  const listResp = await listAll(listRef);

  return listResp.items;
};

export const fetchProductPreviews = async () => {
  const storage = getStorage();

  // Create a reference under which you want to list
  const listRef = storageRef(storage, "previews");

  // Find all the prefixes and items.
  const listResp = await listAll(listRef);

  return listResp.items;
};

export const downloadPreview = (itemRef: string): Promise<string> => {
  const storage = getStorage();
  const starsRef = storageRef(storage, "previews/" + itemRef);

  return getDownloadURL(starsRef)
    .then((url) => {
      console.log("caaan", url);
      return url;
    })
    .catch((error) => {
      console.log("Error:", error);
      return "";
    });
};

export const threeDownload = async (itemRef: string): Promise<string> => {
  const storage = getStorage();
  const threeDRef = storageRef(storage, "models/" + itemRef);

  try {
    const url = await getDownloadURL(threeDRef);
    console.log("caaan 3D", url);

    // Download the file to local storage
    const localUri = `${FileSystem.documentDirectory}${itemRef}`;
    const downloadResumable = FileSystem.createDownloadResumable(url, localUri);

    const { uri } = await downloadResumable.downloadAsync();
    return uri;
  } catch (error) {
    console.log("Error:", error);
    return "";
  }
};

export const setAllOfItems = (productName: string[]) => {
  productName.map((product: string, index: number) => {
    set(databaseRef(database, "products/" + index.toString()), {
      name: product,
      price: "1000",
      type: "ring",
    })
      .then(() => {
        console.log("Data saved successfully!");
      })
      .catch((error) => {
        console.log("Data failed!");
      });
  });
};


export const getAllOfItems = (): Promise<any> => {
  const dbRef = databaseRef(getDatabase());

  return get(child(dbRef, `products/`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log("Data available", snapshot.val());
        return snapshot.val();
      } else {
        console.log("No data available");
        return null;
      }
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};
