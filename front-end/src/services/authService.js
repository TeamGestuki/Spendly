const API_URL =
  "https://spendly-production-1793.up.railway.app/api/v1/auth";

const parseResponse = async (response) => {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    return { detail: text };
  }
};

export const registerUser = async (email, password) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await parseResponse(response);

  // Agrega logs para depuración
  console.log("REGISTER STATUS:", response.status);
  console.log("REGISTER DATA:", data);

  if (!response.ok) {
    throw new Error(
      data.detail || "Tuvimos un problema, intentalo más tarde."
    );
  }

  return data;
};

export const loginUser = async (email, password) => {
  const formData = new URLSearchParams();

  formData.append("username", email);
  formData.append("password", password);

  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type":
        "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  const data = await parseResponse(response);


  // Agrega logs para depuración
  console.log("LOGIN STATUS:", response.status);
  console.log("LOGIN DATA:", data);

  if (!response.ok) {
    throw new Error(
      data.detail || "Email o contraseña incorrectos"
    );
  }

  return data;
};