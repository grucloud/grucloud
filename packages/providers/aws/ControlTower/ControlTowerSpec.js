const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

const { ControlTowerControl } = require("./ControlTowerControl");

const GROUP = "ControlTower";
const compareControlTower = compareAws({});

module.exports = pipe([
  () => [
    //
    ControlTowerControl({}),
  ],
  map(createAwsService),
  map(
    defaultsDeep({
      group: GROUP,
      compare: compareControlTower({}),
    })
  ),
]);
