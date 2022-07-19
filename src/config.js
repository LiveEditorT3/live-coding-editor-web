const Configuration = {
  BASE_URL: process.env.REACT_APP_API_URL,
  GH_CLIENT_ID: process.env.REACT_APP_GITHUB_CLIENT_ID,
  TINYLICIOUS_DOMAIN: process.env.REACT_APP_TINYLICIOUS_DOMAIN || "localhost",
  TINYLICIOUS_PORT: process.env.REACT_APP_TINYLICIOUS_HOST || "7070",
  TOKEN_KEY: "x-token",
};

export default Configuration;
