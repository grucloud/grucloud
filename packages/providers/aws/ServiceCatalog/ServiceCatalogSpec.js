const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

//const { ServiceCatalogBudgetResourceAssociation } = require("./ServiceCatalogBudgetResourceAssociation");
//const { ServiceCatalogConstraint } = require("./ServiceCatalogConstraint");
//const { ServiceCatalogOrganizationsAccess } = require("./ServiceCatalogOrganizationsAccess");
//const { ServiceCatalogPortfolio } = require("./ServiceCatalogPortfolio");
//const { ServiceCatalogPortfolioShare } = require("./ServiceCatalogPortfolioShare");
//const { ServiceCatalogProduct } = require("./ServiceCatalogProduct");
//const { ServiceCatalogProductPortfolioAssociation } = require("./ServiceCatalogProductPortfolioAssociation");
//const { ServiceCatalogPrincipalPortfolioAssociation } = require("./ServiceCatalogPrincipalPortfolioAssociation");
//const { ServiceCatalogProvisionedProduct } = require("./ServiceCatalogProvisionedProduct");
//const { ServiceCatalogProvisioningArtifact } = require("./ServiceCatalogProvisioningArtifact");
//const { ServiceCatalogServiceAction } = require("./ServiceCatalogServiceAction");
//const { ServiceCatalogTagOption } = require("./ServiceCatalogTagOption");
//const { ServiceCatalogTagOptionResourceAssociation } = require("./ServiceCatalogTagOptionResourceAssociation");

const GROUP = "ServiceCatalog";

const compareServiceCatalog = compareAws({});

module.exports = pipe([
  () => [
    // ServiceCatalogBudgetResourceAssociation({})
    // ServiceCatalogConstraint({})
    // ServiceCatalogPortfolio({}),
    // ServiceCatalogPortfolioShare({})
    // ServiceCatalogProduct({}),
    // ServiceCatalogProductPortfolioAssociation({})
    // ServiceCatalogPrincipalPortfolioAssociation({})
    // ServiceCatalogProvisionedProduct({})
    // ServiceCatalogProvisioningArtifact({})
    // ServiceCatalogTagOption({})
    // ServiceCatalogServiceAction({})
    // ServiceCatalogTagOptionResourceAssociation({}),
  ],
  map(createAwsService),
  map(
    defaultsDeep({
      group: GROUP,
      compare: compareServiceCatalog({}),
    })
  ),
]);
