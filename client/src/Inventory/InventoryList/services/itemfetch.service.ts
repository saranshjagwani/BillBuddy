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

  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch shop");
  }

  return data;
}

export async function updateItem(itemId: string, updates: any) {
  const token = await getAuthToken();

  const res = await fetch(`${API_URL}/items/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || "Failed to update item");
  }

  return data;
}

export async function deleteItem(itemId: string, shopId: string) {
  const token = await getAuthToken();

  const res = await fetch(`${API_URL}/items/${itemId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ shopId }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || "Failed to delete item");
  }

  return data;
}
