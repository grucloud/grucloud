const assert = require("assert");
const { pipe, tap, assign, map } = require("rubico");

const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");
const { CloudFrontDistribution } = require("./CloudFrontDistribution");
const {
  CloudFrontOriginAccessIdentity,
} = require("./CloudFrontOriginAccessIdentity");
const { CloudFrontCachePolicy } = require("./CloudFrontCachePolicy");
const { CloudFrontFunction } = require("./CloudFrontFunction");

const { CloudFrontKeyGroup } = require("./CloudFrontKeyGroup");
const {
  CloudFrontMonitoringSubscription,
} = require("./CloudFrontMonitoringSubscription");

const {
  CloudFrontOriginRequestPolicy,
} = require("./CloudFrontOriginRequestPolicy");

const { CloudFrontPublicKey } = require("./CloudFrontPublicKey");

const {
  CloudFrontResponseHeadersPolicy,
} = require("./CloudFrontResponseHeadersPolicy");
const { defaultsDeep } = require("rubico/x");

const GROUP = "CloudFront";
const compare = compareAws({});

module.exports = pipe([
  () => [
    CloudFrontCachePolicy({ compare }),
    CloudFrontDistribution({ compare }),
    CloudFrontFunction({ compare }),
    CloudFrontKeyGroup({ compare }),
    CloudFrontMonitoringSubscription({ compare }),
    CloudFrontOriginRequestPolicy({ compare }),
    CloudFrontOriginAccessIdentity({ compare }),
    CloudFrontPublicKey({ compare }),
    CloudFrontResponseHeadersPolicy({ compare }),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({ compare: compare({}) }),
      assign({ group: () => GROUP }),
    ])
  ),
]);
