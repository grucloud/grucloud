const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

const GROUP = "Budgets";

// TODO no tags for budgets
const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "key" });

//const { BudgetsBudget } = require("./BudgetsBudget");

module.exports = pipe([
  () => [
    // {
    //   type: "Budget",
    //   Client: BudgetsBudget,
    //   propertiesDefault: {},
    //   omitProperties: [],
    //   inferName: get("properties.name"),
    // },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
      tagsKey,
    })
  ),
]);
