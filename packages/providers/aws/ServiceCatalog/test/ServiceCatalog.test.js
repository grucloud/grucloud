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
  it.skip("Constraint", () =>
    pipe([
      () => ({
        groupType: "ServiceCatalog::Constraint",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("OrganizationsAccess", () =>
    pipe([
      () => ({
        groupType: "ServiceCatalog::OrganizationsAccess",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Portfolio", () =>
    pipe([
      () => ({
        groupType: "ServiceCatalog::Product",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("PortfolioShare", () =>
    pipe([
      () => ({
        groupType: "ServiceCatalog::PortfolioShare",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Product", () =>
    pipe([
      () => ({
        groupType: "ServiceCatalog::Product",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ProductPortfolioAssociation", () =>
    pipe([
      () => ({
        groupType: "ServiceCatalog::ProductPortfolioAssociation",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("PrincipalPortfolioAssociation ", () =>
    pipe([
      () => ({
        groupType: "ServiceCatalog::PrincipalPortfolioAssociation",
        livesNotFound: ({ config }) => [{}],
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
  it.skip("TagOption", () =>
    pipe([
      () => ({
        groupType: "ServiceCatalog::TagOptionResourceAssociation",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});