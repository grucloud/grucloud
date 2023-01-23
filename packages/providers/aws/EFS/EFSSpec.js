const assert = require("assert");
const { pipe, map, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");
const { EFSFileSystem } = require("./EFSFileSystem");
const { EFSAccessPoint } = require("./EFSAccessPoint");
const { EFSMountTarget } = require("./EFSMountTarget");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EFS.html
const GROUP = "EFS";

const compare = compareAws({});

module.exports = pipe([
  () => [
    EFSFileSystem({ compare }),
    EFSAccessPoint({ compare }),
    EFSMountTarget({ compare }),
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
