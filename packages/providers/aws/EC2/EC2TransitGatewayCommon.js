const assert = require("assert");
const { pipe, tap, get, switchCase, fork, not, map } = require("rubico");
const { prepend, append, find, isEmpty, unless } = require("rubico/x");

exports.findDependenciesTransitGateway = ({ live }) => ({
  type: "TransitGateway",
  group: "EC2",
  ids: [live.TransitGatewayId],
});

const TgwAttachmentDependencies = [
  "TransitGatewayVpcAttachment",
  "TransitGatewayPeeringAttachment",
  "TransitGatewayAttachment",
];

exports.findDependenciesTgwAttachment = ({ live, lives, config }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    () => TgwAttachmentDependencies,
    map((type) =>
      pipe([
        () =>
          lives.getById({
            id: live.TransitGatewayAttachmentId,
            type,
            group: "EC2",
            providerName: config.providerName,
          }),
        get("id"),
        unless(isEmpty, (id) => ({ type, group: "EC2", ids: [id] })),
      ])()
    ),
    tap((params) => {
      assert(true);
    }),
    find(not(isEmpty)),
    tap((params) => {
      assert(true);
    }),
  ])();

exports.findNameRouteTableArm =
  ({ prefix }) =>
  ({ lives, config }) =>
  (live) =>
    pipe([
      fork({
        transitGatewayPeeringAttachment: pipe([
          () =>
            lives.getById({
              id: live.TransitGatewayAttachmentId,
              type: "TransitGatewayPeeringAttachment",
              group: "EC2",
              providerName: config.providerName,
            }),
          get("name"),
        ]),
        transitGatewayVpcAttachment: pipe([
          () =>
            lives.getById({
              id: live.TransitGatewayAttachmentId,
              type: "TransitGatewayVpcAttachment",
              group: "EC2",
              providerName: config.providerName,
            }),
          get("name"),
        ]),
        transitGatewayAttachment: pipe([
          () =>
            lives.getById({
              id: live.TransitGatewayAttachmentId,
              type: "TransitGatewayAttachment",
              group: "EC2",
              providerName: config.providerName,
            }),
          get("name"),
        ]),
        transitGatewayRouteTable: pipe([
          () =>
            lives.getById({
              id: live.TransitGatewayRouteTableId,
              type: "TransitGatewayRouteTable",
              group: "EC2",
              providerName: config.providerName,
            }),
          get("name"),
        ]),
      }),
      ({
        transitGatewayVpcAttachment,
        transitGatewayPeeringAttachment,
        transitGatewayAttachment,
        transitGatewayRouteTable,
      }) =>
        pipe([
          tap((params) => {
            assert(
              transitGatewayVpcAttachment ||
                transitGatewayPeeringAttachment ||
                transitGatewayAttachment
            );
            assert(transitGatewayRouteTable);
          }),
          switchCase([
            () => transitGatewayVpcAttachment,
            () => transitGatewayVpcAttachment,
            () => transitGatewayPeeringAttachment,
            () => transitGatewayPeeringAttachment,
            () => transitGatewayAttachment,
            () => transitGatewayAttachment,
            () => {
              assert(false, "findNameRouteTableArm");
            },
          ]),
          append(`::${transitGatewayRouteTable}`),
          prepend(`${prefix}::`),
        ])(),
      tap((params) => {
        assert(true);
      }),
    ])();

exports.inferNameRouteTableArm =
  ({ prefix }) =>
  ({
    dependenciesSpec: {
      transitGatewayVpcAttachment,
      transitGatewayPeeringAttachment,
      transitGatewayAttachment,
      transitGatewayRouteTable,
    },
  }) =>
  () =>
    pipe([
      tap(() => {
        assert(
          transitGatewayVpcAttachment ||
            transitGatewayPeeringAttachment ||
            transitGatewayAttachment
        );
        assert(transitGatewayRouteTable);
      }),
      switchCase([
        () => transitGatewayVpcAttachment,
        () => transitGatewayVpcAttachment,
        () => transitGatewayPeeringAttachment,
        () => transitGatewayPeeringAttachment,
        () => transitGatewayAttachment,
        () => transitGatewayAttachment,
        () => {
          assert(false, "inferNameRouteTableArm");
        },
      ]),
      prepend(`${prefix}::`),
      append(`::${transitGatewayRouteTable}`),
    ])();

// const dependencyIdTgwAttachment =
//   ({ type }) =>
//   ({ lives, config }) =>
//     pipe([
//       (live) =>
//         lives.getById({
//           id: live.TransitGatewayAttachmentId,
//           type,
//           group: "EC2",
//           providerName: config.providerName,
//         }),
//       get("id"),
//     ]);

exports.transitGatewayAttachmentDependencies = {
  transitGatewayVpcAttachment: {
    type: "TransitGatewayVpcAttachment",
    group: "EC2",
    parent: true,
    // dependencyId: dependencyIdTgwAttachment({
    //   type: "TransitGatewayVpcAttachment",
    // }),
  },
  transitGatewayPeeringAttachment: {
    type: "TransitGatewayPeeringAttachment",
    group: "EC2",
    parent: true,
    // dependencyId: dependencyIdTgwAttachment({
    //   type: "TransitGatewayPeeringAttachment",
    // }),
  },
  transitGatewayAttachment: {
    type: "TransitGatewayAttachment",
    group: "EC2",
    parent: true,
    // dependencyId: dependencyIdTgwAttachment({
    //   type: "TransitGatewayAttachment",
    // }),
  },
};
