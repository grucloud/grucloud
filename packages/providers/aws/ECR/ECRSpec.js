const { assign, map } = require("rubico");
const { isOurMinionFactory } = require("../AwsCommon");
const { EcrRepository } = require("./EcrRepository");
const { EcrRegistry, compareRegistry } = require("./EcrRegistry");

const GROUP = "ecr";

const isOurMinion = isOurMinionFactory({ tags: "tags" });

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Repository",
      Client: EcrRepository,
      isOurMinion,
    },
    {
      type: "Registry",
      Client: EcrRegistry,
      isOurMinion,
      compare: compareRegistry,
    },
  ]);