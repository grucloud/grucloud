const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe.only("Route53RecoveryControlConfigControlPanel", async function () {
  let config;
  let provider;
  let controlPanel;

  before(async function () {
    provider = AwsProvider({ config });
    controlPanel = provider.getClient({
      groupType: "Route53RecoveryControlConfig::ControlPanel",
    });
    await provider.start();
  });
  it(
    "delete with invalid id",
    pipe([
      () =>
        controlPanel.destroy({
          live: { ControlPanelArn: "arn:aws:a-12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        controlPanel.getById({
          ControlPanelArn: "a-12345",
        }),
    ])
  );
});
