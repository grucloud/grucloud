const assert = require("assert");
const { tap, pipe, map, get, switchCase, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const GROUP = "Comprehend";

const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

const {
  ComprehendDocumentClassifier,
} = require("./ComprehendDocumentClassifier");

module.exports = pipe([
  () => [
    //
    ComprehendDocumentClassifier({}),
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
