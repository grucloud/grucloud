const assert = require("assert");
const { displayPlan } = require("../displayUtils");

describe("displayUtils", function () {
  it("displayPlan error", async function () {
    const plan = {
      providerName: "mock",
      newOrUpdate: [{ error: { message: "error" } }],
      destroy: [],
    };
    displayPlan(plan);
  });
  it("displayPlan ok", async function () {
    const plan = {
      providerName: "mock",
      newOrUpdate: [
        {
          action: "CREATE",
          resource: { name: "volume", type: "Volume" },
          config: {},
        },
      ],
      destroy: [],
    };
    displayPlan(plan);
  });
});
