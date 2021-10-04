const assert = require("assert");
const path = require("path");
const { map, pipe, tap, tryCatch } = require("rubico");

const { main } = require("../aws2resource");

describe("AWS2Resource", function () {
  it("cloudwatchevent", async () => {
    await main({ TypeNamePrefix: "AWS::", fileName: "aws.schema.json" });
  });
});
