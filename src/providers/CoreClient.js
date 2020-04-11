const Axios = require("axios");

const noop = () => ({});
const identity = (x) => x;

module.exports = CoreClient = ({
  name,
  baseURL,
  onHeaders = noop,
  onResponse = identity,
}) => {
  const axios = Axios.create({
    baseURL: baseURL,
    timeout: 30e3,
    withCredentials: true,
    headers: { ...onHeaders(), "Content-Type": "application/json" },

    transformRequest: [
      (data, headers) => {
        console.log(
          "axios tx ",
          baseURL,
          //headers,
          JSON.stringify(data, null, 4)
        );
        return JSON.stringify(data);
      },
    ],
    transformResponse: [
      (data) => {
        console.log("axios rx ", baseURL, data);
        try {
          return JSON.parse(data);
        } catch (error) {
          console.error("axios rx could not parse data", data);
          return data;
        }
      },
      onResponse,
    ],
  });

  return {
    name,
    get: (name) => axios.request(`/${name}`, { method: "GET" }),
    destroy: (name) => axios.request(`/${name}`, { method: "DELETE" }),
    list: () => axios.request("/", { method: "GET" }),
    create: (data) => axios.request("/", { method: "POST", data }),
  };
};
