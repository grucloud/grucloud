const assert = require("assert");
const {
  pipe,
  map,
  tap,
  flatMap,
  filter,
  not,
  eq,
  get,
  and,
  assign,
  omit,
  pick,
} = require("rubico");

const {
  defaultsDeep,
  callProp,
  find,
  values,
  isEmpty,
  isFunction,
} = require("rubico/x");

const { compare, omitIfEmpty } = require("@grucloud/core/Common");

const ResourceManagementSpec = require("./resources/ResourceManagementSpec");
const VirtualNetworkSpec = require("./resources/VirtualNetworksSpec");
const ComputeSpec = require("./resources/ComputeSpec");
const OperationalInsightsSpec = require("./resources/OperationalInsightsSpec");
const AppServiceSpec = require("./resources/AppServiceSpec");
const DBForPortgreSQLSpec = require("./resources/DBForPostgreSQLSpec");

const AzTag = require("./AzTag");

const Schema = require("./AzureSchema.json");

const overideSpec = (config) =>
  pipe([
    () => [
      AppServiceSpec,
      ComputeSpec,
      DBForPortgreSQLSpec,
      ResourceManagementSpec,
      OperationalInsightsSpec,
      VirtualNetworkSpec,
    ],
    flatMap(callProp("fnSpecs", { config })),
    tap((params) => {
      assert(true);
    }),
  ]);

const transformSchemaToSpec = ({}) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    map(
      pipe([
        assign({
          dependsOnList: ({ dependencies }) =>
            pipe([
              () => dependencies,
              values,
              map(({ group, type }) => `${group}::${type}`),
            ])(),
          environmentVariables:
            ({ environmentVariables }) =>
            () =>
              environmentVariables,
        }),
        assign({
          dependencies:
            ({ dependencies }) =>
            () =>
              dependencies,
        }),
        assign({
          Client:
            ({ dependencies }) =>
            ({ spec, config }) =>
              AzClient({
                spec,
                dependencies,
                config,
                isDefault: eq(get("live.name"), "default"),
                managedByOther: eq(get("live.name"), "default"),
              }),
          ignoreResource: () => () => pipe([get("isDefault")]),
          //TODO move to assignDependsOn, remove filterLive and replace with pickPropertiesCreate
          filterLive:
            ({ pickPropertiesCreate }) =>
            () =>
              pipe([
                pick(pickPropertiesCreate),
                omit(["properties.provisioningState", "etag"]),
              ]),
        }),
      ])
    ),
    tap((params) => {
      assert(true);
    }),
  ]);
const assignDependsOn = ({}) =>
  pipe([
    map(
      pipe([
        assign({
          dependsOn: ({ dependencies = () => ({}), type }) =>
            pipe([
              tap((params) => {
                assert(type);
                if (!isFunction(dependencies)) {
                  assert(isFunction(dependencies));
                }
              }),
              dependencies,
              values,
              map(({ group, type }) => `${group}::${type}`),
            ])(),
          compare: ({
            pickProperties = [],
            omitProperties = [],
            propertiesDefault = {},
          }) =>
            compare({
              //TODO filterAll
              filterTarget: pipe([
                tap((params) => {
                  assert(pickProperties);
                }),
                pick(pickProperties),
                defaultsDeep(propertiesDefault),
                omit(omitProperties),
                tap((params) => {
                  assert(true);
                }),
              ]),
              filterLive: pipe([
                pick(pickProperties),
                defaultsDeep(propertiesDefault),
                omit(omitProperties),
                omit(["type", "name", "properties.provisioningState", "etag"]),
                tap((params) => {
                  assert(true);
                }),
              ]),
            }),
        }),
      ])
    ),
  ]);

const findByGroupAndType = ({ group, type }) =>
  pipe([
    tap((params) => {
      assert(type);
      assert(group);
    }),
    find(and([eq(get("group"), group), eq(get("type"), type)])),
    tap((params) => {
      assert(true);
    }),
  ]);

const mergeSpec = ({ specsGen, overideSpecs }) =>
  pipe([
    () => overideSpecs,
    map((overideSpec) =>
      pipe([
        () => specsGen,
        findByGroupAndType(overideSpec),
        (found) => ({ ...found, ...overideSpec }),
        tap((params) => {
          assert(true);
        }),
      ])()
    ),
    map(
      defaultsDeep({
        //TODO filterAll
        isOurMinion: AzTag.isOurMinion,
        compare: compare({
          filterTarget: pipe([
            tap((params) => {
              assert(true);
            }),
            pick(["properties", "sku"]),
            omitIfEmpty(["properties"]),
          ]),
          filterLive: pipe([
            tap((params) => {
              assert(true);
            }),
            omit(["properties.provisioningState"]),
            pick(["properties", "sku"]),
            omitIfEmpty(["properties"]),
            tap((params) => {
              assert(true);
            }),
          ]),
        }),
      })
    ),
    tap((params) => {
      assert(true);
    }),
  ])();

exports.fnSpecs = (config) =>
  pipe([
    assign({
      overideSpecs: overideSpec(config),
      specsGen: pipe([() => Schema, transformSchemaToSpec({})]),
    }),
    assign({
      overideSpecs: mergeSpec,
    }),
    assign({
      specsGen: ({ specsGen, overideSpecs }) =>
        pipe([
          () => specsGen,
          filter(
            not((spec) =>
              pipe([() => overideSpecs, findByGroupAndType(spec)])()
            )
          ),
        ])(),
    }),
    ({ specsGen, overideSpecs }) => [...specsGen, ...overideSpecs],
    tap((params) => {
      assert(true);
    }),
    map(
      assign({ groupType: pipe([({ group, type }) => `${group}::${type}`]) })
    ),
    callProp("sort", (a, b) => a.groupType.localeCompare(b.groupType)),
    assignDependsOn({}),
  ])();
