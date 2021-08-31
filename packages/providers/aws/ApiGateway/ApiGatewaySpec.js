const { pipe, assign, map } = require("rubico");
const { isOurMinionObject } = require("../AwsCommon");
const { RestApi, compareRestApi } = require("./RestApi");
const { Stage, compareStage } = require("./Stage");
const { Deployment, compareDeployment } = require("./Deployment");
const { Integration, compareIntegration } = require("./Integration");
const { DomainName, compareDomainName } = require("./DomainName");
const { Authorizer, compareAuthorizer } = require("./Authorizer");
const { Resource, compareResource } = require("./Resource");

const GROUP = "APIGateway";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "DomainName",
      dependsOn: ["ACM::Certificate"],
      Client: DomainName,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.tags, config }),
      compare: compareDomainName,
    },
    {
      type: "RestApi",
      Client: RestApi,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.tags, config }),
      compare: compareRestApi,
    },

    {
      type: "Stage",
      dependsOn: ["APIGateway::RestApi"],
      Client: Stage,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.tags, config }),
      compare: compareStage,
    },
    {
      type: "Resource",
      dependsOn: ["APIGateway::RestApi"],
      Client: Resource,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.tags, config }),
      compare: compareResource,
    },
    {
      type: "Authorizer",
      dependsOn: ["APIGateway::RestApi"],
      Client: Authorizer,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.tags, config }),
      compare: compareAuthorizer,
    },

    {
      type: "Integration",
      dependsOn: [
        "APIGateway::RestApi",
        "APIGateway::Resource",
        "Lambda::Function",
      ],
      Client: Integration,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.tags, config }),
      compare: compareIntegration,
    },
    {
      type: "Deployment",
      dependsOn: [
        "APIGateway::RestApi",
        "APIGateway::Stage",
        "APIGateway::Resource",
        "APIGateway::Integration",
      ],
      Client: Deployment,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.tags, config }),
      compare: compareDeployment,
    },
  ]);
