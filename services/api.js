async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Ошибка запроса");
  }

  return response.json();
}

export const employeeService = {
  list: (params = {}) => request(`/api/employees?${new URLSearchParams(params)}`),
  get: (id) => request(`/api/employees/${id}`),
  create: (data) => request("/api/employees", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/api/employees/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/api/employees/${id}`, { method: "DELETE" })
};

export const taskService = {
  list: (params = {}) => request(`/api/tasks?${new URLSearchParams(params)}`),
  get: (id) => request(`/api/tasks/${id}`),
  create: (data) => request("/api/tasks", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/api/tasks/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/api/tasks/${id}`, { method: "DELETE" })
};

export const dashboardService = {
  get: () => request("/api/dashboard")
};
