const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CostExplorer.html

const { CostExplorerAnomalyMonitor } = require("./CostExplorerAnomalyMonitor");
const {
  CostExplorerAnomalySubscription,
} = require("./CostExplorerAnomalySubscription");
const {
  CostExplorerCostAllocationTag,
} = require("./CostExplorerCostAllocationTag");
const { CostExplorerCostCategory } = require("./CostExplorerCostCategory");

const GROUP = "CostExplorer";
const compare = compareAws({});

module.exports = pipe([
  () => [
    CostExplorerAnomalyMonitor({}),
    CostExplorerAnomalySubscription({}),
    CostExplorerCostAllocationTag({}),
    CostExplorerCostCategory({}),
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
