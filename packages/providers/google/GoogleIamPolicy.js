const assert = require("assert");

const { map, pipe, get, tap, filter, switchCase } = require("rubico");
const { isEmpty, find, uniq, isDeepEqual } = require("rubico/x");
const AxiosMaker = require("@grucloud/core/AxiosMaker");

const logger = require("@grucloud/core/logger")({ prefix: "GoogleIamPolicy" });
const { tos } = require("@grucloud/core/tos");
const { ServiceAccountEmail } = require("./GoogleCommon");

const rolesDefault = [
  "iam.serviceAccountAdmin",
  "compute.admin",
  "storage.admin",
  "storage.objectAdmin",
  "dns.admin",
  //"domains.admin",
  "editor",
  "resourcemanager.projectIamAdmin",
  "run.admin",
];

const bindingsAdd = ({ currentBindings, rolesToAdd, member }) =>
  pipe([
    () => map((role) => `roles/${role}`)(rolesToAdd),
    (rolesToAddPrefixed) =>
      pipe([
        tap(() => {
          console.log(
            `Bind ${rolesToAdd.length} roles: ${rolesToAdd.join(
              ", "
            )} to member: ${member}`
          );
        }),
        map(({ role, members }) => {
          if (rolesToAddPrefixed.includes(role)) {
            return { role, members: uniq([...members, member]) };
          } else {
            return { role, members };
          }
        }),
        (bindings) =>
          pipe([
            () =>
              filter(
                (role) => !find((binding) => binding.role === role)(bindings)
              )(rolesToAddPrefixed),
            map((role) => ({ role, members: [member] })),
            (newBindings) => [...bindings, ...newBindings],
          ])(),
        tap((xx) => {
          logger.debug("bindingsAdd");
        }),
      ])(currentBindings),
  ])();

const bindingsRemove = ({ currentBindings, memberToRemove }) =>
  pipe([
    tap(() => {
      console.log(`Remove Bindings for member: ${memberToRemove}`);
    }),
    map(({ role, members }) => {
      return {
        role,
        members: pipe([
          filter((member) => member != memberToRemove),
          filter((member) => !member.startsWith("deleted:")),
        ])(members),
      };
    }),
    filter((binding) => !isEmpty(binding.members)),
    tap((xx) => {
      logger.debug("bindingsRemove");
    }),
  ])(currentBindings);

const createAxiosIam = ({ projectId, accessToken }) =>
  AxiosMaker({
    baseURL: `https://cloudresourcemanager.googleapis.com/v1/projects/${projectId}`,
    onHeaders: () => ({
      Authorization: `Bearer ${accessToken}`,
    }),
  });

const MemberServiceAccount = ({ serviceAccountName, projectId }) =>
  `serviceAccount:${ServiceAccountEmail({
    serviceAccountName,
    projectId,
  })}`;

exports.iamPolicyAdd = async ({
  accessToken,
  projectId,
  serviceAccountName,
}) => {
  const axios = createAxiosIam({ projectId, accessToken });
  const member = MemberServiceAccount({ serviceAccountName, projectId });

  return pipe([
    tap(() => {
      logger.debug("getting iam policy");
    }),
    () => axios.post(":getIamPolicy"),
    get("data"),
    (currentPolicy) =>
      pipe([
        () => ({
          etag: currentPolicy.etag,
          bindings: bindingsAdd({
            currentBindings: currentPolicy.bindings,
            rolesToAdd: rolesDefault,
            member,
          }),
        }),
        switchCase([
          (newPolicy) =>
            !isDeepEqual(currentPolicy.bindings, newPolicy.bindings),
          pipe([
            tap((newPolicy) => {
              logger.debug(`updating iam policy`);
              logger.debug(tos(currentPolicy));
              logger.debug(`new policy:`);
              logger.debug(tos(newPolicy));
            }),
            (policy) => axios.post(":setIamPolicy", { policy }),
            tap((xx) => {
              logger.debug("iam policy updated");
            }),
          ]),
          tap(() => {
            console.log(`Iam policy already up to date`);
          }),
        ]),
      ])(),
  ])();
};

exports.iamPolicyRemove = async ({
  accessToken,
  projectId,
  serviceAccountName,
}) => {
  const axios = createAxiosIam({ projectId, accessToken });
  const memberToRemove = MemberServiceAccount({
    serviceAccountName,
    projectId,
  });

  console.log(`Removing Iam binding for member ${memberToRemove} `);

  return pipe([
    tap(() => {
      logger.debug("getting iam policy");
    }),
    () => axios.post(":getIamPolicy"),
    get("data"),
    (currentPolicy) =>
      pipe([
        tap(() => {
          logger.debug("iamPolicyRemove ");
        }),
        () => ({
          etag: currentPolicy.etag,
          bindings: bindingsRemove({
            currentBindings: currentPolicy.bindings,
            memberToRemove,
          }),
        }),
        switchCase([
          (newPolicy) =>
            !isDeepEqual(currentPolicy.bindings, newPolicy.bindings),
          pipe([
            tap((newPolicy) => {
              logger.debug(`updating iam policy`);
              logger.debug(tos(currentPolicy));
              logger.debug(`new policy:`);
              logger.debug(tos(newPolicy));
            }),
            (policy) => axios.post(":setIamPolicy", { policy }),
            tap((xx) => {
              logger.debug("iam policy updated");
            }),
          ]),
          tap(() => {
            console.log(`Iam policy already up to date`);
          }),
        ]),
      ])(),
  ])();
};
