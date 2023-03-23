const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StorageGateway.html

const { StorageGatewayCache } = require("./StorageGatewayCache");
const { StorageGatewayGateway } = require("./StorageGatewayGateway");
const { StorageGatewayTapePool } = require("./StorageGatewayTapePool");
const { StorageGatewayVolume } = require("./StorageGatewayVolume");

const GROUP = "StorageGateway";

const compare = compareAws({});

module.exports = pipe([
  () => [
    StorageGatewayCache({ compare }),
    StorageGatewayGateway({ compare }),
    StorageGatewayTapePool({ compare }),
    StorageGatewayVolume({ compare }),
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
