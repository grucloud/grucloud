const assert = require("assert");
const { map, pipe, tap, get, omit } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

//const { InternetMonitorMonitor } = require("./InternetMonitorMonitor");

const GROUP = "InternetMonitor";

const tagsKey = "Tags";

const compare = compareAws({ tagsKey });

module.exports = pipe([
  () => [
    //
    //InternetMonitorMonitor({ compare }),
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
