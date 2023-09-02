const API_URL = "http://localhost:5000";

export const onAuth = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();

    console.log(data.message);

    return true;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
};

export const onSignUp = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (response.status === 409) {
      throw new Error("Email is already in use");
    } else if (!response.ok) {
      throw new Error("Signup failed");
    }

    const data = await response.json();

    console.log(data.message);

    return true;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
};
