const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectoryService.html

const {
  DirectoryServiceConditionalForwarder,
} = require("./DirectoryServiceConditionalForwarder");
const { DirectoryServiceDirectory } = require("./DirectoryServiceDirectory");
// const {
//   DirectoryServiceLogSubscription,
// } = require("./DirectoryServiceLogSubscription");
const { DirectoryServiceRegion } = require("./DirectoryServiceRegion");
const {
  DirectoryServiceSharedDirectory,
} = require("./DirectoryServiceSharedDirectory");
//const { DirectoryServiceSharedDirectoryAccepter } = require("./DirectoryServiceSharedDirectoryAccepter");

const { DirectoryServiceTrust } = require("./DirectoryServiceTrust");

const GROUP = "DirectoryService";

const compare = compareAws({});

module.exports = pipe([
  () => [
    DirectoryServiceConditionalForwarder({}),
    DirectoryServiceDirectory({ compare }),
    // DirectoryServiceLogSubscription({})
    DirectoryServiceRegion({}),
    DirectoryServiceSharedDirectory({}),
    DirectoryServiceTrust({}),
    // DirectoryServiceSharedDirectoryAccepter({})
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
