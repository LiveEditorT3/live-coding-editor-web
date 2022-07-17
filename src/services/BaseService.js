import Configuration from "../config";

export class HttpClient {
  static async _fetch(path, config, baseUrl = Configuration.BASE_URL) {
    const res = await fetch(`${baseUrl}${path}`, config);

    if (res.status === 400 || !res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Request failed");
    }

    if (res.status === 401) {
      localStorage.removeItem(Configuration.TOKEN_KEY);
      window.location.replace(window.location.origin);
      throw new Error("Not authenticated");
    }

    if (res.status === 204 || res.status === 201) {
      return res;
    }

    return res.json();
  }

  static get(path, config) {
    return this._fetch(path, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: localStorage.getItem(Configuration.TOKEN_KEY),
      },
      ...config,
    });
  }

  static post(path, data, config) {
    return this._fetch(path, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: localStorage.getItem(Configuration.TOKEN_KEY),
      },
      body: JSON.stringify(data),
      ...config,
    });
  }

  static put(path, data, config) {
    return this._fetch(path, {
      method: "PUT",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: localStorage.getItem(Configuration.TOKEN_KEY),
      },
      body: JSON.stringify(data),
      ...config,
    });
  }

  static delete(path, data, config) {
    return this._fetch(path, {
      method: "DELETE",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: localStorage.getItem(Configuration.TOKEN_KEY),
      },
      body: data ? JSON.stringify(data) : null,
      ...config,
    });
  }
}
