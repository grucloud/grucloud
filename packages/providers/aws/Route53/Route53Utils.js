const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  switchCase,
  pick,
  filter,
  assign,
  fork,
  or,
  not,
  eq,
  omit,
  and,
} = require("rubico");
const {
  find,
  pluck,
  defaultsDeep,
  isEmpty,
  differenceWith,
  isDeepEqual,
  flatten,
} = require("rubico/x");

exports.filterEmptyResourceRecords = switchCase([
  pipe([get("ResourceRecords"), isEmpty]),
  omit(["ResourceRecords"]),
  (ResourceRecordSet) => ResourceRecordSet,
]);
