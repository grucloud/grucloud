const { pipe, assign, map, get } = require("rubico");
const { callProp } = require("rubico/x");

const assert = require("assert");
const { md5FileBase64, compare } = require("@grucloud/core/Common");
const GoogleTag = require("../../GoogleTag");
const logger = require("@grucloud/core/logger")({ prefix: "GcpStorageSpec" });

const { GcpBucket } = require("./GcpBucket");
const { GcpObject, isGcpObjectOurMinion } = require("./GcpObject");

const GROUP = "storage";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Bucket",
      Client: GcpBucket,
      isOurMinion: GoogleTag.isOurMinion,
      compare: compare({
        filterTarget: pipe([
          assign({
            location: pipe([get("location"), callProp("toUpperCase")]),
          }),
        ]),
      }),
    },
    {
      type: "Object",
      dependsOn: ["storage::Bucket"],
      Client: GcpObject,
      compare: async ({ target, live }) => {
        logger.debug(`compare object`);
        assert(live.md5Hash);
        if (target.source) {
          const md5 = await md5FileBase64(target.source);
          if (live.md5Hash !== md5) {
            return {
              liveDiff: { updated: { md5: live.md5Hash } },
              targetDiff: { updated: { md5: md5 } },
            };
          }
        }

        return [];
      },
      isOurMinion: isGcpObjectOurMinion,
    },
  ]);
