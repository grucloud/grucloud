const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");

const { isOurMinion, compareAws } = require("../AwsCommon");
const { StepFunctionsStateMachine } = require("./StepFunctionsStateMachine");

const GROUP = "StepFunctions";
const tagsKey = "tags";
const compare = compareAws({ tagsKey });

module.exports = pipe([
  () => [
    //
    StepFunctionsStateMachine({ compare }),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        isOurMinion,
        tagsKey,
        compare: compare({}),
      }),
    ])
  ),
]);
