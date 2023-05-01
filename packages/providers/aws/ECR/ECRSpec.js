const assert = require("assert");
const { tap, map, pipe } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

const { ECRRepository } = require("./EcrRepository");
const { ECRRegistry } = require("./EcrRegistry");

const GROUP = "ECR";

const tagsKey = "tags";
const compare = compareAws({ tagsKey });

module.exports = pipe([
  () => [
    //
    ECRRegistry({ compare }),
    ECRRepository({ compare }),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        tagsKey,
        compare: compare({}),
      }),
    ])
  ),
]);
