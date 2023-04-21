const assert = require("assert");
const { tap, pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const {
  EMRBlockPublicAccessConfiguration,
} = require("./EMRBlockPublicAccessConfiguration");
const { EMRCluster } = require("./EMRCluster");
const { EMRStudio } = require("./EMRStudio");
const { EMRStudioSessionMapping } = require("./EMRStudioSessionMapping");

const GROUP = "EMR";
const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

module.exports = pipe([
  () => [
    //
    EMRBlockPublicAccessConfiguration({}),
    EMRCluster({}),
    EMRStudio({}),
    EMRStudioSessionMapping({}),
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
