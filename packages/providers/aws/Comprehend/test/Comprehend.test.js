const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

const config = () => ({ includeGroups: ["Comprehend"] });

describe("Comprehend", async function () {
  it.skip("DominantLanguageDetectionJob", () =>
    pipe([
      () => ({
        config,
        groupType: "Comprehend::DominantLanguageDetectionJob",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("DocumentClassifier", () =>
    pipe([
      () => ({
        config,
        groupType: "Comprehend::DocumentClassifier",
        livesNotFound: ({ config }) => [
          {
            DocumentClassifierArn: `arn:${config.partition}:comprehend:${
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
  it.skip("EntitiesDetectionJob", () =>
    pipe([
      () => ({
        config,
        groupType: "Comprehend::EntitiesDetectionJob",
        livesNotFound: ({ config }) => [{}],
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
            EntityRecognizerArn: `arn:${config.partition}:comprehend:${
              config.region
            }:${config.accountId()}:entity-recognizer/m1`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("KeyPhrasesDetectionJob", () =>
    pipe([
      () => ({
        config,
        groupType: "Comprehend::KeyPhrasesDetectionJob",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("SentimentDetectionJob", () =>
    pipe([
      () => ({
        config,
        groupType: "Comprehend::SentimentDetectionJob",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
