const API_URL = 'http://localhost:3000';
const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('vellux_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  post: async (endpoint: string, body: any) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    
    // Verifica se a resposta é realmente um JSON antes de tentar ler
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.erro || 'Ocorreu um erro na requisição');
      }
      return data;
    } else {
      throw new Error(`Falha no Servidor (Status ${response.status}). A rota pode estar incorreta.`);
    }
  },
  
  get: async (endpoint: string) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.erro || 'Ocorreu um erro na requisição');
      }
      return data;
    } else {
      throw new Error(`Falha no Servidor (Status ${response.status}). A rota pode estar incorreta.`);
    }
  }
};