const assert = require("assert");
const { pipe, tap, eq, get, tryCatch, not } = require("rubico");
const { callProp } = require("rubico/x");
const Axios = require("axios");
const fs = require("fs").promises;
const AdmZip = require("adm-zip");

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
    fileExist,
    () => new AdmZip(),
    tap(callProp("addLocalFolder", localPath, "")),
    callProp("toBuffer"),
  ])();
