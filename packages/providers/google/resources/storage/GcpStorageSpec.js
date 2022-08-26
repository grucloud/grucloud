const { tap, pipe, assign, map, get, pick, fork } = require("rubico");
const { callProp } = require("rubico/x");
const path = require("path");
const assert = require("assert");
const { md5FileBase64 } = require("@grucloud/core/Common");
const GoogleTag = require("../../GoogleTag");
const { compareGoogle } = require("../../GoogleCommon");

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
      compare: compareGoogle({
        filterTarget: () =>
          pipe([
            assign({
              location: pipe([get("location"), callProp("toUpperCase")]),
            }),
          ]),
      }),
    },
    {
      type: "BucketAccessControl",
      managedByOther: () => true,
      findName: pipe([
        get("live"),
        tap(({ bucket, entity }) => {
          assert(bucket);
        }),
        ({ bucket, entity }) => `${bucket}::${entity}`,
      ]),
    },
    {
      type: "DefaultObjectAccessControl",
      cannotBeDeleted: () => true,
      managedByOther: () => true,
      findId: pipe([
        get("live.entity"),
        tap((name) => {
          assert(name);
        }),
      ]),
      findName: pipe([
        get("live.entity"),
        tap((name) => {
          assert(name);
        }),
      ]),
    },
    {
      type: "ObjectAccessControl",
      managedByOther: () => true,
      pathLiveFromParent: ({ live }) =>
        pipe([
          tap((params) => {
            assert(live.bucket);
            assert(live.name);
          }),
          () => `b/${live.bucket}/o/${live.name}/acl`,
        ]),
      findName: pipe([
        get("live"),
        ({ bucket, object, entity }) => `${bucket}::${object}::${entity}`,
      ]),
    },
    {
      type: "Object",
      dependencies: {
        bucket: { type: "Bucket", group: "storage" },
      },
      Client: GcpObject,
      filterLive: () => pipe([pick(["contentType", "storageClass"])]),
      compare: compareGoogle({
        filterTarget: ({ programOptions }) =>
          pipe([
            (target) =>
              fork({
                md5Hash: pipe([
                  tap(() => {
                    assert(programOptions.workingDirectory);
                    assert(target.source, "missing source");
                  }),
                  () =>
                    path.resolve(
                      programOptions.workingDirectory,
                      target.source
                    ),
                  md5FileBase64,
                  tap((targetHash) => {
                    assert(targetHash);
                  }),
                ]),
              })(),
          ]),
        filterLive: () => pipe([pick(["md5Hash"])]),
      }),
      isOurMinion: isGcpObjectOurMinion,
    },
  ]);
