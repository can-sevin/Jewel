import { getStorage, ref, listAll } from "firebase/storage";

export const fetchProducts = async () => {
  const storage = getStorage();

  // Create a reference under which you want to list
  const listRef = ref(storage, "models");

  // Find all the prefixes and items.
  const listResp = await listAll(listRef);

  return listResp.items;
};
