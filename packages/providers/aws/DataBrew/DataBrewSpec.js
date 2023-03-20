const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const GROUP = "DataBrew";

// No tags
const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

// const { DataBrewDataSet } = require("./DataBrewDataSet");
// const { DataBrewJob } = require("./DataBrewJob");
// const { DataBrewProject } = require("./DataBrewProject");
// const { DataBrewRecipe } = require("./DataBrewRecipe");
// const { DataBrewRuleSet } = require("./DataBrewRuleSet");
// const { DataBrewSchedule } = require("./DataBrewSchedule");

module.exports = pipe([
  () => [
    //
    // DataBrewDataSet({}),
    // DataBrewJob({}),
    // DataBrewProject({}),
    // DataBrewRecipe({}),
    // DataBrewRuleSet({}),
    // DataBrewSchedule({}),
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
