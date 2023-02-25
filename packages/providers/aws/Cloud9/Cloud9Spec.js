const assert = require("assert");
const { tap, pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const GROUP = "Cloud9";

const tagsKey = "tags";
const compare = compareAws({ tagsKey, key: "key" });

const { Cloud9Environment } = require("./Cloud9Environment");
const {
  Cloud9EnvironmentMembership,
} = require("./Cloud9EnvironmentMembership");

module.exports = pipe([
  () => [
    //
    Cloud9Environment({ compare }),
    Cloud9EnvironmentMembership({ compare }),
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
