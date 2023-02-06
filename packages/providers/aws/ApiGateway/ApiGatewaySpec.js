const assert = require("assert");
const { pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

const {
  APIGatewayClientCertificate,
} = require("./APIGatewayClientCertificate");
const { RestApi } = require("./RestApi");
const { Stage } = require("./Stage");
const { Authorizer } = require("./Authorizer");
const { ApiKey } = require("./ApiKey");
const { Account } = require("./Account");
const { UsagePlan } = require("./UsagePlan");
const { UsagePlanKey } = require("./UsagePlanKey");

const GROUP = "APIGateway";
const tagsKey = "tags";
const compare = compareAws({ tagsKey });

module.exports = pipe([
  () => [
    Account({}),
    ApiKey({}),
    Authorizer({}),
    APIGatewayClientCertificate({}),
    RestApi({ compare }),
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
