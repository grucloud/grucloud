const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");
//TODO
describe.skip("Lightsail", async function () {
  it("Certificate", () =>
    pipe([
      () => ({
        groupType: "Lightsail::Certificate",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("ContainerService", () =>
    pipe([
      () => ({
        groupType: "Lightsail::ContainerService",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("ContainerServiceDeploymentVersion", () =>
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
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("Disk", () =>
    pipe([
      () => ({
        groupType: "Lightsail::Disk",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("DiskAttachment", () =>
    pipe([
      () => ({
        groupType: "Lightsail::DiskAttachment",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("Domain", () =>
    pipe([
      () => ({
        groupType: "Lightsail::Domain",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("DomainEntry", () =>
    pipe([
      () => ({
        groupType: "Lightsail::DomainEntry",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("Instance", () =>
    pipe([
      () => ({
        groupType: "Lightsail::Instance",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("InstancePublicPort", () =>
    pipe([
      () => ({
        groupType: "Lightsail::InstancePublicPort",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("KeyPair", () =>
    pipe([
      () => ({
        groupType: "Lightsail::KeyPair",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("LoadBalancer", () =>
    pipe([
      () => ({
        groupType: "Lightsail::LoadBalancer",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("LoadBalancerAttachment", () =>
    pipe([
      () => ({
        groupType: "Lightsail::LoadBalancerAttachment",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("LoadBalancerCertificate", () =>
    pipe([
      () => ({
        groupType: "Lightsail::LoadBalancerCertificate",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("LoadBalancerCertificateAttachment", () =>
    pipe([
      () => ({
        groupType: "Lightsail::LoadBalancerCertificateAttachment",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("LoadBalancerStickynessPolicy", () =>
    pipe([
      () => ({
        groupType: "Lightsail::LoadBalancerStickynessPolicy",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("StaticIp", () =>
    pipe([
      () => ({
        groupType: "Lightsail::StaticIp",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("StaticIpAttachment", () =>
    pipe([
      () => ({
        groupType: "Lightsail::StaticIpAttachment",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
