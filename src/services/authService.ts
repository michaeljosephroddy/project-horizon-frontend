const API_BASE_URL = 'http://192.168.49.1:9095'; // Adjust to your backend

export const authService = {
  register: async (email: string, password: string, name: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Registration failed');
    }

    return res.json();
  },

  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Login failed');
    }

    return res.json(); // { token, user }
  },
};
