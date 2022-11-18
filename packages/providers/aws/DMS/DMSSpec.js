const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html

//const { DMSCertificate } = require("./DMSCertificate");
//const { DMSEndpoint } = require("./DMSEndpoint");
//const { DMSEventSubscription } = require("./DMSEventSubscription");
//const { DMSReplicationInstance } = require("./DMSReplicationInstance");
//const { DMSReplicationSubnetGroup } = require("./DMSReplicationSubnetGroup");
//const { DMSReplicationTask } = require("./DMSReplicationTask");

const GROUP = "DMS";

const compare = compareAws({});

module.exports = pipe([
  () => [
    // DMSCertificate({})
    // DMSEndpoint({})
    // DMSEventSubscription({})
    // DMSReplicationInstance({})
    // DMSReplicationSubnetGroup({})
    // DMSReplicationTask({})
  ],
  map(createAwsService),
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
    })
  ),
]);
