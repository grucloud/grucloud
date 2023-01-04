const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IVS.html

const { IvschatRoom } = require("./IvschatRoom");
const {
  IvschatLoggingConfiguration,
} = require("./IvschatLoggingConfiguration");

const GROUP = "Ivschat";
const tagsKey = "tags";

const compare = compareAws({ tagsKey, key: "key" });

module.exports = pipe([
  () => [
    //
    IvschatRoom({}),
    IvschatLoggingConfiguration({}),
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
