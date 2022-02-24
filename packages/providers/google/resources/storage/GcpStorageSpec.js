const { tap, pipe, assign, map, get, pick } = require("rubico");
const { callProp } = require("rubico/x");
const path = require("path");
const assert = require("assert");
const { md5FileBase64 } = require("@grucloud/core/Common");
const GoogleTag = require("../../GoogleTag");
const { compare } = require("../../GoogleCommon");

const { GcpBucket } = require("./GcpBucket");
const { GcpObject, isGcpObjectOurMinion } = require("./GcpObject");

const GROUP = "storage";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Bucket",
      Client: GcpBucket,
      propertiesDefault: { storageClass: "STANDARD" },
      isOurMinion: GoogleTag.isOurMinion,
      filterLive: () =>
        pipe([
          pick(["storageClass", "iamConfiguration", "iam"]),
          assign({ iam: pipe([get("iam"), pick(["bindings"])]) }),
        ]),
      compare: compare({
        filterTarget: () =>
          pipe([
            assign({
              location: pipe([get("location"), callProp("toUpperCase")]),
            }),
          ]),
      }),
    },
    {
      type: "Object",
      dependsOn: ["storage::Bucket"],
      dependencies: {
        bucket: { type: "Bucket", group: "storage" },
      },
      Client: GcpObject,
      filterLive: () => pipe([pick(["contentType", "storageClass"])]),
      compare: compare({
        filterTarget: ({ programOptions }) =>
          pipe([
            (target) => ({
              md5Hash: pipe([
                tap(() => {
                  assert(programOptions.workingDirectory);
                  assert(target.source, "missing source");
                }),
                () =>
                  path.resolve(programOptions.workingDirectory, target.source),
                md5FileBase64,
                tap((targetHash) => {
                  assert(targetHash);
                }),
              ])(),
            }),
          ]),
        filterLive: () => pipe([pick(["md5Hash"])]),
      }),
      isOurMinion: isGcpObjectOurMinion,
    },
  ]);
