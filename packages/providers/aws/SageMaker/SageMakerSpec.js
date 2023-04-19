const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html

const { SageMakerApp } = require("./SageMakerApp");
const { SageMakerAppImageConfig } = require("./SageMakerAppImageConfig");
const { SageMakerCodeRepository } = require("./SageMakerCodeRepository");
const { SageMakerDevice } = require("./SageMakerDevice");
const { SageMakerDeviceFleet } = require("./SageMakerDeviceFleet");
const {
  SageMakerDataQualityJobDefinition,
} = require("./SageMakerDataQualityJobDefinition");
const { SageMakerDomain } = require("./SageMakerDomain");
const { SageMakerEndpoint } = require("./SageMakerEndpoint");
const { SageMakerEndpointConfig } = require("./SageMakerEndpointConfig");
const { SageMakerFeatureGroup } = require("./SageMakerFeatureGroup");
const { SageMakerFlowDefinition } = require("./SageMakerFlowDefinition");
const { SageMakerHumanTaskUi } = require("./SageMakerHumanTaskUi");
const { SageMakerImage } = require("./SageMakerImage");
const { SageMakerImageVersion } = require("./SageMakerImageVersion");
const { SageMakerModel } = require("./SageMakerModel");
const { SageMakerModelPackageGroup } = require("./SageMakerModelPackageGroup");
const {
  SageMakerModelPackageGroupPolicy,
} = require("./SageMakerModelPackageGroupPolicy");
const {
  SageMakerMonitoringSchedule,
} = require("./SageMakerMonitoringSchedule");
const { SageMakerNotebookInstance } = require("./SageMakerNotebookInstance");
const {
  SageMakerNotebookInstanceLifecycleConfig,
} = require("./SageMakerNotebookInstanceLifecycleConfig");
const { SageMakerProject } = require("./SageMakerProject");
const {
  SageMakerServiceCatalogPortfolio,
} = require("./SageMakerServiceCatalogPortfolio");

const { SageMakerSpace } = require("./SageMakerSpace");
const {
  SageMakerStudioLifecycleConfig,
} = require("./SageMakerStudioLifecycleConfig");
const { SageMakerUserProfile } = require("./SageMakerUserProfile");
const { SageMakerWorkforce } = require("./SageMakerWorkforce");
const { SageMakerWorkteam } = require("./SageMakerWorkteam");

const GROUP = "SageMaker";

const compare = compareAws({});

module.exports = pipe([
  () => [
    SageMakerApp({}),
    SageMakerAppImageConfig({}),
    SageMakerCodeRepository({}),
    SageMakerDevice({}),
    SageMakerDeviceFleet({}),
    SageMakerDataQualityJobDefinition({}),
    SageMakerDomain({}),
    SageMakerEndpoint({}),
    SageMakerEndpointConfig({}),
    SageMakerFeatureGroup({}),
    SageMakerFlowDefinition({}),
    SageMakerHumanTaskUi({}),
    SageMakerImage({}),
    SageMakerImageVersion({}),
    SageMakerModel({}),
    SageMakerModelPackageGroup({}),
    SageMakerModelPackageGroupPolicy({}),
    SageMakerMonitoringSchedule({}),
    SageMakerNotebookInstance({}),
    SageMakerNotebookInstanceLifecycleConfig({}),
    SageMakerProject({}),
    SageMakerServiceCatalogPortfolio({}),
    SageMakerSpace({}),
    SageMakerStudioLifecycleConfig({}),
    SageMakerUserProfile({}),
    SageMakerWorkforce({}),
    SageMakerWorkteam({}),
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
