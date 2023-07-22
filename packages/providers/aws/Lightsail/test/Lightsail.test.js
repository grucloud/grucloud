const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Lightsail", async function () {
  it("Bucket", () =>
    pipe([
      () => ({
        groupType: "Lightsail::Bucket",
        livesNotFound: ({ config }) => [{ bucketName: "a123" }],
      }),
      awsResourceTest,
    ])());
  it("Certificate", () =>
    pipe([
      () => ({
        groupType: "Lightsail::Certificate",
        livesNotFound: ({ config }) => [{ certificateName: "a123" }],
      }),
      awsResourceTest,
    ])());
  it("ContainerService", () =>
    pipe([
      () => ({
        groupType: "Lightsail::ContainerService",
        livesNotFound: ({ config }) => [{ serviceName: "a123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("ContainerServiceDeploymentVersion", () =>
    pipe([
      () => ({
        groupType: "Lightsail::ContainerServiceDeploymentVersion",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("Database", () =>
    pipe([
      () => ({
        groupType: "Lightsail::Database",
        livesNotFound: ({ config }) => [{ relationalDatabaseName: "db123" }],
      }),
      awsResourceTest,
    ])());
  it("DatabaseSnapshot", () =>
    pipe([
      () => ({
        groupType: "Lightsail::DatabaseSnapshot",
        livesNotFound: ({ config }) => [
          { relationalDatabaseSnapshotName: "db123" },
        ],
      }),
      awsResourceTest,
    ])());
  it("Disk", () =>
    pipe([
      () => ({
        groupType: "Lightsail::Disk",
        livesNotFound: ({ config }) => [{ diskName: "d123" }],
      }),
      awsResourceTest,
    ])());
  it("DiskAttachment", () =>
    pipe([
      () => ({
        groupType: "Lightsail::DiskAttachment",
        livesNotFound: ({ config }) => [{ diskName: "d123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("Domain", () =>
    pipe([
      () => ({
        groupType: "Lightsail::Domain",
        livesNotFound: ({ config }) => [{ domainName: "d123.com" }],
        nameNotFound: "d123.com",
      }),
      awsResourceTest,
    ])());
  it("Instance", () =>
    pipe([
      () => ({
        groupType: "Lightsail::Instance",
        livesNotFound: ({ config }) => [{ instanceName: "i123" }],
      }),
      awsResourceTest,
    ])());
  it("InstancePublicPorts", () =>
    pipe([
      () => ({
        groupType: "Lightsail::InstancePublicPorts",
        livesNotFound: ({ config }) => [{ instanceName: "i123", portInfo: {} }],
      }),
      awsResourceTest,
    ])());
  it("KeyPair", () =>
    pipe([
      () => ({
        groupType: "Lightsail::KeyPair",
        livesNotFound: ({ config }) => [{ keyPairName: "k123" }],
      }),
      awsResourceTest,
    ])());
  it("LoadBalancer", () =>
    pipe([
      () => ({
        groupType: "Lightsail::LoadBalancer",
        livesNotFound: ({ config }) => [{ loadBalancerName: "a123" }],
      }),
      awsResourceTest,
    ])());
  it("LoadBalancerAttachment", () =>
    pipe([
      () => ({
        groupType: "Lightsail::LoadBalancerAttachment",
        livesNotFound: ({ config }) => [
          { loadBalancerName: "lb123", instanceName: "i123" },
        ],
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
  it("LoadBalancerCertificate", () =>
    pipe([
      () => ({
        groupType: "Lightsail::LoadBalancerCertificate",
        livesNotFound: ({ config }) => [
          { loadBalancerName: "lb123", certificateName: "c123" },
        ],
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
  it("LoadBalancerCertificateAttachment", () =>
    pipe([
      () => ({
        groupType: "Lightsail::LoadBalancerCertificateAttachment",
        livesNotFound: ({ config }) => [
          { loadBalancerName: "lb123", certificateName: "c123" },
        ],
        skipDelete: true,
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
  it("StaticIp", () =>
    pipe([
      () => ({
        groupType: "Lightsail::StaticIp",
        livesNotFound: ({ config }) => [{ staticIpName: "ip123" }],
      }),
      awsResourceTest,
    ])());
  it("StaticIpAttachment", () =>
    pipe([
      () => ({
        groupType: "Lightsail::StaticIpAttachment",
        livesNotFound: ({ config }) => [{ staticIpName: "ip123" }],
      }),
      awsResourceTest,
    ])());
});
