const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("SageMaker", async function () {
  it("App", () =>
    pipe([
      () => ({
        groupType: "SageMaker::App",
        livesNotFound: ({ config }) => [
          {
            AppName: "app",
            AppType: "JupyterServer",
            DomainId: "d-123456789",
            UserProfileName: "u1234",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("AppImageConfig", () =>
    pipe([
      () => ({
        groupType: "SageMaker::AppImageConfig",
        livesNotFound: ({ config }) => [{ AppImageConfigName: "c123" }],
      }),
      awsResourceTest,
    ])());
  it("CodeRepository", () =>
    pipe([
      () => ({
        groupType: "SageMaker::CodeRepository",
        livesNotFound: ({ config }) => [{ CodeRepositoryName: "c1234" }],
      }),
      awsResourceTest,
    ])());
  it("DataQualityJobDefinition", () =>
    pipe([
      () => ({
        groupType: "SageMaker::DataQualityJobDefinition",
        livesNotFound: ({ config }) => [{ JobDefinitionName: "j123" }],
      }),
      awsResourceTest,
    ])());
  it("Device", () =>
    pipe([
      () => ({
        groupType: "SageMaker::Device",
        livesNotFound: ({ config }) => [
          { DeviceFleetName: "dfn", DeviceName: "d123" },
        ],
      }),
      awsResourceTest,
    ])());

  it("DeviceFleet", () =>
    pipe([
      () => ({
        groupType: "SageMaker::DeviceFleet",
        livesNotFound: ({ config }) => [{ DeviceFleetName: "dfn" }],
      }),
      awsResourceTest,
    ])());
  it("Domain", () =>
    pipe([
      () => ({
        groupType: "SageMaker::Domain",
        livesNotFound: ({ config }) => [{ DomainId: "d-123456789" }],
      }),
      awsResourceTest,
    ])());
  it("Endpoint", () =>
    pipe([
      () => ({
        groupType: "SageMaker::Endpoint",
        livesNotFound: ({ config }) => [{ EndpointName: "e123" }],
      }),
      awsResourceTest,
    ])());
  it("EndpointConfig", () =>
    pipe([
      () => ({
        groupType: "SageMaker::EndpointConfig",
        livesNotFound: ({ config }) => [{ EndpointConfigName: "e123" }],
      }),
      awsResourceTest,
    ])());
  it("FeatureGroup", () =>
    pipe([
      () => ({
        groupType: "SageMaker::FeatureGroup",
        livesNotFound: ({ config }) => [{ FeatureGroupName: "f123" }],
      }),
      awsResourceTest,
    ])());
  it("FlowDefinition", () =>
    pipe([
      () => ({
        groupType: "SageMaker::FlowDefinition",
        livesNotFound: ({ config }) => [{ FlowDefinitionName: "f123" }],
      }),
      awsResourceTest,
    ])());
  it("HumanTaskUi", () =>
    pipe([
      () => ({
        groupType: "SageMaker::HumanTaskUi",
        livesNotFound: ({ config }) => [{ HumanTaskUiName: "h123" }],
      }),
      awsResourceTest,
    ])());
  it("Image", () =>
    pipe([
      () => ({
        groupType: "SageMaker::Image",
        livesNotFound: ({ config }) => [{ ImageName: "i123" }],
      }),
      awsResourceTest,
    ])());
  it("ImageVersion", () =>
    pipe([
      () => ({
        groupType: "SageMaker::ImageVersion",
        livesNotFound: ({ config }) => [{ ImageName: "i123", Version: 1 }],
      }),
      awsResourceTest,
    ])());
  it("Model", () =>
    pipe([
      () => ({
        groupType: "SageMaker::Model",
        livesNotFound: ({ config }) => [{ ModelName: "m123" }],
      }),
      awsResourceTest,
    ])());
  it("ModelPackageGroup", () =>
    pipe([
      () => ({
        groupType: "SageMaker::ModelPackageGroup",
        livesNotFound: ({ config }) => [{ ModelPackageGroupName: "m123" }],
      }),
      awsResourceTest,
    ])());
  it("ModelPackageGroupPolicy", () =>
    pipe([
      () => ({
        groupType: "SageMaker::ModelPackageGroupPolicy",
        livesNotFound: ({ config }) => [{ ModelPackageGroupName: "m123" }],
      }),
      awsResourceTest,
    ])());
  it("MonitoringSchedule", () =>
    pipe([
      () => ({
        groupType: "SageMaker::MonitoringSchedule",
        livesNotFound: ({ config }) => [{ MonitoringScheduleName: "m123" }],
      }),
      awsResourceTest,
    ])());
  it("NotebookInstance", () =>
    pipe([
      () => ({
        groupType: "SageMaker::NotebookInstance",
        livesNotFound: ({ config }) => [{ NotebookInstanceName: "n123" }],
      }),
      awsResourceTest,
    ])());
  it("NotebookInstanceLifecycleConfig", () =>
    pipe([
      () => ({
        groupType: "SageMaker::NotebookInstanceLifecycleConfig",
        livesNotFound: ({ config }) => [
          { NotebookInstanceLifecycleConfigName: "n123" },
        ],
      }),
      awsResourceTest,
    ])());
  it("Project", () =>
    pipe([
      () => ({
        groupType: "SageMaker::Project",
        livesNotFound: ({ config }) => [{ ProjectName: "p123" }],
      }),
      awsResourceTest,
    ])());
  it("ServiceCatalogPortfolio", () =>
    pipe([
      () => ({
        groupType: "SageMaker::ServiceCatalogPortfolio",
        livesNotFound: ({ config }) => [{}],
        skipGetById: true,
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
  it("Space", () =>
    pipe([
      () => ({
        groupType: "SageMaker::Space",
        livesNotFound: ({ config }) => [
          { SpaceName: "s123", DomainId: "d-123456789" },
        ],
      }),
      awsResourceTest,
    ])());
  it("StudioLifecycleConfig", () =>
    pipe([
      () => ({
        groupType: "SageMaker::StudioLifecycleConfig",
        livesNotFound: ({ config }) => [{ StudioLifecycleConfigName: "d123" }],
      }),
      awsResourceTest,
    ])());
  it("UserProfile", () =>
    pipe([
      () => ({
        groupType: "SageMaker::UserProfile",
        livesNotFound: ({ config }) => [
          { UserProfileName: "s123", DomainId: "d-123456789" },
        ],
      }),
      awsResourceTest,
    ])());
  it("Workforce", () =>
    pipe([
      () => ({
        groupType: "SageMaker::Workforce",
        livesNotFound: ({ config }) => [{ WorkforceName: "w123" }],
      }),
      awsResourceTest,
    ])());
  it("Workteam", () =>
    pipe([
      () => ({
        groupType: "SageMaker::Workteam",
        livesNotFound: ({ config }) => [{ WorkteamName: "q123" }],
      }),
      awsResourceTest,
    ])());
});
