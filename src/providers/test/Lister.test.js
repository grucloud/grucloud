const assert = require("assert");
const sinon = require("sinon");
const { Lister } = require("../Lister");

describe("Lister", function () {
  const executorOk = sinon
    .stub()
    .returns(Promise.resolve({ total: 0, items: [] }));

  const onStateChange = (stateChanges) => ({ type, nextState, ...other }) => {
    if (nextState === "RUNNING") {
      type && stateChanges.push(type);
    }
  };

  it("lister ok", async function () {
    const stateChanges = [];
    const inputs = [
      {
        meta: { type: "Volume", providerName: "k8s" },
        key: "k8s::Volume",
        executor: executorOk,
      },
      {
        meta: { type: "Volume", providerName: "k8s" },
        key: "k8s::VolumeClaim",
        executor: executorOk,
        dependsOn: ["k8s::Volume"],
      },
    ];
    const { error, results } = await Lister({
      inputs,
      onStateChange: onStateChange(stateChanges),
    });

    assert(!error);
    assert(results);
  });
});
