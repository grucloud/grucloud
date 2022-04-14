const assert = require("assert");
const { pipe, tap, eq, get, tryCatch, not } = require("rubico");
const { callProp, last } = require("rubico/x");
const Axios = require("axios");
const fs = require("fs").promises;
const zipDir = require("zip-dir");
const crypto = require("crypto");
const { createEndpoint } = require("../AwsCommon");

exports.createLambda = createEndpoint("lambda", "Lambda");

exports.fetchZip =
  () =>
  ({ Location }) =>
    pipe([
      tap(() => {
        assert(Location);
      }),
      () => Axios.create({}),
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
    () =>
      zipDir(localPath, {
        filter: pipe([not(callProp("endsWith", ".DS_Store"))]),
      }),
    // tap(
    //   pipe([
    //     (data) =>
    //       fs.writeFile(
    //         `${pipe([
    //           () => localPath,
    //           callProp("split", "/"),
    //           last,
    //         ])()}.target.zip`,
    //         data
    //       ),
    //   ])
    // ),
  ])();

exports.computeHash256 = (ZipFile) =>
  pipe([
    tap(() => {
      assert(ZipFile);
    }),
    () => crypto.createHash("sha256"),
    (hash256) =>
      pipe([() => hash256.update(ZipFile), () => hash256.digest("base64")])(),
  ])();

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
