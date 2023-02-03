const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DataSync.html

const { DataSyncLocationEfs } = require("./DataSyncLocationEfs");
const { DataSyncLocationFsxLustre } = require("./DataSyncLocationFsxLustre");
const { DataSyncLocationFsxOpenZfs } = require("./DataSyncLocationFsxOpenZfs");
const { DataSyncLocationFsxWindows } = require("./DataSyncLocationFsxWindows");
const { DataSyncLocationS3 } = require("./DataSyncLocationS3");
const { DataSyncTask } = require("./DataSyncTask");

const GROUP = "DataSync";

const compare = compareAws({});

module.exports = pipe([
  () => [
    DataSyncLocationEfs({}),
    DataSyncLocationFsxLustre({}),
    DataSyncLocationFsxOpenZfs({}),
    DataSyncLocationFsxWindows({ compare }),
    DataSyncLocationS3({}),
    DataSyncTask({}),
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
