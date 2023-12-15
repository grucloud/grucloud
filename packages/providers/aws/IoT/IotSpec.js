const assert = require("assert");
const { map, pipe, tap, get, omit } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const { IotAuthorizer } = require("./IotAuthorizer");

const GROUP = "IoT";

const tagsKey = "tags";

const compare = compareAws({ tagsKey, key: "Key" });

module.exports = pipe([
  () => [
    //
    IotAuthorizer({ compare }),
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
