/*** ENVIROMENT VARS ***/
const API_URL = import.meta.env.VITE_API_URL;

async function fetchData(endpoint) {
  const response = await fetch(`${API_URL}/${endpoint}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
}

async function postData(endpoint, payload) {
  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
}

async function putData(endpoint, payload) {
  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  
  // Verifica si la respuesta tiene contenido antes de intentar parsearla como JSON
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  return data;
}

export default { fetchData, postData, putData };