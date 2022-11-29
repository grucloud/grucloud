const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");
const { compareAws } = require("../AwsCommon");

const GROUP = "OpenSearch";

const compare = compareAws({});

const { OpenSearchDomain } = require("./OpenSearchDomain");
//const { OpenSearchInboundConnectionAccepter } = require("./OpenSearchInboundConnectionAccepter");
//const { OpenSearchOutboundConnection } = require("./OpenSearchOutboundConnection");
const { OpenSearchVpcEndpoint } = require("./OpenSearchVpcEndpoint");

module.exports = pipe([
  () => [
    OpenSearchDomain({ compare }),
    // OpenSearchInboundConnectionAccepter({})
    // OpenSearchOutboundConnection({})
    OpenSearchVpcEndpoint({ compare }),
  ],
  map(createAwsService),
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
    })
  ),
]);
