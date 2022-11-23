const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");
const { compareAws } = require("../AwsCommon");

const GROUP = "OpenSearch";

const compare = compareAws({});

const { OpenSearchDomain } = require("./OpenSearchDomain");
//const { OpenSearchDomainPolicy } = require("./OpenSearchDomainPolicy");
//const { OpenSearchDomainSamlOption } = require("./OpenSearchDomainSamlOption");
//const { OpenSearchInboundConnectionAccepter } = require("./OpenSearchInboundConnectionAccepter");
//const { OpenSearchOutboundConnection } = require("./OpenSearchOutboundConnection");

module.exports = pipe([
  () => [
    OpenSearchDomain({}),
    // OpenSearchDomainPolicy({})
    // OpenSearchDomainSamlOption({})
    // OpenSearchInboundConnectionAccepter({})
    // OpenSearchOutboundConnection({})
  ],
  tap((params) => {
    assert(true);
  }),

  map(createAwsService),
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
    })
  ),
]);
