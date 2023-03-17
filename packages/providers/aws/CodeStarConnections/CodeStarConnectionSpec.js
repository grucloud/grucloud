const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");
const {
  CodeStarConnectionsConnection,
} = require("./CodeStarConnectionsConnection");

//TODO Host

const GROUP = "CodeStarConnections";
const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

module.exports = pipe([
  () => [
    //
    CodeStarConnectionsConnection({}),
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
