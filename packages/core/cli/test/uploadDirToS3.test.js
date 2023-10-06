const assert = require("assert");
const { uploadDirToS3 } = require("../uploadDirToS3");
const Path = require("node:path");

describe("UploadDirToS3", function () {
  before(async function () {
    if (!process.env.S3_AWS_REGION) {
      this.skip();
    }
  });

  it("upload", async () => {
    try {
      await uploadDirToS3({
        s3Bucket: "grucloud-console-dev",
        s3Key: "test",
        s3LocalDir: Path.join(__dirname, "uploadDir"),
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
});
