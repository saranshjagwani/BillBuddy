import auth from "@react-native-firebase/auth";

export async function createShop(shopName: string) {

  const token = await auth().currentUser?.getIdToken();
  console.log("Token:", token);

  const res = await fetch(
    "http://192.168.29.151:3000/create-shop",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ shopName }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to create shop");
  }

  return res.json();
}