const assert = require("assert");
const { pipe, tap, eq, get, tryCatch, assign } = require("rubico");
const { callProp, find, first, when, isEmpty } = require("rubico/x");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceArn",
  TagsKey: "Tags",
  UnTagsKey: "Keys",
});

exports.assignTags = ({ buildArn, endpoint }) =>
  pipe([
    assign({
      Tags: tryCatch(
        pipe([
          buildArn,
          (ResourceArn) => ({ ResourceArn }),
          endpoint().listTagsForResource,
          get("Tags"),
        ]),
        (error) => []
      ),
    }),
  ]);

const findS3FromLocationUri = ({ lives, config }) =>
  pipe([
    get("LocationUri"),
    callProp("replace", `s3://`, ""),
    callProp("split", "/"),
    first,
    tap((bucketName) => {
      assert(bucketName);
    }),
    (bucketName) =>
      pipe([
        lives.getByType({
          type: "Bucket",
          group: "S3",
          providerName: config.providerName,
        }),
        find(eq(get("live.Name"), bucketName)),
      ])(),
  ]);

exports.findS3FromLocationUri = findS3FromLocationUri;

const findEfsFromLocation = ({ lives, config }) =>
  pipe([
    get("LocationUri"),
    tap((LocationUri) => {
      assert(LocationUri);
    }),
    callProp("replace", `efs://${config.region}.`, ""),
    callProp("split", "/"),
    first,
    tap((fsId) => {
      assert(fsId);
    }),
    (fsId) =>
      pipe([
        lives.getByType({
          type: "FileSystem",
          group: "EFS",
          providerName: config.providerName,
        }),
        find(eq(get("live.FileSystemId"), fsId)),
      ])(),
  ]);

exports.findEfsFromLocation = findEfsFromLocation;

const findFsxFromLocation = ({ lives, config }) =>
  pipe([
    get("LocationUri"),
    tap((LocationUri) => {
      assert(LocationUri);
    }),
    callProp("replace", `fsxl://${config.region}.`, ""),
    callProp("replace", `fsxz://${config.region}.`, ""),
    callProp("replace", `fsxw://${config.region}.`, ""),
    callProp("split", "/"),
    first,
    tap((fsId) => {
      assert(fsId);
    }),
    (fsId) =>
      pipe([
        lives.getByType({
          type: "FileSystem",
          group: "FSx",
          providerName: config.providerName,
        }),
        find(eq(get("live.FileSystemId"), fsId)),
        when(isEmpty, () => ({ name: fsId, id: fsId })),
      ])(),
  ]);

exports.findFsxFromLocation = findFsxFromLocation;
