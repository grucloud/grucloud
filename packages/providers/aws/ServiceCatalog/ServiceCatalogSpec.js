const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compare } = require("@grucloud/core/Common");
const { createAwsService } = require("../AwsService");

const {
  ServiceCatalogBudgetResourceAssociation,
} = require("./ServiceCatalogBudgetResourceAssociation");
const { ServiceCatalogConstraint } = require("./ServiceCatalogConstraint");
const {
  ServiceCatalogOrganizationsAccess,
} = require("./ServiceCatalogOrganizationsAccess");
const { ServiceCatalogPortfolio } = require("./ServiceCatalogPortfolio");
const {
  ServiceCatalogPortfolioShare,
} = require("./ServiceCatalogPortfolioShare");
const { ServiceCatalogProduct } = require("./ServiceCatalogProduct");
const {
  ServiceCatalogProductPortfolioAssociation,
} = require("./ServiceCatalogProductPortfolioAssociation");
const {
  ServiceCatalogPrincipalPortfolioAssociation,
} = require("./ServiceCatalogPrincipalPortfolioAssociation");
const {
  ServiceCatalogProvisionedProduct,
} = require("./ServiceCatalogProvisionedProduct");
const {
  ServiceCatalogProvisioningArtifact,
} = require("./ServiceCatalogProvisioningArtifact");

//const { ServiceCatalogTagOption } = require("./ServiceCatalogTagOption");
//const { ServiceCatalogTagOptionResourceAssociation } = require("./ServiceCatalogTagOptionResourceAssociation");

const {
  ServiceCatalogServiceAction,
} = require("./ServiceCatalogServiceAction");

const GROUP = "ServiceCatalog";

module.exports = pipe([
  () => [
    ServiceCatalogBudgetResourceAssociation({}),
    ServiceCatalogConstraint({}),
    ServiceCatalogOrganizationsAccess({}),
    ServiceCatalogPortfolio({}),
    ServiceCatalogPortfolioShare({}),
    ServiceCatalogProduct({}),
    ServiceCatalogProductPortfolioAssociation({}),
    ServiceCatalogPrincipalPortfolioAssociation({}),
    ServiceCatalogProvisionedProduct({}),
    ServiceCatalogProvisioningArtifact({}),
    ServiceCatalogServiceAction({}),
    // ServiceCatalogTagOption({})
    // ServiceCatalogTagOptionResourceAssociation({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
      }),
    ])
  ),
]);
