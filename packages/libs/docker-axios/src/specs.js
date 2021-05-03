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
  list: {
    method: "get",
    url: ({ filters }) => `/containers/json?filters=${filters}`, //TODO
  },
});
