const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

const config = () => ({ includeGroups: ["Comprehend"] });

describe("Comprehend", async function () {
  it("DocumentClassifier", () =>
    pipe([
      () => ({
        config,
        groupType: "Comprehend::DocumentClassifier",
        livesNotFound: ({ config }) => [
          {
            DocumentClassifierArn: `arn:aws:comprehend:${
              config.region
            }:${config.accountId()}:document-classifier/m1`,
          },
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
  it("EntityRecognizer", () =>
    pipe([
      () => ({
        config,
        groupType: "Comprehend::EntityRecognizer",
        livesNotFound: ({ config }) => [
          {
            EntityRecognizerArn: `arn:aws:comprehend:${
              config.region
            }:${config.accountId()}:entity-recognizer/m1`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
