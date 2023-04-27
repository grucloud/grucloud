const assert = require("assert");
const { pipe, tap, eq, get, tryCatch, not } = require("rubico");
const { callProp } = require("rubico/x");
const fs = require("fs").promises;
const AdmZip = require("adm-zip");

const crypto = require("crypto");
const { createEndpoint } = require("../AwsCommon");
const { createTagger } = require("../AwsTagger");
const AxiosMaker = require("@grucloud/core/AxiosMaker");

exports.createLambda = createEndpoint("lambda", "Lambda");

exports.fetchZip =
  () =>
  ({ Location }) =>
    pipe([
      tap(() => {
        assert(Location);
      }),
      () => ({}),
      AxiosMaker,
      callProp("get", Location, { responseType: "arraybuffer" }),
      get("data"),
      callProp("toString", "base64"),
    ])();

const fileExist = (path) =>
  tryCatch(
    pipe([() => fs.stat(path)]),
    tap.if(eq(get("code"), "ENOENT"), (error) => {
      throw Error(`The directory '${path}' does not exist`);
    })
  )();

exports.createZipBuffer = ({ localPath }) =>
  pipe([
    tap(() => {
      assert(localPath);
    }),
    () => localPath,
    tap(fileExist),
    () => {
      const zip = new AdmZip();
      zip.addLocalFolder(localPath);
      return zip.toBuffer();
    },
  ])();

exports.computeHash256 = (ZipFile) =>
  pipe([
    tap(() => {
      assert(ZipFile);
    }),
    () => crypto.createHash("sha256").update(ZipFile).digest("base64"),
  ])();

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "Resource",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#tagResource-property
exports.tagResource =
  ({ lambda }) =>
  ({ id, live }) =>
    pipe([
      tap((params) => {
        assert(live);
      }),
      (Tags) => ({ Resource: id, Tags }),
      lambda().tagResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#untagResource-property
exports.untagResource =
  ({ lambda }) =>
  ({ id }) =>
    pipe([(TagKeys) => ({ Resource: id, TagKeys }), lambda().untagResource]);
