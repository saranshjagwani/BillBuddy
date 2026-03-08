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

/**
 * Create shop
 */
export async function createShop(shopName: string , category: string, hasStaff: boolean) {
  const token = await getAuthToken();

  const res = await fetch(`${API_URL}/create-shop`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ shopName , category, hasStaff }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to create shop");
  }

  return data;
}

/**
 * Fetch shop
 */
export async function fetchShop() {
  const token = await getAuthToken();

  const res = await fetch(`${API_URL}/get-shop`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch shop");
  }

  return data;
}