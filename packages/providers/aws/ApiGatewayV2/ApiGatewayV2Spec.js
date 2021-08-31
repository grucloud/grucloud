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

const GROUP = "ApiGatewayV2";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "DomainName",
      dependsOn: ["ACM::Certificate"],
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
      dependsOn: ["ApiGatewayV2::Api"],
      Client: Stage,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compareStage,
    },
    {
      type: "Authorizer",
      dependsOn: ["ApiGatewayV2::Api"],
      Client: Authorizer,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compareAuthorizer,
    },
    {
      type: "ApiMapping",
      dependsOn: [
        "ApiGatewayV2::Api",
        "ApiGatewayV2::Stage",
        "ApiGatewayV2::DomainName",
      ],
      Client: ApiMapping,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compareApiMapping,
    },
    {
      type: "Integration",
      dependsOn: ["ApiGatewayV2::Api", "Lambda::Function"],
      Client: Integration,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compareIntegration,
    },
    {
      type: "Route",
      dependsOn: ["ApiGatewayV2::Api", "ApiGatewayV2::Integration"],
      Client: Route,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compareRoute,
    },
    {
      type: "Deployment",
      dependsOn: [
        "ApiGatewayV2::Api",
        "ApiGatewayV2::Route",
        "ApiGatewayV2::Stage",
        "ApiGatewayV2::Integration",
      ],
      Client: Deployment,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compareDeployment,
    },
  ]);
