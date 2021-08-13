const { assign, map } = require("rubico");
const { isOurMinionObject } = require("../AwsCommon");
const { EcrRepository } = require("./EcrRepository");
//const { EcrRepositoryPolicy } = require("./EcrRepositoryPolicy");

const GROUP = "ecr";

const isOurMinion = ({ live, config }) =>
  isOurMinionObject({ tags: live.tags, config });

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Repository",
      Client: EcrRepository,
      isOurMinion,
    },
    // {
    //   type: "RepositoryPolicy",
    //   dependsOn: ["ecr::Repository"],
    //   Client: EcrRepositoryPolicy,
    //   isOurMinion,
    // },
  ]);
