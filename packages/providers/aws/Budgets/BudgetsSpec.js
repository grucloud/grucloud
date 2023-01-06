const assert = require("assert");
const { tap, pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const GROUP = "Budgets";

// TODO no tags for budgets
const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "key" });

const { BudgetsBudget } = require("./BudgetsBudget");

module.exports = pipe([
  () => [BudgetsBudget({ compare })],
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
