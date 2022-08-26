exports.ApisIncludes = [
  "cloudresourcemanager:v3",
  "compute:v1",
  "iam:v1",
  "run:v1",
  "storage:v1",
];

exports.ResourcesExcludes = [
  "compute::licenseCodes",
  "compute::firewallPolicies",
  "compute::globalOperations",
  "compute::globalOrganizationOperations",
  "compute::networkEdgeSecurityServices",
  "compute::regionOperations",
  "compute::regionSecurityPolicies",
  "compute::zoneOperations",
  "cloudresourcemanager::liens", // TODO 400 Unknown resource type
  "cloudresourcemanager::folders", // TODO getList depends on organization
  "cloudresourcemanager::projects", // TODO getList depends on organization
  "cloudresourcemanager::tagBindings", // TODO getList depends any resource
  "cloudresourcemanager::tagKeys", // TODO getList depends any resource
  "cloudresourcemanager::tagValues", // TODO getList depends any resource
  "cloudresourcemanager::tagValues.tagHolds", // TODO getList depends any resource
  "iam::projects.locations.workloadIdentityPools",
  "iam::projects.locations.workloadIdentityPools.providers",
  "run::projects.locations.routes",
  "run::projects.locations.revisions",
  "run::projects.locations.services",
];
