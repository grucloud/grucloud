const assert = require("assert");
const path = require("path");
const { map, pipe, tap } = require("rubico");
const mime = require("mime-types");

const { getFiles } = require("./dumpster");

exports.createResourcesS3Object = async ({ provider }) => {
  const { config } = provider;
  const { DomainName, websiteDir } = config;
  const bucketName = DomainName;

  return pipe([
    () => websiteDir,
    getFiles,
    map((file) => ({
      type: "Object",
      group: "S3",
      dependencies: () => ({ bucket: bucketName }),
      properties: () => ({
        Key: file,
        ContentType: mime.lookup(file) || "text/plain",
        source: path.join(websiteDir, file),
      }),
    })),
  ])();
};
