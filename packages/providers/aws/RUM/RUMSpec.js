const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

const GROUP = "RUM";

const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

const { RUMAppMonitor } = require("./RUMAppMonitor");
const { RUMMetricsDestination } = require("./RUMMetricsDestination");

module.exports = pipe([
  () => [
    //
    RUMAppMonitor({ compare }),
    RUMMetricsDestination({ compare }),
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
