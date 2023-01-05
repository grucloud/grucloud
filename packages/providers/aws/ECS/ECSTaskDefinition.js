const assert = require("assert");
const {
  map,
  pipe,
  tap,
  get,
  any,
  assign,
  eq,
  switchCase,
  or,
  not,
} = require("rubico");
const {
  defaultsDeep,
  first,
  pluck,
  flatten,
  includes,
  find,
  when,
  identity,
  callProp,
  unless,
  isEmpty,
  append,
} = require("rubico/x");

const { replaceRegion } = require("../AwsCommon");

const { omitIfEmpty, replaceWithName } = require("@grucloud/core/Common");

const { getField } = require("@grucloud/core/ProviderCommon");
const { Tagger, buildTagsEcs } = require("./ECSCommon");

const buildArn = () =>
  pipe([
    get("taskDefinitionArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const findId = () => get("taskDefinitionArn");

const pickId = pipe([
  tap(({ taskDefinitionArn }) => {
    assert(taskDefinitionArn);
  }),
  ({ taskDefinitionArn }) => ({
    taskDefinition: taskDefinitionArn,
  }),
]);

const decorate = () =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    ({ taskDefinition, tags }) => ({ ...taskDefinition, tags }),
    omitIfEmpty(["placementConstraints", "volumes"]),
    assign({
      containerDefinitions: pipe([
        get("containerDefinitions"),
        map(
          pipe([
            omitIfEmpty([
              "command",
              "dnsSearchDomains",
              "dnsServers",
              "dockerLabels",
              "dockerSecurityOptions",
              "entryPoint",
              "environment",
              "environmentFiles",
              "extraHosts",
              "links",
              "secrets",
              "systemControls",
              "ulimits",
              "mountPoints",
              "volumesFrom",
              "logConfiguration.secretOptions",
            ]),
          ])
        ),
      ]),
    }),
  ]);

const ignoreErrorCodes = ["InvalidParameterException", "ClientException"];
const ignoreErrorMessages = ["The specified task definition does not exist."];

const findDependenciesInEnvironment =
  ({ type, group }) =>
  ({ lives, config }) =>
  (live) =>
    pipe([
      lives.getByType({
        type,
        group,
        providerName: config.providerName,
      }),
      find(({ id }) =>
        pipe([
          () => live,
          get("containerDefinitions"),
          pluck("environment"),
          flatten,
          pluck("value"),
          any(includes(id)),
        ])()
      ),
    ])();

exports.ECSTaskDefinition = ({ compare }) => ({
  type: "TaskDefinition",
  package: "ecs",
  client: "ECS",
  inferName: () => pipe([get("family")]),
  findName: () => (live) =>
    pipe([
      () => live,
      get("family"),
      unless(() => live.latest, append(`::${live.revision}`)),
    ])(),
  findId,
  ignoreErrorCodes,
  propertiesDefault: { requiresCompatibilities: ["EC2"] },
  dependencies: {
    taskRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => get("taskRoleArn"),
    },
    efsAccessPoints: {
      type: "AccessPoint",
      group: "EFS",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("volumes"),
          map(
            pipe([
              get("efsVolumeConfiguration.authorizationConfig.accessPointId"),
            ])
          ),
        ]),
    },
    efsFileSystems: {
      type: "FileSystem",
      group: "EFS",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("volumes"),
          map(pipe([get("efsVolumeConfiguration.fileSystemId")])),
        ]),
    },

    executionRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => get("executionRoleArn"),
    },
    secret: {
      type: "Secret",
      group: "SecretsManager",
      dependencyId: findDependenciesInEnvironment({
        type: "Secret",
        group: "SecretsManager",
      }),
    },
    rdsDbCluster: {
      type: "DBCluster",
      group: "RDS",
      dependencyId: findDependenciesInEnvironment({
        type: "DBCluster",
        group: "RDS",
      }),
    },
  },
  omitProperties: [
    "taskDefinitionArn",
    "taskRoleArn",
    "executionRoleArn",
    "revision",
    "status",
    "compatibilities",
    "registeredAt",
    "registeredBy",
    "compatibilities",
    "latest",
  ],
  compare: compare({}),
  ignoreResource: () =>
    pipe([
      or([not(get("live.latest")), not(eq(get("live.status"), "ACTIVE"))]),
    ]),
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      omitIfEmpty(["volumes", "placementConstraints"]),
      assign({
        containerDefinitions: pipe([
          get("containerDefinitions"),
          map(
            pipe([
              when(
                get("image"),
                assign({
                  image: pipe([
                    get("image"),
                    replaceRegion({ providerConfig }),
                  ]),
                })
              ),
              when(
                get("logConfiguration"),
                assign({
                  logConfiguration: pipe([
                    get("logConfiguration"),
                    when(
                      get("options"),
                      assign({
                        options: pipe([
                          get("options"),
                          when(
                            get("awslogs-region"),
                            assign({
                              ["awslogs-region"]: pipe([
                                get("awslogs-region"),
                                replaceRegion({ providerConfig }),
                              ]),
                            })
                          ),
                        ]),
                      })
                    ),
                  ]),
                })
              ),
              when(
                get("environment"),
                assign({
                  environment: pipe([
                    get("environment"),
                    map(
                      assign({
                        value: pipe([
                          get("value"),
                          switchCase([
                            eq(identity, providerConfig.region),
                            replaceRegion({ providerConfig }),
                            replaceWithName({
                              path: "id",
                              providerConfig,
                              lives,
                            }),
                          ]),
                        ]),
                      })
                    ),
                  ]),
                })
              ),
            ])
          ),
        ]),
      }),
      when(
        get("volumes"),
        assign({
          volumes: pipe([
            get("volumes"),
            map(
              pipe([
                when(
                  get("efsVolumeConfiguration"),
                  assign({
                    efsVolumeConfiguration: pipe([
                      get("efsVolumeConfiguration"),
                      tap((params) => {
                        assert(true);
                      }),
                      assign({
                        fileSystemId: pipe([
                          get("fileSystemId"),
                          replaceWithName({
                            groupType: "EFS::FileSystem",
                            path: "live.FileSystemId",
                            pathLive: "live.FileSystemId",
                            providerConfig,
                            lives,
                          }),
                        ]),
                        authorizationConfig: pipe([
                          get("authorizationConfig"),
                          assign({
                            accessPointId: pipe([
                              get("accessPointId"),
                              replaceWithName({
                                groupType: "EFS::AccessPoint",
                                path: "live.AccessPointId",
                                pathLive: "live.AccessPointId",
                                providerConfig,
                                lives,
                              }),
                            ]),
                          }),
                        ]),
                      }),
                    ]),
                  })
                ),
              ])
            ),
          ]),
        })
      ),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#describeTaskDefinition-property
  getById: {
    pickId: pipe([
      tap(({ taskDefinitionArn }) => {
        assert(taskDefinitionArn);
      }),
      ({ taskDefinitionArn }) => ({
        taskDefinition: taskDefinitionArn,
        include: ["TAGS"],
      }),
    ]),
    method: "describeTaskDefinition",
    ignoreErrorMessages,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#listTaskDefinitions-property
  getList: {
    enhanceParams: () => () => ({ sort: "ASC" }),
    transformListPost: () =>
      pipe([
        callProp("sort", (a, b) => b.revision - a.revision),
        unless(isEmpty, ([latest, ...others]) => [
          { ...latest, latest: true },
          ...others,
        ]),
        callProp("reverse"),
      ]),
    method: "listTaskDefinitions",
    getParam: "taskDefinitionArns",
    decorate: ({ getById }) =>
      pipe([(taskDefinitionArn) => ({ taskDefinitionArn }), getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#registerTaskDefinition-property
  create: {
    method: "registerTaskDefinition",
    pickCreated: () =>
      pipe([
        get("taskDefinition"),
        tap((taskDefinition) => {
          assert(taskDefinition);
        }),
      ]),
    //TODO isInstanceUp
  },
  update:
    ({ endpoint, getById }) =>
    ({ payload, live, diff }) =>
      pipe([
        () => payload,
        endpoint().registerTaskDefinition,
        get("taskDefinition"),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#deregisterTaskDefinition-property
  destroy: {
    pickId,
    method: "deregisterTaskDefinition",
    ignoreErrorMessages,
    isInstanceDown: pipe([eq(get("status"), "INACTIVE")]),
  },
  getByName:
    ({ getList }) =>
    ({ name }) =>
      pipe([() => ({ familyPrefix: name }), getList, first])(),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { taskRole, executionRole },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        family: name,
        tags: buildTagsEcs({
          name,
          config,
          namespace,
          tags,
        }),
      }),
      when(
        () => executionRole,
        defaultsDeep({
          executionRoleArn: getField(executionRole, "Arn"),
        })
      ),
      when(
        () => taskRole,
        defaultsDeep({
          taskRoleArn: getField(taskRole, "Arn"),
        })
      ),
    ])(),
});
