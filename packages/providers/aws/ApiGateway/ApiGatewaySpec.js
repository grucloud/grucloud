const { pipe, assign, map } = require("rubico");
const { isOurMinionObject } = require("../AwsCommon");
const { Api, compareApi } = require("./Api");
const { Stage, compareStage } = require("./Stage");
const { Deployment, compareDeployment } = require("./Deployment");
const { Route, compareRoute } = require("./Route");
const { Integration, compareIntegration } = require("./Integration");
const { DomainName, compareDomainName } = require("./DomainName");

const GROUP = "apigateway";

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
      dependsOn: ["apigateway::Api"],
      Client: Stage,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compareStage,
    },
    {
      type: "Integration",
      dependsOn: ["apigateway::Api", "lambda::Function"],
      Client: Integration,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compareIntegration,
    },
    {
      type: "Route",
      dependsOn: ["apigateway::Api", "apigateway::Integration"],
      Client: Route,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compareRoute,
    },
    {
      type: "Deployment",
      dependsOn: [
        "apigateway::Api",
        "apigateway::Route",
        "apigateway::Stage",
        "apigateway::Integration",
      ],
      Client: Deployment,
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
      compare: compareDeployment,
    },
  ]);
