const Configuration = {
    BASE_URL: `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/`,
    GH_CLIENT_ID: process.env.REACT_APP_GITHUB_CLIENT_ID,
    GH_REDIRECT_URL: `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_CALLBACK_PORT}`,
    PATH: '/',
}

export default Configuration