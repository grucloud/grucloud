const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/TimestreamWrite.html

const { TimestreamWriteDatabase } = require("./TimestreamWriteDatabase");
const { TimestreamWriteTable } = require("./TimestreamWriteTable");

const GROUP = "TimestreamWrite";

const compare = compareAws({});

module.exports = pipe([
  () => [
    //
    TimestreamWriteDatabase({ compare }),
    TimestreamWriteTable({ compare }),
  ],
  map(createAwsService),
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
    })
  ),
]);
