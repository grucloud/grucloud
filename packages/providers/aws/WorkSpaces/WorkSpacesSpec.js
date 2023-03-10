const assert = require("assert");
const { pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const { WorkSpacesDirectory } = require("./WorkSpacesDirectory");
const { WorkSpacesIpGroup } = require("./WorkSpacesIpGroup");
const { WorkSpacesWorkspace } = require("./WorkSpacesWorkspace");

//  https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html
const GROUP = "WorkSpaces";
const tagsKey = "Tags";

const compare = compareAws({ tagsKey, key: "Key" });

module.exports = pipe([
  () => [
    WorkSpacesDirectory({}),
    WorkSpacesIpGroup({}),
    WorkSpacesWorkspace({}),
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
