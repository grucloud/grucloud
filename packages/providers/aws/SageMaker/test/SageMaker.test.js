const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("SageMaker", async function () {
  it.skip("App", () =>
    pipe([
      () => ({
        groupType: "SageMaker::App",
        livesNotFound: ({ config }) => [
          { AppName: "app", AppType: "JupyterServer", DomainId: "d123" },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("AppImageConfig", () =>
    pipe([
      () => ({
        groupType: "SageMaker::AppImageConfig",
        livesNotFound: ({ config }) => [{ AppImageConfigName: "c123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("CodeRepository", () =>
    pipe([
      () => ({
        groupType: "SageMaker::CodeRepository",
        livesNotFound: ({ config }) => [{ CodeRepositoryName: "c1234" }],
      }),
      awsResourceTest,
    ])());
  it.skip("Device", () =>
    pipe([
      () => ({
        groupType: "SageMaker::Device",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("DeviceFleet", () =>
    pipe([
      () => ({
        groupType: "SageMaker::DeviceFleet",
        livesNotFound: ({ config }) => [{ DeviceFleetName: "dfn" }],
      }),
      awsResourceTest,
    ])());
  it.skip("Domain", () =>
    pipe([
      () => ({
        groupType: "SageMaker::Domain",
        livesNotFound: ({ config }) => [{ DomainId: "d123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("Endpoint", () =>
    pipe([
      () => ({
        groupType: "SageMaker::Endpoint",
        livesNotFound: ({ config }) => [{ EndpointName: "e123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("EndpointConfig", () =>
    pipe([
      () => ({
        groupType: "SageMaker::EndpointConfig",
        livesNotFound: ({ config }) => [{ EndpointConfigName: "e123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("FeatureGroup", () =>
    pipe([
      () => ({
        groupType: "SageMaker::FeatureGroup",
        livesNotFound: ({ config }) => [{ FeatureGroupName: "f123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("FlowDefinition", () =>
    pipe([
      () => ({
        groupType: "SageMaker::FlowDefinition",
        livesNotFound: ({ config }) => [{ FlowDefinitionName: "f123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("HumanTaskUi", () =>
    pipe([
      () => ({
        groupType: "SageMaker::HumanTaskUi",
        livesNotFound: ({ config }) => [{ HumanTaskUiName: "h123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("Image", () =>
    pipe([
      () => ({
        groupType: "SageMaker::Image",
        livesNotFound: ({ config }) => [{ ImageName: "i123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("ImageVersion", () =>
    pipe([
      () => ({
        groupType: "SageMaker::ImageVersion",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Model", () =>
    pipe([
      () => ({
        groupType: "SageMaker::Model",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ModelPackageGroup", () =>
    pipe([
      () => ({
        groupType: "SageMaker::ModelPackageGroup",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ModelPackageGroupPolicy", () =>
    pipe([
      () => ({
        groupType: "SageMaker::ModelPackageGroupPolicy",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("NotebookInstance", () =>
    pipe([
      () => ({
        groupType: "SageMaker::NotebookInstance",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("NotebookInstanceLifecycleConfig", () =>
    pipe([
      () => ({
        groupType: "SageMaker::NotebookInstanceLifecycleConfig",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Project", () =>
    pipe([
      () => ({
        groupType: "SageMaker::Project",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ServiceCatalogPortfolioStatus", () =>
    pipe([
      () => ({
        groupType: "SageMaker::ServiceCatalogPortfolioStatus",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Space", () =>
    pipe([
      () => ({
        groupType: "SageMaker::Space",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("StudioLifeCycleConfig", () =>
    pipe([
      () => ({
        groupType: "SageMaker::StudioLifeCycleConfig",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("UserProfile", () =>
    pipe([
      () => ({
        groupType: "SageMaker::UserProfile",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Workforce", () =>
    pipe([
      () => ({
        groupType: "SageMaker::Workforce",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("WorkTeam", () =>
    pipe([
      () => ({
        groupType: "SageMaker::WorkTeam",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
