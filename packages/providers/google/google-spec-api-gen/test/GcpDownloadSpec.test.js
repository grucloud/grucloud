const assert = require("assert");

const { pipe, tryCatch, tap } = require("rubico");

const { downloadDiscovery } = require("../GcpDownloadSpec");

describe("GcpDownloadSpec", async function () {
  before(async function () {});
  after(async () => {});
  it.only(
    "download",
    tryCatch(
      pipe([
        tap((params) => {
          assert(true);
        }),
        downloadDiscovery,
        tap((params) => {
          assert(true);
        }),
      ]),
      (error) => {
        throw error;
      }
    )
  );
});
