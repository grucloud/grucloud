const assert = require("assert");
const { pipe, tap, reduce, fork } = require("rubico");
const { callProp, append } = require("rubico/x");
const { Netmask } = require("netmask");

// http://www.java2s.com/ref/javascript/javascript-number-integer-ip-address-convert-to-integer.html
const ipToInt32 = pipe([
  callProp("split", "."),
  reduce((acc, value) => acc * 256 + +value, 0),
]);

exports.ipToInt32 = ipToInt32;

// https://www.terraform.io/language/functions/cidrsubnet

exports.cidrsToNewBits = ({ vpcCidr, subnetCidr }) =>
  pipe([
    fork({
      vpc: () => new Netmask(vpcCidr),
      subnet: () => new Netmask(subnetCidr),
    }),
    ({ vpc, subnet }) => subnet.bitmask - vpc.bitmask,
  ])();

exports.cidrsToNetworkNumber = ({ vpcCidr, subnetCidr }) =>
  pipe([
    fork({
      vpc: () => new Netmask(vpcCidr),
      subnet: () => new Netmask(subnetCidr),
    }),
    ({ vpc, subnet }) =>
      (~vpc.maskLong & ipToInt32(subnet.base)) >>> (32 - subnet.bitmask),
  ])();

exports.cidrSubnetV4 = ({ cidr, newBits, networkNumber }) =>
  pipe([
    tap(() => {
      assert(cidr);
      assert(Number.isInteger(newBits));
      assert(Number.isInteger(networkNumber));
    }),
    () => new Netmask(cidr),
    ({ base, bitmask }) => new Netmask(`${base}/${bitmask + newBits}`),
    callProp("next", networkNumber),
    callProp("toString"),
  ])();

//TODO Use a proper ipv6 library
exports.cidrSubnetV6 =
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
