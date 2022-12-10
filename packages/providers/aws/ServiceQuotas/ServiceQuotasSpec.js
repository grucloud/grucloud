const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceQuotas.html

const { ServiceQuotasServiceQuota } = require("./ServiceQuotasServiceQuota");

const GROUP = "ServiceQuotas";

const compare = compareAws({});

module.exports = pipe([
  () => [ServiceQuotasServiceQuota({ compare })],
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
