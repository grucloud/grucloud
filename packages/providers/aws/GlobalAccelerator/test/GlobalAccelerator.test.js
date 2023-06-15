const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("GlobalAccelerator", async function () {
  it("Accelerator", () =>
    pipe([
      () => ({
        groupType: "GlobalAccelerator::Accelerator",
        livesNotFound: ({ config }) => [
          {
            AcceleratorArn: `arn:${
              config.partition
            }:globalaccelerator::${config.accountId()}:accelerator/123`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("CustomRoutingAccelerator", () =>
    pipe([
      () => ({
        groupType: "GlobalAccelerator::CustomRoutingAccelerator",
        livesNotFound: ({ config }) => [
          {
            AcceleratorArn: `arn:${
              config.partition
            }:globalaccelerator::${config.accountId()}:accelerator/123`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("CustomRoutingEndpointGroup", () =>
    pipe([
      () => ({
        groupType: "GlobalAccelerator::CustomRoutingEndpointGroup",
        livesNotFound: ({ config }) => [
          {
            EndpointGroupArn: `arn:${
              config.partition
            }:globalaccelerator::${config.accountId()}:accelerator/310c604a-5013-416e-b940-e53d61b2da2d/listener/686088c5/endpoint-group/98de4326d002`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("CustomRoutingListener", () =>
    pipe([
      () => ({
        groupType: "GlobalAccelerator::CustomRoutingListener",
        livesNotFound: ({ config }) => [
          {
            ListenerArn: `arn:${
              config.partition
            }:globalaccelerator::${config.accountId()}:accelerator/a74affc1-eae0-427b-9011-0b04fadaf8e1/listener/f13b08ab`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("EndpointGroup", () =>
    pipe([
      () => ({
        groupType: "GlobalAccelerator::EndpointGroup",
        livesNotFound: ({ config }) => [
          {
            EndpointGroupArn: `arn:${
              config.partition
            }:globalaccelerator::${config.accountId()}:accelerator/310c604a-5013-416e-b940-e53d61b2da2d/listener/686088c5/endpoint-group/98de4326d002`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Listener", () =>
    pipe([
      () => ({
        groupType: "GlobalAccelerator::Listener",
        livesNotFound: ({ config }) => [
          {
            ListenerArn: `arn:${
              config.partition
            }:globalaccelerator::${config.accountId()}:accelerator/a74affc1-eae0-427b-9011-0b04fadaf8e1/listener/f13b08ab`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
