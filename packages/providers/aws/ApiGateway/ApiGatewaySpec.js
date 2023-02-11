const assert = require("assert");
const { pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

const { Account } = require("./Account");
const { ApiKey } = require("./ApiKey");
const { APIGatewayAuthorizer } = require("./APIGatewayAuthorizer");

const {
  APIGatewayClientCertificate,
} = require("./APIGatewayClientCertificate");
const { RestApi } = require("./RestApi");
const { APIGatewayRestApiPolicy } = require("./APIGatewayRestApiPolicy");
const { Stage } = require("./Stage");
const { APIGatewayRequestValidator } = require("./APIGatewayRequestValidator");
const { UsagePlan } = require("./UsagePlan");
const { UsagePlanKey } = require("./UsagePlanKey");

const GROUP = "APIGateway";
const tagsKey = "tags";
const compare = compareAws({ tagsKey });

module.exports = pipe([
  () => [
    Account({}),
    ApiKey({}),
    APIGatewayAuthorizer({}),
    APIGatewayClientCertificate({}),
    RestApi({ compare }),
    APIGatewayRestApiPolicy({}),
    APIGatewayRequestValidator({ compare }),
    Stage({ compare }),
    UsagePlan({ compare }),
    UsagePlanKey({ compare }),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        tagsKey,
        compare: compare({}),
      }),
    ])
  ),
]);
