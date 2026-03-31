import auth from "@react-native-firebase/auth";

const API_URL = "https://billbuddy-backend-bmsn.onrender.com";

export async function getCurrentBillNumberApi(): Promise<string> {
  const user = auth().currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const token = await user.getIdToken();

  const response = await fetch(`${API_URL}/bills/current-num`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const raw = await response.text();
  let data: any;
  try {
    data = JSON.parse(raw);
  } catch {
    // console.error("Server returned non-JSON response:", raw);
    throw new Error("Server error: unexpected response format");
  }

  if (!response.ok)
    throw new Error(data.error || "Failed to fetch bill number");

  return data.billNumber; // "BB-0001"
}
