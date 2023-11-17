const assert = require("assert");
const md5File = require("md5-file");
const { pipe, tap } = require("rubico");

exports.md5FileBase64 = pipe([
  md5File,
  (md5) => new Buffer.from(md5, "hex").toString("base64"),
]);

exports.md5FileHex = pipe([
  md5File,
  (md5) => new Buffer.from(md5, "hex").toString("hex"),
]);
