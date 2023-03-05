const assert = require("assert");
const { pipe, map, tap, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

const { ApiGatewayV2Api } = require("./Api");
const { ApiGatewayV2ApiMapping } = require("./ApiMapping");
const { ApiGatewayV2Authorizer } = require("./Authorizer");
const { ApiGatewayV2Deployment } = require("./Deployment");
const { ApiGatewayV2DomainName } = require("./DomainName");
const { ApiGatewayV2Integration } = require("./Integration");
const {
  ApiGatewayV2IntegrationResponse,
} = require("./ApiGatewayV2IntegrationResponse");
const { ApiGatewayV2Route } = require("./Route");
const { ApiGatewayV2RouteResponse } = require("./ApiGatewayV2RouteResponse");
const { ApiGatewayV2Stage } = require("./Stage");
const { ApiGatewayV2VpcLink } = require("./ApiGatewayV2VpcLink");

const GROUP = "ApiGatewayV2";

const compare = compareAws({});

module.exports = pipe([
  () => [
    ApiGatewayV2Api({ compare }),
    ApiGatewayV2ApiMapping({ compare }),
    ApiGatewayV2Authorizer({ compare }),
    ApiGatewayV2Deployment({ compare }),
    ApiGatewayV2DomainName({ compare }),
    ApiGatewayV2Integration({ compare }),
    ApiGatewayV2IntegrationResponse({ compare }),
    ApiGatewayV2Route({ compare }),
    ApiGatewayV2RouteResponse({ compare }),
    ApiGatewayV2Stage({ compare }),
    ApiGatewayV2VpcLink({ compare }),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
      }),
    ])
  ),
]);
