import auth from "@react-native-firebase/auth";

const API_URL = "http://192.168.29.151:3000";



/**
 * Get Firebase ID token safely
 */
async function getAuthToken(): Promise<string> {
  const user = auth().currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const token = await user.getIdToken();
  return token;
}



export async function fetchShop() {
  const token = await getAuthToken();

  const res = await fetch(`${API_URL}/get-items`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  console.log("data hai ji",data);
  
  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch shop");
  }

  return data;
}