const path = require("path");

exports.createResources = () => [
  {
    type: "Certificate",
    group: "ACM",
    properties: () => ({
      privateKeyFile: path.resolve(__dirname, "pki/server.key"),
      certificateFile: path.resolve(__dirname, "pki/server.crt"),
      certificateChainFile: path.resolve(__dirname, "pki/ca.crt"),
    }),
  },
];
