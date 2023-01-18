const assert = require("assert");
const { tap, pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");
const {
  GlobalAcceleratorAccelerator,
} = require("./GlobalAcceleratorAccelerator");
const {
  GlobalAcceleratorEndpointGroup,
} = require("./GlobalAcceleratorEndpointGroup");

const { GlobalAcceleratorListener } = require("./GlobalAcceleratorListener");

const GROUP = "GlobalAccelerator";
const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

module.exports = pipe([
  () => [
    GlobalAcceleratorAccelerator({}),
    GlobalAcceleratorEndpointGroup({}),
    GlobalAcceleratorListener({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
        tagsKey,
      }),
    ])
  ),
]);
