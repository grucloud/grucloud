const assert = require("assert");
const pkg = require("./package.json");
module.exports = ({ region }) => {
  assert(region);
  return {
    projectName: "ex-vpc-mod",
    vpc: {
      vpc: { Tags: [] },
      subnets: {
        publicTags: [],
        privateTags: [],
      },
    },
  };
};
