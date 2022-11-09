const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("Route53RecoveryControlConfigControlPanel", async function () {
  let config;
  let provider;
  let controlPanel;

  before(async function () {
    provider = await AwsProvider({ config });
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
          live: {
            ControlPanelArn:
              "arn:aws:route53-recovery-control::840541460064:controlpanel/a5fccd99254446b4b3d85a6071013c8a",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        controlPanel.getById({})({
          ControlPanelArn:
            "arn:aws:route53-recovery-control::840541460064:controlpanel/a5fccd99254446b4b3d85a6071013c8a",
        }),
    ])
  );
});
