const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("ServiceCatalog", async function () {
  it.skip("BudgetResourceAssociation", () =>
    pipe([
      () => ({
        groupType: "ServiceCatalog::BudgetResourceAssociation",
        livesNotFound: ({ config }) => [{}],
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
            PrincipalId: "ou-123",
            Type: "ORGANIZATIONAL_UNIT",
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
            PrincipalARN: `arn:aws:iam::${config.accountId()}:role/zzzzzzz`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("ProvisionedProduct", () =>
    pipe([
      () => ({
        groupType: "ServiceCatalog::ProvisionedProduct",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ProvisioningArtifact", () =>
    pipe([
      () => ({
        groupType: "ServiceCatalog::ProvisioningArtifact",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ServiceAction", () =>
    pipe([
      () => ({
        groupType: "ServiceCatalog::ServiceAction",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("TagOption", () =>
    pipe([
      () => ({
        groupType: "ServiceCatalog::TagOption",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
