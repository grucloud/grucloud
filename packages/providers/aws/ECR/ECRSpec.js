const { assign, map, pipe, omit } = require("rubico");
const { compare } = require("@grucloud/core/Common");

const { isOurMinionFactory } = require("../AwsCommon");
const { EcrRepository } = require("./EcrRepository");
const { EcrRegistry, compareRegistry } = require("./EcrRegistry");

const GROUP = "ECR";

const isOurMinion = isOurMinionFactory({ tags: "tags" });

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Repository",
      Client: EcrRepository,
      isOurMinion,
      compare: compare({
        filterLive: pipe([
          omit(["repositoryArn", "registryId", "repositoryUri", "createdAt"]),
        ]),
      }),
    },
    {
      type: "Registry",
      Client: EcrRegistry,
      isOurMinion,
      compare: compareRegistry,
    },
  ]);
