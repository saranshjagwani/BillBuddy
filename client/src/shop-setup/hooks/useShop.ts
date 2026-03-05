import { useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export default function useShop() {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = auth().currentUser?.uid;
    console.log("Fetching shop for user:", uid);

    if (!uid) return;

    firestore()
      .collection("shops")
      .doc(uid)
      .get()
      .then((doc:any) => {
        if (doc.exists) {
          setShop(doc.data());
        }
        setLoading(false);
      });
  }, []);

  return { shop, loading };
}