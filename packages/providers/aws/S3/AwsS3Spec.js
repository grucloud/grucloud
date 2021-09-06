const assert = require("assert");
const { tap, pipe, assign, map, omit } = require("rubico");
const { compare } = require("@grucloud/core/Common");

const { AwsS3Bucket } = require("./AwsS3Bucket");
const { AwsS3Object, compareS3Object } = require("./AwsS3Object");
const { isOurMinion } = require("../AwsCommon");

const GROUP = "S3";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Bucket",
      Client: AwsS3Bucket,
      isOurMinion,
      compare: compare({
        filterTarget: pipe([
          tap((params) => {
            assert(true);
          }),
          omit(["Bucket", "ACL", "Tags"]),
        ]),
        filterLive: pipe([
          tap((params) => {
            assert(true);
          }),
          omit(["Tags"]),
        ]),
      }),
    },
    {
      type: "Object",
      dependsOn: ["S3::Bucket"],
      Client: AwsS3Object,
      compare: compareS3Object,
      isOurMinion,
    },
  ]);
