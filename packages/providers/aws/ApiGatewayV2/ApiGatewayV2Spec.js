const { pipe, assign, map } = require("rubico");
const { isOurMinionObject } = require("../AwsCommon");
const { Api, compareApi } = require("./Api");
const { Stage, compareStage } = require("./Stage");
const { Deployment, compareDeployment } = require("./Deployment");
const { Route, compareRoute } = require("./Route");
const { Integration, compareIntegration } = require("./Integration");
const { DomainName, compareDomainName } = require("./DomainName");
const { ApiMapping, compareApiMapping } = require("./ApiMapping");
const { Authorizer, compareAuthorizer } = require("./Authorizer");

const GROUP = "apiGatewayV2";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "DomainName",
      dependsOn: ["acm::Certificate"],
      Client: DomainName,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compareDomainName,
    },
    {
      type: "Api",
      Client: Api,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compareApi,
    },

    {
      type: "Stage",
      dependsOn: ["apiGatewayV2::Api"],
      Client: Stage,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compareStage,
    },
    {
      type: "Authorizer",
      dependsOn: ["apiGatewayV2::Api"],
      Client: Authorizer,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compareAuthorizer,
    },
    {
      type: "ApiMapping",
      dependsOn: [
        "apiGatewayV2::Api",
        "apiGatewayV2::Stage",
        "apiGatewayV2::DomainName",
      ],
      Client: ApiMapping,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compareApiMapping,
    },
    {
      type: "Integration",
      dependsOn: ["apiGatewayV2::Api", "lambda::Function"],
      Client: Integration,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compareIntegration,
    },
    {
      type: "Route",
      dependsOn: ["apiGatewayV2::Api", "apiGatewayV2::Integration"],
      Client: Route,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compareRoute,
    },
    {
      type: "Deployment",
      dependsOn: [
        "apiGatewayV2::Api",
        "apiGatewayV2::Route",
        "apiGatewayV2::Stage",
        "apiGatewayV2::Integration",
      ],
      Client: Deployment,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compareDeployment,
    },
  ]);
