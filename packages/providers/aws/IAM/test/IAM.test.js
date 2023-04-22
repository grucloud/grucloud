const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("IAM", async function () {
  it("InstanceProfile", () =>
    pipe([
      () => ({
        groupType: "IAM::InstanceProfile",
        livesNotFound: ({ config }) => [
          {
            InstanceProfileName: "instanceProfilename",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Group", () =>
    pipe([
      () => ({
        groupType: "IAM::Group",
        livesNotFound: ({ config }) => [
          {
            GroupName: "groupname",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("GroupPolicy", () =>
    pipe([
      () => ({
        groupType: "IAM::GroupPolicy",
        livesNotFound: ({ config }) => [
          {
            GroupName: "username",
            PolicyName: "p123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("OpenIDConnectProvider", () =>
    pipe([
      () => ({
        groupType: "IAM::OpenIDConnectProvider",
        livesNotFound: ({ config }) => [
          {
            OpenIDConnectProviderArn: `arn:aws:iam::${config.accountId()}:oidc-provider/oidc.eks.us-east-1.amazonaws.com/id/D37114C060BC22C04E5BE2E1BF4717A2`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Policy", () =>
    pipe([
      () => ({
        groupType: "IAM::Policy",
        livesNotFound: ({ config }) => [
          {
            Arn: "arn:aws:iam::aws:policy/service-role/blabla",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Role", () =>
    pipe([
      () => ({
        groupType: "IAM::Role",
        livesNotFound: ({ config }) => [
          {
            RoleName: "rolename",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("SAMLProvider", () =>
    pipe([
      () => ({
        groupType: "IAM::SAMLProvider",
        livesNotFound: ({ config }) => [
          {
            SAMLProviderArn: "TODO",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("ServerCertificate", () =>
    pipe([
      () => ({
        groupType: "IAM::ServerCertificate",
        livesNotFound: ({ config }) => [
          {
            ServerCertificateName: "s123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("ServiceSpecificCredential", () =>
    pipe([
      () => ({
        groupType: "IAM::ServiceSpecificCredential",
        livesNotFound: ({ config }) => [
          {
            ServiceSpecificCredentialId: "s123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("SigningCertificate", () =>
    pipe([
      () => ({
        groupType: "IAM::SigningCertificate",
        livesNotFound: ({ config }) => [
          {
            CertificateId: "s123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("User", () =>
    pipe([
      () => ({
        groupType: "IAM::User",
        livesNotFound: ({ config }) => [
          {
            UserName: "username",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("UserPolicy", () =>
    pipe([
      () => ({
        groupType: "IAM::User",
        livesNotFound: ({ config }) => [
          {
            UserName: "username",
            PolicyName: "p123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("VirtualMFADevice", () =>
    pipe([
      () => ({
        groupType: "IAM::VirtualMFADevice",
        livesNotFound: ({ config }) => [
          {
            SerialNumber: `arn:aws:iam::${config.accountId()}:mfa/ExampleName`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
