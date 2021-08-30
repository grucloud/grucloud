const assert = require("assert");
const path = require("path");
const { map, pipe, tap, tryCatch } = require("rubico");

const { main } = require("../aws2resource");

describe("AWS2Resource", function () {
  it("cloudwatchevent", async () => {
    await main({
      input: path.resolve(
        __dirname,
        "../apis",
        "events-2015-10-07.normal.json"
      ),
    });
  });
});
