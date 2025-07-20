const ENV = import.meta.env.MODE === "production" ? "production" : "development";

const config = {
  development: {
    backendUrl: "http://localhost:8080/api/v1/dalle",
  },
  production: {
    backendUrl: "https://devswag.onrender.com/api/v1/dalle",
  },
};

export const backendUrl = config[ENV].backendUrl;
export default backendUrl;
