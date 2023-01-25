const assert = require("assert");
const { tap, pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const GROUP = "MQ";
const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

const { MQBroker } = require("./MQBroker");
const { MQConfiguration } = require("./MQConfiguration");

// TODO MQUser
module.exports = pipe([
  () => [
    //
    MQBroker({ compare }),
    MQConfiguration({ compare }),
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
