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
  "TransitGatewayVpnAttachment",
  "TransitGatewayPeeringAttachment",
  "TransitGatewayAttachment",
];

exports.findDependenciesTgwAttachment = ({ live, lives, config }) =>
  pipe([
    () => TgwAttachmentDependencies,
    map((type) =>
      pipe([
        () => live,
        get("TransitGatewayAttachmentId"),
        lives.getById({
          type,
          group: "EC2",
          providerName: config.providerName,
        }),
        get("id"),
        unless(isEmpty, (id) => ({ type, group: "EC2", ids: [id] })),
      ])()
    ),
    find(not(isEmpty)),
  ])();

exports.findNameRouteTableArm =
  ({ prefix }) =>
  ({ lives, config }) =>
  (live) =>
    pipe([
      () => live,
      fork({
        transitGatewayPeeringAttachment: pipe([
          get("TransitGatewayAttachmentId"),
          lives.getById({
            type: "TransitGatewayPeeringAttachment",
            group: "EC2",
            providerName: config.providerName,
          }),
          get("name"),
        ]),
        transitGatewayVpcAttachment: pipe([
          get("TransitGatewayAttachmentId"),
          lives.getById({
            type: "TransitGatewayVpcAttachment",
            group: "EC2",
            providerName: config.providerName,
          }),
          get("name"),
        ]),
        transitGatewayVpnAttachment: pipe([
          get("TransitGatewayAttachmentId"),
          lives.getById({
            type: "TransitGatewayVpnAttachment",
            group: "EC2",
            providerName: config.providerName,
          }),
          get("name"),
        ]),
        transitGatewayAttachment: pipe([
          get("TransitGatewayAttachmentId"),
          lives.getById({
            type: "TransitGatewayAttachment",
            group: "EC2",
            providerName: config.providerName,
          }),
          get("name"),
        ]),
        transitGatewayRouteTable: pipe([
          get("TransitGatewayRouteTableId"),
          lives.getById({
            type: "TransitGatewayRouteTable",
            group: "EC2",
            providerName: config.providerName,
          }),
          get("name"),
        ]),
      }),
      ({
        transitGatewayVpcAttachment,
        transitGatewayVpnAttachment,
        transitGatewayPeeringAttachment,
        transitGatewayAttachment,
        transitGatewayRouteTable,
      }) =>
        pipe([
          tap((params) => {
            assert(
              transitGatewayVpcAttachment ||
                transitGatewayVpnAttachment ||
                transitGatewayPeeringAttachment ||
                transitGatewayAttachment
            );
            assert(transitGatewayRouteTable);
          }),
          switchCase([
            () => transitGatewayVpcAttachment,
            () => transitGatewayVpcAttachment,
            () => transitGatewayVpnAttachment,
            () => transitGatewayVpnAttachment,
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
      transitGatewayVpnAttachment,
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
            transitGatewayVpnAttachment ||
            transitGatewayPeeringAttachment ||
            transitGatewayAttachment
        );
        assert(transitGatewayRouteTable);
      }),
      switchCase([
        () => transitGatewayVpcAttachment,
        () => transitGatewayVpcAttachment,
        () => transitGatewayVpnAttachment,
        () => transitGatewayVpnAttachment,
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

exports.transitGatewayAttachmentDependencies = {
  transitGatewayVpcAttachment: {
    type: "TransitGatewayVpcAttachment",
    group: "EC2",
    parent: true,
  },
  transitGatewayVpnAttachment: {
    type: "TransitGatewayVpnAttachment",
    group: "EC2",
    parent: true,
  },
  transitGatewayPeeringAttachment: {
    type: "TransitGatewayPeeringAttachment",
    group: "EC2",
    parent: true,
  },
  transitGatewayAttachment: {
    type: "TransitGatewayAttachment",
    group: "EC2",
    parent: true,
  },
};
