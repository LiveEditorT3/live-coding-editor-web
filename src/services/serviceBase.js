import Configuration from "../config";

const mapConfig = (method, body, config) => ({
  ...config,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: localStorage.getItem(Configuration.TOKEN_KEY),
    ...config?.headers,
  },
  method,
  body,
  credentials: "include",
});

const _fetch = async (path, config, baseUrl) => {
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
};

export class HttpClient {
  static Get = async (path, config, baseUrl = Configuration.BASE_URL) =>
    await _fetch(path, mapConfig("GET", null, config), baseUrl);
  static Post = async (path, data, config, baseUrl = Configuration.BASE_URL) =>
    await _fetch(
      path,
      mapConfig("POST", JSON.stringify(data), {
        headers: { "Access-Control-Allow-Origin": "*" },
      }),
      baseUrl
    );
  static Put = async (path, data, config, baseUrl = Configuration.BASE_URL) =>
    await _fetch(path, mapConfig("PUT", JSON.stringify(data), config), baseUrl);
  static Delete = async (
    path,
    data,
    config,
    baseUrl = Configuration.BASE_URL
  ) =>
    await _fetch(
      path,
      mapConfig("DELETE", data ? JSON.stringify(data) : null, config, baseUrl)
    );
}
