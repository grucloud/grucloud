const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");
const { compareAws } = require("../AwsCommon");

const GROUP = "OAM";

const compare = compareAws({});

const { OAMLink } = require("./OAMLink");
const { OAMSink } = require("./OAMSink");
const { OAMSinkPolicy } = require("./OAMSinkPolicy");

module.exports = pipe([
  () => [
    //
    OAMLink({}),
    OAMSink({}),
    OAMSinkPolicy({}),
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
