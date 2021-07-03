const { AwsProvider } = require("@grucloud/provider-aws");
const AdmZip = require("adm-zip");

const lambdaPolicy = require("./lambdaPolicy.json");
const lambdaAssumePolicy = require("./lambdaAssumePolicy.json");

const createResources = async ({ provider }) => {
  const { config } = provider;

  const iamPolicy = provider.iam.makePolicy({
    name: "lambda-policy",
    properties: () => lambdaPolicy,
  });

  const iamRole = provider.iam.makeRole({
    name: "lambda-role",
    dependencies: { policies: [iamPolicy] },
    properties: () => lambdaAssumePolicy,
  });

  const zip = new AdmZip();
  zip.addLocalFile("helloworld.js");

  const lambda = provider.makeFunction({
    name: "lambda-hello-world-1",
    dependencies: { role: iamRole },
    properties: () => ({
      Code: { ZipFile: zip.toBuffer() },
      PackageType: "Zip",
      Handler: "helloworld.handler",
      Runtime: "nodejs14.x",
    }),
  });

  return {};
};

exports.createStack = async ({ config, stage }) => {
  const provider = AwsProvider({ config, stage });
  const resources = await createResources({ provider });

  return {
    provider,
    resources,
    hooks: [require("./hook")],
  };
};
