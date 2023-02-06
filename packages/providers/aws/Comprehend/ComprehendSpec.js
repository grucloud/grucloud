const assert = require("assert");
const { tap, pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const GROUP = "Comprehend";

const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

const {
  ComprehendDocumentClassifier,
} = require("./ComprehendDocumentClassifier");

const { ComprehendEntityRecognizer } = require("./ComprehendEntityRecognizer");

module.exports = pipe([
  () => [
    //
    ComprehendDocumentClassifier({}),
    ComprehendEntityRecognizer({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
        tagsKey,
      }),
    ])
  ),
]);
