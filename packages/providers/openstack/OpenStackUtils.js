const assert = require("assert");
const Axios = require("axios");

exports.OpenStackAuthorize = async ({ baseURL, username, password }) => {
  assert(username);
  assert(password);
  const axios = Axios.create({ baseURL });

  const payload = {
    auth: {
      identity: {
        methods: ["password"],
        password: {
          user: {
            name: username,
            domain: {
              name: "Default",
            },
            password,
          },
        },
      },
    },
  };

  const { headers, data } = await axios.post(`/auth/tokens`, payload);
  return headers["x-subject-token"];
};

exports.OpenStackListServices = async ({ baseURL, token }) => {
  assert(token);
  const axios = Axios.create({
    baseURL,
    headers: { "X-Auth-Token": token },
  });
  const { data } = await axios.get(`services`);
  return data;
};
