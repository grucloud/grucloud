const querystring = require("querystring");

exports.containersSpec = () => ({
  create: {
    method: "post",
    url: ({ name }) => `/containers/create?name=${name}`,
  },
  start: {
    method: "post",
    url: ({ name }) => `/containers/${name}/start`,
  },
  wait: {
    method: "post",
    url: ({ name }) => `/containers/${name}/wait`,
  },
  delete: {
    method: "delete",
    url: ({ name }) => `/containers/${name}`,
  },
  get: {
    method: "get",
    url: ({ id, options = {} }) =>
      `/containers/${id}/json?${querystring.stringify(options)}`,
  },
  list: {
    method: "get",
    url: (options = {}) => `/containers/json?${querystring.stringify(options)}`,
  },
  log: {
    method: "get",
    url: ({ name, options }) =>
      `/containers/${name}/logs?${querystring.stringify(options)}`,
    responseType: "stream",
  },
});

exports.imagesSpec = () => ({
  pull: {
    method: "post",
    url: ({ image }) => `/images/create?fromImage=${image}`,
  },
});
