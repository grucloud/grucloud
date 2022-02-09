const path = require("path");
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Bucket",
    group: "storage",
    name: "grucloud-test",
    properties: ({}) => ({}),
  },
  {
    type: "Object",
    group: "storage",
    name: "myfile",
    properties: ({}) => ({
      path: "/",
      contentType: "text/json",
      source: path.join(process.cwd(), "package.json"),
    }),
    dependencies: () => ({
      bucket: "grucloud-test",
    }),
  },
];
