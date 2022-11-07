const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("CURReportDefinition", async function () {
  let config;
  let provider;
  let report;

  before(async function () {
    provider = await AwsProvider({ config });
    report = provider.getClient({
      groupType: "CUR::ReportDefinition",
    });
    await provider.start();
  });
  after(async () => {});
  it(
    "list",
    pipe([
      () => report.getList(),
      tap((params) => {
        assert(true);
      }),
    ])
  );
  it("delete with invalid id", () =>
    pipe([
      () => ({
        live: {
          ReportName: "b123",
        },
      }),
      report.destroy,
    ]))();
});
