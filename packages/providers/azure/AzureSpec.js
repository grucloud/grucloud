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

const { defaultsDeep, callProp, find, values, isEmpty } = require("rubico/x");

const { compare, omitIfEmpty } = require("@grucloud/core/Common");

const ResourceManagementSpec = require("./resources/ResourceManagementSpec");
const VirtualNetworkSpec = require("./resources/VirtualNetworksSpec");
const ComputeSpec = require("./resources/ComputeSpec");
const LogAnalyticsSpec = require("./resources/LogAnalyticsSpec");
const AppServiceSpec = require("./resources/AppServiceSpec");
const DBForPortgreSQLSpec = require("./resources/DBForPortgreSQLSpec");

const { buildTags } = require("./AzureCommon");
const AzTag = require("./AzTag");

const Schema = require("./AzureSchema.json");

const overideSpec = (config) =>
  pipe([
    () => [
      ResourceManagementSpec,
      VirtualNetworkSpec,
      ComputeSpec,
      LogAnalyticsSpec,
      AppServiceSpec,
      DBForPortgreSQLSpec,
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
          dependsOn: ({ dependencies }) =>
            pipe([
              () => dependencies,
              values,
              map(({ group, type }) => `${group}::${type}`),
            ])(),
          dependsOnList: ({ dependencies }) =>
            pipe([
              () => dependencies,
              values,
              map(({ group, type }) => `${group}::${type}`),
            ])(),
        }),
        assign({
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
            ({ versionDir, methods, dependencies }) =>
            ({ spec, config }) =>
              AzClient({
                spec,
                methods,
                dependencies,
                apiVersion: versionDir,
                config,
                cannotBeDeleted: pipe([() => methods, get("delete"), isEmpty]),
                configDefault: ({ properties }) =>
                  defaultsDeep({
                    location: config.location,
                    tags: buildTags(config),
                  })(properties),
              }),
          compare: ({ omitProperties = [], propertiesDefault = {} }) =>
            compare({
              filterTarget: pipe([
                tap((params) => {
                  assert(omitProperties);
                }),
                pick(["properties", "sku"]),
                omit(omitProperties),
                defaultsDeep(propertiesDefault),
                tap((params) => {
                  assert(true);
                }),
              ]),
              filterLive: pipe([
                tap((params) => {
                  assert(true);
                }),
                pick(["properties", "sku"]),
                omit(omitProperties),
                defaultsDeep(propertiesDefault),
                tap((params) => {
                  assert(true);
                }),
              ]),
            }),
          filterLive:
            ({ omitProperties }) =>
            () =>
              pipe([
                tap((params) => {
                  assert(omitProperties);
                }),
                omit(omitProperties),
                pick(["properties", "sku"]),
              ]),
        }),
      ])
    ),
    tap((params) => {
      assert(true);
    }),
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
        tap((params) => {
          assert(overideSpec);
        }),
        findByGroupAndType(overideSpec),
        tap.if(not(isEmpty), (found) => {
          assert(true);
        }),
        (found) => defaultsDeep(found)(overideSpec),
      ])()
    ),
    map(
      defaultsDeep({
        //TODO filterAll
        isOurMinion: AzTag.isOurMinion,
        compare: compare({
          filterTarget: pipe([
            pick(["properties", "sku"]),
            omitIfEmpty(["properties"]),
          ]),
          filterLive: pipe([
            omit(["properties.provisioningState"]),
            pick(["properties", "sku"]),
            omitIfEmpty(["properties"]),
          ]),
        }),
      })
    ),
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
  ])();
