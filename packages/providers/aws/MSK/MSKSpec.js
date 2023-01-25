const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const GROUP = "MSK";
const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

const { MSKClusterV2 } = require("./MSKClusterV2");
const { MSKConfiguration } = require("./MSKConfiguration");

module.exports = pipe([
  () => [
    //
    MSKConfiguration({}),
    MSKClusterV2({}),
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
