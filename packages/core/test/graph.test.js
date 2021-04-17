const assert = require("assert");
const { pipe, tap, map, eq, get } = require("rubico");
const { size, pluck, flatten } = require("rubico/x");
const logger = require("../logger")({ prefix: "GraphLive" });
//const gcList = require("./fixture/gc-list.json");
const gcList = [];

const { buildSubGraphLive, buildGraphAssociationLive } = require("../Graph");

describe("graph", function () {
  it("ok", async function () {
    const listProviders = gcList.result.results;
    assert(listProviders);
    const subGraph = buildSubGraphLive({
      providerName: listProviders[0].providerName,
      resourcesPerType: listProviders[0].results,
    });

    const association = buildGraphAssociationLive({
      resourcesPerType: listProviders[0].results,
    });
  });
});
