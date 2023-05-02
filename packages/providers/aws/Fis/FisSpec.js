const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const GROUP = "Fis";
const tagsKey = "tags";
const compare = compareAws({ tagsKey, key: "key" });

const { FisExperimentTemplate } = require("./FisExperimentTemplate");

module.exports = pipe([
  () => [
    //
    FisExperimentTemplate({}),
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
