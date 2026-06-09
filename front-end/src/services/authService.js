
const API_URL =
  "https://spendly-production-1793.up.railway.app/api/v1/auth";

// Registrar usuario
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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Error al registrar usuario");
  }

  return data;
};

// Login usuario
export const loginUser = async (email, password) => {
  const formData = new URLSearchParams();

  // FastAPI OAuth2PasswordRequestForm
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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Este mail no esta registrado"
    );
  }

  return data;
};