const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  register(data: { email: string; password: string; name: string }) {
    return request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  login(email: string, password: string) {
    return request<{ access_token: string; token_type: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  getMe() {
    return request<import("@/types").User>("/api/users/me");
  },

  updateProfile(data: Record<string, unknown>) {
    return request<import("@/types").User>("/api/users/me/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  getProducts(params?: Record<string, string>) {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<import("@/types").Product[]>(`/api/products/${qs}`);
  },

  getProduct(id: number) {
    return request<import("@/types").Product>(`/api/products/${id}`);
  },

  getSports() {
    return request<string[]>("/api/products/sports");
  },

  getRecommendations(data: import("@/types").QuestionnaireData) {
    return request<import("@/types").Recommendation[]>("/api/recommendations/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
