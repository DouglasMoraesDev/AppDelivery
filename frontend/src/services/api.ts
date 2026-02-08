const API_BASE_URL = '/api';

// Helper para fazer requisições autenticadas
const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('adminToken');
  
  // Se é token demo, retornar erro para ativar modo demo
  if (!token || token.includes('demo-token')) {
    throw new Error('No valid token - demo mode');
  }
  
  // Se body é FormData, não definir Content-Type (browser faz isso)
  const isFormData = options.body instanceof FormData;
  const headers = isFormData 
    ? { 'Authorization': `Bearer ${token}`, ...options.headers }
    : {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      };
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  // Se receber 401, limpar token inválido
  if (response.status === 401) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    throw new Error('Authentication failed');
  }
  
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  
  return response;
};

// Auth
export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

// Categorias
export const getCategories = async () => {
  const response = await authFetch(`${API_BASE_URL}/categories`);
  return response.json();
};

export const createCategory = async (data: { name: string; slug: string; icon?: string }) => {
  const response = await authFetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
};

export const updateCategory = async (id: string, data: { name: string; slug: string; icon?: string; active?: boolean }) => {
  const response = await authFetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.json();
};

export const deleteCategory = async (id: string) => {
  const response = await authFetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};

// Produtos
export const getProducts = async () => {
  const response = await authFetch(`${API_BASE_URL}/products`);
  return response.json();
};

export const createProduct = async (data: FormData | any) => {
  const response = await authFetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    body: data instanceof FormData ? data : JSON.stringify(data),
  });
  return response.json();
};

export const updateProduct = async (id: string, data: FormData | any) => {
  const response = await authFetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    body: data instanceof FormData ? data : JSON.stringify(data),
  });
  return response.json();
};

export const deleteProduct = async (id: string) => {
  const response = await authFetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};

// Pedidos
export const getOrders = async () => {
  const response = await authFetch(`${API_BASE_URL}/orders`);
  return response.json();
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const response = await authFetch(`${API_BASE_URL}/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return response.json();
};

// Configurações
export const getConfig = async () => {
  const response = await authFetch(`${API_BASE_URL}/config`);
  return response.json();
};

export const updateConfig = async (data: any) => {
  const response = await authFetch(`${API_BASE_URL}/config`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.json();
};

// Analytics
export const getDashboardStats = async () => {
  const response = await authFetch(`${API_BASE_URL}/analytics/dashboard`);
  return response.json();
};

export const getDetailedReport = async (period: string) => {
  const response = await authFetch(`${API_BASE_URL}/analytics/detailed-report?period=${period}`);
  return response.json();
};

// Cliente - APIs públicas
export const getPublicCategories = async (tenantSlug?: string) => {
  const url = tenantSlug ? `${API_BASE_URL}/public/${tenantSlug}/categories` : `${API_BASE_URL}/public/categories`;
  const response = await fetch(url);
  return response.json();
};

export const getPublicProducts = async (tenantSlug?: string) => {
  const url = tenantSlug ? `${API_BASE_URL}/public/${tenantSlug}/products` : `${API_BASE_URL}/public/products`;
  const response = await fetch(url);
  return response.json();
};

export const getPublicConfig = async (tenantSlug?: string) => {
  const url = tenantSlug ? `${API_BASE_URL}/public/${tenantSlug}/config` : `${API_BASE_URL}/public/config`;
  const response = await fetch(url);
  return response.json();
};