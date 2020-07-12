const assert = require("assert");
const sinon = require("sinon");
const {
  azSpecs,
  azPlansCreate,
  azPlansDestroy,
  awsSpecs,
  awsPlansCreate,
  awsPlansDestroy,
} = require("./PlannerFixtures");
const { Planner } = require("../Planner");

const checkOk = (success, results) => {
  assert(results[0].item);
  //assert(results[0].input);
  //assert(results[0].output);
  assert(!results[0].error);
  assert(success);
};

const checkError = (success, results) => {
  assert(results[0].item);
  assert(!results[0].input);
  assert(!results[0].output);
  assert(results[0].error);
  assert(!success);
};

describe("Planner", function () {
  const executorOk = sinon
    .stub()
    .returns(Promise.resolve({ input: {}, output: { success: true } }));

  const onStateChange = (stateChanges) => ({
    resource,
    previousState,
    nextState,
  }) => {
    assert(resource);
    if (nextState === "RUNNING") {
      stateChanges.push(resource.type);
    }
  };
  it("az create ok", async function () {
    const stateChanges = [];
    const planner = Planner({
      plans: azPlansCreate(),
      specs: azSpecs,
      executor: executorOk,
      onStateChange: onStateChange(stateChanges),
    });

    const { success, results } = await planner.run();
    assert(results);
    assert.equal(results.length, azPlansCreate().length);

    assert.equal(
      [
        "ResourceGroup",
        "VirtualNetwork",
        "SecurityGroup",
        "NetworkInterface",
      ].join(","),
      stateChanges.join(",")
    );

    checkOk(success, results);
  });
  it("az create ok partial", async function () {
    const stateChanges = [];
    const planner = Planner({
      plans: azPlansCreate().slice(0, 2),
      specs: azSpecs,
      executor: executorOk,
      onStateChange: onStateChange(stateChanges),
    });
    const { success, results } = await planner.run();
    assert.equal(results.length, 2);
    checkOk(success, results);
  });
  it("az destroy ok", async function () {
    const stateChanges = [];
    const planner = Planner({
      plans: azPlansDestroy(),
      specs: azSpecs,
      executor: executorOk,
      down: true,
      onStateChange: onStateChange(stateChanges),
    });
    const { success, results } = await planner.run();
    checkOk(success, results);
    assert.equal(
      [
        "NetworkInterface",
        "VirtualNetwork",
        "SecurityGroup",
        "ResourceGroup",
      ].join(","),
      stateChanges.join(",")
    );
  });
  it("az create reject partial", async function () {
    const stateChanges = [];
    const planner = Planner({
      plans: azPlansCreate().slice(0, 2),
      specs: azSpecs,
      executor: sinon.stub().returns(Promise.reject({ error: true })),
      onStateChange: onStateChange(stateChanges),
    });
    const { success, results } = await planner.run();
    assert.equal(results.length, 2);
    checkError(success, results);
  });

  it("aws destroy ok full", async function () {
    const stateChanges = [];
    const planner = Planner({
      plans: awsPlansDestroy(),
      specs: awsSpecs,
      executor: executorOk,
      down: true,
      onStateChange: onStateChange(stateChanges),
    });
    const { success, results } = await planner.run();
    assert.equal(results.length, 5);
    assert.equal(
      ["RouteTables", "Instance", "Subnet", "SecurityGroup", "Vpc"].join(","),
      stateChanges.join(",")
    );
    checkOk(success, results);
  });

  it("aws deploy ok partial", async function () {
    const stateChanges = [];
    const planner = Planner({
      plans: awsPlansCreate().slice(0, 3),
      specs: awsSpecs,
      executor: executorOk,
      onStateChange: onStateChange(stateChanges),
    });
    const { success, results } = await planner.run();
    assert.equal(results.length, 3);
    assert.equal(
      ["Vpc", "Subnet", "RouteTables"].join(","),
      stateChanges.join(",")
    );
    checkOk(success, results);
  });
  it("aws destroy ok partial", async function () {
    const stateChanges = [];
    const planner = Planner({
      plans: awsPlansDestroy().slice(0, 3),
      specs: awsSpecs,
      executor: executorOk,
      down: true,
      onStateChange: onStateChange(stateChanges),
    });
    const { success, results } = await planner.run();
    assert.equal(results.length, 3);
    assert.equal(
      ["RouteTables", "Subnet", "Vpc"].join(","),
      stateChanges.join(",")
    );
    checkOk(success, results);
  });
});
