const assert = require("assert");
const { pipe, tap } = require("rubico");
const { callProp, append } = require("rubico/x");

//TODO Use a proper ipv6 library

exports.cidrSubnet =
  ({ subnetPrefix, prefixLength = "64" }) =>
  (ipv6Cidr) =>
    pipe([
      tap((params) => {
        assert(ipv6Cidr);
        assert(subnetPrefix);
      }),
      () => ipv6Cidr,
      callProp("split", "/"),
      ([address, prefixLengthSource]) =>
        pipe([
          tap((params) => {
            //TODO for now only aws vpc 56 prefix length
            assert.equal(prefixLengthSource, 56);
          }),
          () => address,
          callProp("slice", 0, -4),
          append(subnetPrefix),
          append("::/"),
          append(prefixLength),
          tap((params) => {
            assert(true);
          }),
        ])(),
    ])();
