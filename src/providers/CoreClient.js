const Axios = require("axios");

const noop = () => ({});
const identity = (x) => x;

module.exports = CoreClient = ({
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
        //console.log("axios tx ", baseURL, JSON.stringify(data, null, 4));
        return JSON.stringify(data);
      },
    ],
    transformResponse: [
      (data) => {
        console.log(
          "axios rx ",
          baseURL,
          JSON.stringify(JSON.parse(data), null, 4)
        );
        return JSON.parse(data);
      },
      onResponse,
    ],
  });

  return {
    get: (name) => axios.request(`/${name}`, { method: "GET" }),
    destroy: (name) => axios.request(`/${name}`, { method: "DELETE" }),
    list: () => axios.request("/", { method: "GET" }),
    create: (data) => axios.request("/", { method: "POST", data }),
  };
};
