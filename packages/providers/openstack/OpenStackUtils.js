const assert = require("assert");
const Axios = require("axios");

exports.OpenStackAuthorize = async ({
  baseURL,
  username,
  password,
  projectId,
  projectName,
}) => {
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
      scope: {
        project: {
          domain: { name: "Default" },
          id: projectId,
          name: projectName,
        },
      },
    },
  };

  const { headers, data } = await axios.post(`/auth/tokens`, payload);
  return headers["x-subject-token"];
};

//TODO
exports.OpenStackListServices = async ({ baseURL, token }) => {
  assert(token);
  const axios = Axios.create({
    baseURL,
    headers: { "X-Auth-Token": token },
  });
  const { data } = await axios.get(`services`);
  return data;
};
