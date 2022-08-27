const path = require("path");
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Bucket",
    group: "storage",
    properties: ({}) => ({
      name: "grucloud-test",
    }),
  },
  {
    type: "Object",
    group: "storage",
    properties: ({}) => ({
      name: "myfile",
      path: "/",
      contentType: "text/json",
      source: path.join(process.cwd(), "package.json"),
    }),
    dependencies: () => ({
      bucket: "grucloud-test",
    }),
  },
];
