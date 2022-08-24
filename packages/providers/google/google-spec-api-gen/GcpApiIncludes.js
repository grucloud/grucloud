exports.ApisIncludes = [
  //
  "compute:v1",
  "iam:v1",
  //"run:v1",
  //"container:v1",
];

exports.ResourcesExcludes = [
  "compute::FirewallPolicy",
  "compute::GlobalOperation",
  "compute::GlobalOrganizationOperation",
  "compute::RegionOperation",
  "compute::RegionSecurityPolicy",
  "compute::ZoneOperation",
];
