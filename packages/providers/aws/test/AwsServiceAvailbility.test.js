const assert = require("assert");
const { tryCatch, pipe, tap } = require("rubico");

const {
  fetchServiceAvailability,
  saveFile,
} = require("../AwsServiceAvailability");

describe("AWS Service Availibility", async function () {
  it("ok", async function () {
    await tryCatch(
      pipe([
        fetchServiceAvailability,
        saveFile({ filename: "AwsServicesAvailability.json" }),
      ]),
      (error) => {
        throw error;
      }
    )();
  });
});
