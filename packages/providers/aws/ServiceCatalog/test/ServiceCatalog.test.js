const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("ServiceCatalog", async function () {
  it("BudgetResourceAssociation", () =>
    pipe([
      () => ({
        groupType: "ServiceCatalog::BudgetResourceAssociation",
        livesNotFound: ({ config }) => [
          { ResourceId: "prod-123", BudgetName: "b123" },
        ],
      }),
      awsResourceTest,
    ])());
  it("Constraint", () =>
    pipe([
      () => ({
        groupType: "ServiceCatalog::Constraint",
        livesNotFound: ({ config }) => [{ Id: "i12345" }],
      }),
      awsResourceTest,
    ])());
  it("OrganizationsAccess", () =>
    pipe([
      () => ({
        groupType: "ServiceCatalog::OrganizationsAccess",
        livesNotFound: ({ config }) => [{}],
        skipGetByName: true,
        skipGetById: true,
        skipDelete: true,
      }),
      awsResourceTest,
    ])());
  it("Portfolio", () =>
    pipe([
      () => ({
        groupType: "ServiceCatalog::Portfolio",
        livesNotFound: ({ config }) => [{ Id: "p123" }],
      }),
      awsResourceTest,
    ])());
  it("PortfolioShare", () =>
    pipe([
      () => ({
        groupType: "ServiceCatalog::PortfolioShare",
        livesNotFound: ({ config }) => [
          {
            PortfolioId: "pt123",
            Type: "ORGANIZATIONAL_UNIT",
            OrganizationNode: {
              Value: "ou-941x-mh5deyma",
              Type: "ORGANIZATIONAL_UNIT",
            },
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Product", () =>
    pipe([
      () => ({
        groupType: "ServiceCatalog::Product",
        livesNotFound: ({ config }) => [{ Id: "p123" }],
      }),
      awsResourceTest,
    ])());
  it("ProductPortfolioAssociation", () =>
    pipe([
      () => ({
        groupType: "ServiceCatalog::ProductPortfolioAssociation",
        livesNotFound: ({ config }) => [
          { ProductId: "pr123", PortfolioId: "pt123" },
        ],
      }),
      awsResourceTest,
    ])());
  it("PrincipalPortfolioAssociation", () =>
    pipe([
      () => ({
        groupType: "ServiceCatalog::PrincipalPortfolioAssociation",
        livesNotFound: ({ config }) => [
          {
            PortfolioId: "pt123",
            PrincipalARN: `arn:${
              config.partition
            }:iam::${config.accountId()}:role/zzzzzzz`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("ProvisionedProduct", () =>
    pipe([
      () => ({
        groupType: "ServiceCatalog::ProvisionedProduct",
        livesNotFound: ({ config }) => [{ Id: "prod1243" }],
      }),
      awsResourceTest,
    ])());
  it("ProvisioningArtifact", () =>
    pipe([
      () => ({
        groupType: "ServiceCatalog::ProvisioningArtifact",
        livesNotFound: ({ config }) => [
          { ProductId: "prod-1243", ProvisioningArtifactId: "prov-123" },
        ],
      }),
      awsResourceTest,
    ])());
  it("ServiceAction", () =>
    pipe([
      () => ({
        groupType: "ServiceCatalog::ServiceAction",
        livesNotFound: ({ config }) => [{ Id: "Id123" }],
      }),
      awsResourceTest,
    ])());
  it("ServiceActionAssociation", () =>
    pipe([
      () => ({
        groupType: "ServiceCatalog::ServiceActionAssociation",
        livesNotFound: ({ config }) => [
          {
            ProductId: "prod-123",
            ProvisioningArtifactId: "arti-123",
            ServiceActionId: "act-fs-123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("TagOption", () =>
    pipe([
      () => ({
        groupType: "ServiceCatalog::TagOption",
        livesNotFound: ({ config }) => [{ Id: "t123" }],
      }),
      awsResourceTest,
    ])());
  it("TagOptionResourceAssociation", () =>
    pipe([
      () => ({
        groupType: "ServiceCatalog::TagOptionResourceAssociation",
        livesNotFound: ({ config }) => [
          { ResourceId: "prod-123", TagOptionId: "t124" },
        ],
      }),
      awsResourceTest,
    ])());
});
