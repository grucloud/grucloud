// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  { type: "Index", group: "ResourceExplorer2" },
  {
    type: "View",
    group: "ResourceExplorer2",
    properties: ({}) => ({
      Filters: {
        FilterString: "",
      },
      IncludedProperties: [
        {
          Name: "tags",
        },
      ],
      ViewName: "all-resources",
    }),
    dependencies: ({}) => ({
      index: "default",
    }),
  },
  {
    type: "View",
    group: "ResourceExplorer2",
    properties: ({}) => ({
      Filters: {
        FilterString: "",
      },
      IncludedProperties: [
        {
          Name: "tags",
        },
      ],
      ViewName: "my-view",
    }),
    dependencies: ({}) => ({
      index: "default",
    }),
  },
];
