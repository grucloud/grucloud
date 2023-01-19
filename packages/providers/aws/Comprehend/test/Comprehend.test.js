const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

const config = () => ({ includeGroups: ["Comprehend"] });

describe("Comprehend", async function () {
  it.skip("DocumentClassifier", () =>
    pipe([
      () => ({
        config,
        groupType: "Comprehend::DocumentClassifier",
        livesNotFound: ({ config }) => [
          { EndpointArn: "DocumentClassifierArn" },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("Endpoint", () =>
    pipe([
      () => ({
        config,
        groupType: "Comprehend::Endpoint",
        livesNotFound: ({ config }) => [{ EndpointArn: "b123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("EntityRecognizer", () =>
    pipe([
      () => ({
        config,
        groupType: "Comprehend::EntityRecognizer",
        livesNotFound: ({ config }) => [{ EntityRecognizerArn: "b123" }],
      }),
      awsResourceTest,
    ])());
});
