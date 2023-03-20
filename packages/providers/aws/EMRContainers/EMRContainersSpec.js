const assert = require("assert");
const { tap, pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const {
  EMRContainersVirtualCluster,
} = require("./EMRContainersVirtualCluster");

const GROUP = "EMRContainers";

const tagsKey = "tags";

const compare = compareAws({ tagsKey, key: "key" });

module.exports = pipe([
  () => [
    //
    EMRContainersVirtualCluster({}),
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
