const assert = require("assert");
const { get, switchCase, all, transform, map, tap, pipe } = require("rubico");
const { detailedDiff } = require("deep-object-diff");

const live = {
  rules: [
    {
      destinations: [
        {
          region: "us-east-2",
        },
      ],
      repositoryFilters: undefined,
    },
  ],
};

const target = {
  rules: [
    {
      destinations: [
        {
          region: "us-east-2",
        },
      ],
    },
  ],
};

describe("detailedDiff", function () {
  it("detailedDiff undefined", async function () {
    const resultTargetLive = detailedDiff(target, live);
    const resultLiveTarget = detailedDiff(live, target);
    assert(resultTargetLive);
    assert(resultLiveTarget);
  });
});
