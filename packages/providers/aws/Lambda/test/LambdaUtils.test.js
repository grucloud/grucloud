const assert = require("assert");
const AdmZip = require("adm-zip");
const { pipe, tap, eq, get, tryCatch, not } = require("rubico");
const path = require("path");

const { createZipBuffer, computeHash256 } = require("../LambdaCommon");
describe("Lambda utils", async function () {
  before(async function () {});
  after(async () => {});
  it("zip", async function () {
    const zip = new AdmZip();
    zip.addLocalFolder(path.resolve(__dirname, "zipfolder"));
    const buffer = zip.toBuffer();
    const hash = computeHash256(buffer);
    assert.equal(hash, "LvqSvA1Te7Mz/Y79IdvnX1HXPXRTLREdfXRlHThYVro=");
  });
  it("createZipBuffer", () =>
    pipe([
      () => ({
        localPath: path.resolve(__dirname, "zipfolder"),
      }),
      createZipBuffer,
      computeHash256,
      tap((hash) => {
        assert.equal(hash, "LvqSvA1Te7Mz/Y79IdvnX1HXPXRTLREdfXRlHThYVro=");
      }),
    ])());
  it("computeHash256", () =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      () => Buffer.from("test"),
      computeHash256,
      tap((result) => {
        assert.equal(result, "n4bQgYhMfWWaL+qgxVrQFaO/TxsrC4Is0V1sFbDwCgg=");
      }),
    ])());
});
