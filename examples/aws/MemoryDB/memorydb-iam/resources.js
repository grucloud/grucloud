// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "User",
    group: "MemoryDB",
    properties: ({}) => ({
      AccessString: "on ~* &* +@all",
      AuthenticationMode: {
        Type: "iam",
      },
      Name: "my-user",
    }),
  },
];
