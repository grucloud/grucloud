const assert = require("assert");
const { get, eq } = require("rubico");
const { find } = require("rubico/x");
const { ConfigLoader } = require("ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");
const { CheckAwsTags } = require("../../AwsTagCheck");

describe("AwsSecurityGroup", async function () {
  let config;
  let provider;
  let vpc;
  let sg;
  const clusterName = "cluster";
  const k8sSecurityGroupTagKey = `kubernetes.io/cluster/${clusterName}`;
  const types = ["SecurityGroup", "Vpc"];
  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({
      config: () => ({ projectName: "gru-test" }),
    });

    vpc = await provider.makeVpc({
      name: "vpc",
      properties: () => ({
        CidrBlock: "10.1.0.1/16",
      }),
    });
    sg = await provider.makeSecurityGroup({
      name: "sg",
      dependencies: { vpc },
      properties: () => ({
        Tags: [{ Key: k8sSecurityGroupTagKey, Value: "owned" }],
        create: {
          Description: "Security Group Description",
        },
        ingress: {
          IpPermissions: [
            {
              FromPort: 22,
              IpProtocol: "tcp",
              IpRanges: [
                {
                  CidrIp: "0.0.0.0/0",
                },
              ],
              Ipv6Ranges: [
                {
                  CidrIpv6: "::/0",
                },
              ],
              ToPort: 22,
            },
          ],
        },
        egress: {
          IpPermissions: [
            {
              FromPort: 1024,
              IpProtocol: "tcp",
              IpRanges: [
                {
                  CidrIp: "0.0.0.0/0",
                },
              ],
              Ipv6Ranges: [
                {
                  CidrIpv6: "::/0",
                },
              ],
              ToPort: 65535,
            },
          ],
        },
      }),
    });

    const securityGroupNodes = await provider.makeSecurityGroup({
      name: "security-group-nodes",
      dependencies: { vpc, securityGroup: sg },
      properties: ({ dependencies: { securityGroup } }) => ({
        Tags: [{ Key: `kubernetes.io/cluster/${clusterName}`, Value: "owned" }],
        //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createSecurityGroup-property
        create: {
          Description: "SG for the EKS Nodes",
        },
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#authorizeSecurityGroupIngress-property
        ingress: {
          IpPermissions: [
            {
              FromPort: 0,
              IpProtocol: "-1",
              IpRanges: [
                {
                  CidrIp: "0.0.0.0/0",
                },
              ],
              Ipv6Ranges: [
                {
                  CidrIpv6: "::/0",
                },
              ],
              ToPort: 65535,
            },
            {
              FromPort: 1025,
              IpProtocol: "tcp",
              IpRanges: [
                {
                  CidrIp: "0.0.0.0/0",
                },
              ],
              Ipv6Ranges: [
                {
                  CidrIpv6: "::/0",
                },
              ],
              UserIdGroupPairs: [{ GroupId: securityGroup.live?.GroupId }],
              ToPort: 65535,
            },
          ],
        },
      }),
    });
  });
  after(async () => {});
  it("empty ingress", async function () {
    const provider = AwsProvider({
      config: () => ({ projectName: "gru-test" }),
    });
    await provider.start();

    const vpc = await provider.makeVpc({
      name: "vpc-empty-ingress",
      properties: () => ({
        CidrBlock: "11.10.0.1/16",
      }),
    });
    await provider.makeSecurityGroup({
      name: "sg-empty-ingress",
      dependencies: { vpc },
      properties: () => ({
        create: {
          Description: "Security Group Description",
        },
      }),
    });
    await testPlanDestroy({ provider, types });

    try {
      await testPlanDeploy({ provider, types });
      assert(!error, "should have failed");
    } catch (exception) {
      assert(
        exception.error.resultDeploy.results[0].resultCreate.results[1].error
          .code,
        "InvalidParameterValue"
      );
    }

    await testPlanDestroy({ provider, types });
  });
  it("sg name", async function () {
    assert.equal(sg.name, "sg");
  });
  it.skip("sg resolveConfig", async function () {
    const config = await sg.resolveConfig();
    assert.equal(config.ingress.IpPermissions[0].FromPort, 22);
  });
  it("sg apply and destroy", async function () {
    await testPlanDeploy({ provider, types });

    const sgLive = await sg.getLive();
    const vpcLive = await vpc.getLive();
    assert.equal(sgLive.IpPermissions.length, 1);
    assert.equal(sgLive.IpPermissionsEgress.length, 2);
    assert.equal(sgLive.VpcId, vpcLive.VpcId);
    assert(find(eq(get("Key"), k8sSecurityGroupTagKey))(sgLive.Tags));

    assert(
      CheckAwsTags({
        config: provider.config,
        tags: sgLive.Tags,
        name: sg.name,
      })
    );

    await testPlanDestroy({ provider, types });
  });
});
