import auth from "@react-native-firebase/auth";

const API_URL = "https://billbuddy-backend-bmsn.onrender.com";

export async function createItem(data: any) {
  console.log("API call to create item with data:", data);

  const user = auth().currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const token = await user.getIdToken();

  const res = await fetch(`${API_URL}/create-item`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const text = await res.text();

  if (!res.ok) {
    console.log("Server error:", text);
    throw new Error(text);
  }

  return JSON.parse(text);
}
