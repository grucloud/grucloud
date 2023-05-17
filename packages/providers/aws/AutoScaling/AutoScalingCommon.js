const assert = require("assert");
const { map, pipe, tap, get, filter, pick, not, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

exports.compare = compareAws({
  getLiveTags: pipe([
    get("Tags", []),
    filter(not(eq(get("Key"), "AmazonECSManaged"))),
    map(pick(["Key", "Value"])),
  ]),
});
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#createOrUpdateTags-property
exports.tagResource =
  ({ ResourceType, property }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(endpoint);
        assert(live);
      }),
      map(
        defaultsDeep({
          PropagateAtLaunch: false,
          ResourceType,
          ResourceId: live[property],
        })
      ),
      tap((params) => {
        assert(true);
      }),
      (Tags) => ({ Tags }),
      endpoint().createOrUpdateTags,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#deleteTags-property
exports.untagResource =
  ({ ResourceType, property }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(endpoint);
        assert(live);
      }),
      map((Key) => ({
        Key,
        ResourceType,
        ResourceId: live[property],
      })),
      (Tags) => ({ Tags }),
      endpoint().deleteTags,
    ]);
