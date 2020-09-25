const assert = require("assert");
const { GoogleProvider } = require("../GoogleProvider");
const { ConfigLoader } = require("ConfigLoader");
const { pipe, tap, map, get, filter } = require("rubico");
const { find, isDeepEqual } = require("rubico/x");

describe("GcpIamPolicy", async function () {
  let config;
  let provider;
  let iamPolicy;
  const bindingEditor = {
    role: "roles/editor",
    members: ["serviceAccount:grucloud@grucloud-e2e.iam.gserviceaccount.com"],
  };

  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/multi" });
    } catch (error) {
      this.skip();
    }

    provider = await GoogleProvider({
      name: "google",
      config: config.google,
    });

    iamPolicy = await provider.makeIamPolicy({
      name: "iam-policy",
      properties: () => ({
        policy: {
          bindings: [bindingEditor],
        },
      }),
    });

    const { error } = await provider.destroyAll();
    assert(!error, "destroyAll failed");
  });
  after(async () => {
    //await provider?.destroyAll();
  });
  it("iamPolicy config", async function () {
    const iamPolicyLive = await iamPolicy.getLive();
    const config = await iamPolicy.resolveConfig({ live: iamPolicyLive });
    assert(
      find((binding) => binding.role === "roles/owner")(config.policy.bindings)
    );
    assert(config.policy.etag);
  });
  it("lives", async function () {
    const { results: lives } = await provider.listLives({
      types: "IamPolicy",
    });
    assert(lives[0].resources.length >= 1);
  });
  it("plan", async function () {
    const plan = await provider.planQuery();
    assert.equal(plan.resultDestroy.plans.length, 0);
    assert.equal(plan.resultCreate.plans.length, 1);
    const planUpdate = plan.resultCreate.plans[0];
    assert.equal(planUpdate.action, "UPDATE");
    assert(planUpdate.config);
    assert(planUpdate.config.policy.etag);
    assert(planUpdate.config.policy.bindings);

    assert(planUpdate.live);
    assert(planUpdate.live.etag);
  });
  it("iamPolicy apply and destroy", async function () {
    const { error, resultCreate } = await provider.planQueryAndApply();
    assert(!error, "should have failed");
    const live = await iamPolicy.getLive();
    assert(
      find((binding) => isDeepEqual(binding, bindingEditor))(live.bindings)
    );
  });
});
