const assert = require("assert");
const {
  pipe,
  tryCatch,
  tap,
  get,
  map,
  not,
  and,
  filter,
  or,
  eq,
} = require("rubico");
const { defaultsDeep, size, identity, isEmpty } = require("rubico/x");
const logger = require("@grucloud/core/logger")({ prefix: "AwsCloudControl" });
const { retryCall } = require("@grucloud/core/Retry");
const {
  createEndpoint,
  assignTags,
  findNameInTagsOrId,
} = require("./AwsCommon");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudControl.html
// https://docs.aws.amazon.com/cloudcontrolapi/latest/userguide/supported-resources.html

exports.AwsCloudControl =
  ({ findName = findNameInTagsOrId, decorateList = () => identity }) =>
  ({ spec, config }) => {
    const { type, group } = spec;
    assert(type);
    assert(group);
    assert(config);
    assert(findName);

    const cloudControl = () =>
      createEndpoint({ endpointName: "CloudControl" })(config);

    const TypeName = `AWS::${group}::${type}`;

    const getList = ({ lives } = {}) =>
      pipe([
        tap((params) => {
          logger.debug(`getList ${TypeName}`);
        }),
        () => ({
          TypeName,
        }),
        cloudControl().listResources,
        tap((params) => {
          assert(true);
        }),
        get("ResourceDescriptions"),
        tap((params) => {
          assert(true);
        }),
        map(decorateList({ lives })),
        tap((params) => {
          assert(true);
        }),
        //TODO
        //map(assignTags),
        tap((items) => {
          assert(Array.isArray(items));
          logger.debug(`getList ${type} #items ${size(items)}`);
        }),
        filter(not(isEmpty)),
      ])();

    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudControl.html#createResource-property
    const create = ({ name, payload }) =>
      tryCatch(
        pipe([
          tap(() => {
            logger.debug(`create ${TypeName} ${name}`);
            assert(name);
          }),
          () => payload,
          JSON.stringify,
          tap((params) => {
            assert(true);
          }),
          (DesiredState) => ({ TypeName, DesiredState }),
          cloudControl().createResource,
          tap((params) => {
            assert(true);
          }),
          get("ProgressEvent"),
          tap((ProgressEvent) => {
            logger.debug(
              `create ${TypeName} ${name} ProgressEvent: ${JSON.stringify(
                ProgressEvent
              )}`
            );
          }),
          ({ RequestToken }) =>
            retryCall({
              name: `create getResourceRequestStatus ${TypeName} ${name}, ${RequestToken}`,
              fn: pipe([
                // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudControl.html#getResourceRequestStatus-property
                tap(() => {
                  assert(RequestToken);
                }),
                () => ({ RequestToken }),
                cloudControl().getResourceRequestStatus,
                get("ProgressEvent"),
                tap((ProgressEvent) => {
                  logger.debug(
                    `create ${TypeName} new ProgressEvent: ${JSON.stringify(
                      ProgressEvent
                    )}`
                  );
                }),
              ]),
              isExpectedResult: or([eq(get("OperationStatus"), "SUCCESS")]),
            }),
          tap(() => {
            logger.debug(`create ${TypeName} ${name} done`);
          }),
        ]),
        (error) =>
          pipe([
            tap(() => {
              logger.error(
                `error creating ${TypeName}, ${name} ${JSON.stringify({
                  error,
                })}`
              );
              logger.error(error.stack);
            }),
            () => {
              throw error;
            },
          ])()
      )();

    const update =
      ({
        preUpdate = ({ live }) => identity,
        method,
        config,
        pickId = () => ({}),
        extraParam = {},
        filterParams = ({ pickId, payload, diff, live }) =>
          pipe([
            () => diff,
            get("liveDiff.updated", {}),
            defaultsDeep(get("liveDiff.added", {})(diff)),
            defaultsDeep(pickId(live)),
          ])(),
        getById,
        isInstanceUp = identity,
      }) =>
      ({ name, payload, diff, live, compare }) =>
        pipe([
          tap(() => {
            assert(method);
            assert(pickId);
            assert(compare);
            assert(getById);
            logger.debug(
              `update ${type}, ${name}, ${JSON.stringify({
                payload,
                live,
                diff,
              })}`
            );
          }),
          preUpdate({ live, payload }),
          () => filterParams({ pickId, extraParam, payload, diff, live }),
          defaultsDeep(extraParam),
          tap((params) => {
            assert(params);
            logger.debug(
              `update ${type}, ${name}, params: ${JSON.stringify(
                params,
                null,
                4
              )}`
            );
          }),
          tryCatch(
            pipe([
              endpoint()[method],
              () => live,
              (params) =>
                retryCall({
                  name: `isUpById: ${name}`,
                  fn: pipe([
                    () => params,
                    getById,
                    tap((params) => {
                      assert(true);
                    }),
                    and([
                      isInstanceUp,
                      pipe([
                        (live) => compare({ live, target: payload }),
                        tap((diff) => {
                          logger.debug(
                            `updating ${type}, ${name}, diff: ${JSON.stringify(
                              diff,
                              null,
                              4
                            )}`
                          );
                        }),
                        and([
                          pipe([get("liveDiff"), isEmpty]),
                          pipe([get("targetDiff"), isEmpty]),
                        ]),
                      ]),
                    ]),
                  ]),
                  config,
                }),
            ]),
            (error, params) =>
              pipe([
                tap(() => {
                  logger.debug(
                    `error updating ${type}, ${name}, ${JSON.stringify(params)}`
                  );
                }),
                () => {
                  throw error;
                },
              ])()
          ),
          tap(() => {
            logger.debug(`updated ${type}, ${name}`);
          }),
        ])();

    const destroy = ({ name, live, lives }) =>
      pipe([
        tap(() => {
          assert(config);
        }),
        () => live,
        get("Identifier"),
        tap((Identifier) => {
          assert(Identifier);
        }),
        (Identifier) =>
          tryCatch(
            pipe([
              tap(() => {
                logger.debug(`destroy ${TypeName} ${Identifier}`);
              }),
              () => ({ Identifier, TypeName }),
              cloudControl().deleteResource,
              tap((params) => {
                assert(true);
              }),
              get("ProgressEvent"),
              tap((ProgressEvent) => {
                logger.debug(
                  `destroy ${TypeName} ${Identifier} ProgressEvent: ${JSON.stringify(
                    ProgressEvent
                  )}`
                );
              }),
              ({ RequestToken }) =>
                retryCall({
                  name: `destroy getResourceRequestStatus ${TypeName} ${Identifier}, ${RequestToken}`,
                  fn: pipe([
                    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudControl.html#getResourceRequestStatus-property
                    tap(() => {
                      assert(RequestToken);
                    }),
                    () => ({ RequestToken }),
                    cloudControl().getResourceRequestStatus,
                    get("ProgressEvent"),
                    tap((ProgressEvent) => {
                      logger.debug(
                        `destroy ${TypeName} new ProgressEvent: ${JSON.stringify(
                          ProgressEvent
                        )}`
                      );
                    }),
                  ]),
                  isExpectedResult: or([
                    eq(get("OperationStatus"), "SUCCESS"),
                    eq(get("ErrorCode"), "NotFound"),
                  ]),
                }),
              tap(() => {
                logger.debug(`destroy ${TypeName} ${Identifier} done`);
              }),
            ]),
            (error) =>
              pipe([
                tap(() => {
                  logger.error(
                    `error destroying ${TypeName}, ${JSON.stringify({
                      Identifier,
                      error,
                    })}`
                  );
                  logger.error(error.stack);
                }),
                () => {
                  throw error;
                },
              ])()
          )(),
      ])();

    return {
      spec,
      findName,
      getList,
      create,
      update,
      destroy,
    };
  };
