const { default: axios } = require("axios");

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api`,
});

export { api };
