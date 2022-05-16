const assert = require("assert");
const { pipe, tap, get, switchCase, fork } = require("rubico");
const { prepend, append } = require("rubico/x");

exports.findDependenciesTransitGateway = ({ live }) => ({
  type: "TransitGateway",
  group: "EC2",
  ids: [live.TransitGatewayId],
});

exports.findDependenciesVpcAttachment = ({ live, lives, config }) => ({
  type: "TransitGatewayVpcAttachment",
  group: "EC2",
  ids: [
    pipe([
      tap((params) => {
        assert(live.TransitGatewayAttachmentId);
      }),
      () =>
        lives.getById({
          id: live.TransitGatewayAttachmentId,
          type: "TransitGatewayVpcAttachment",
          group: "EC2",
          providerName: config.providerName,
        }),
      get("id"),
    ])(),
  ],
});

exports.findDependenciesPeeringAttachment = ({ live, lives, config }) => ({
  type: "TransitGatewayPeeringAttachment",
  group: "EC2",
  ids: [
    pipe([
      tap((params) => {
        assert(live.TransitGatewayAttachmentId);
      }),
      () =>
        lives.getById({
          id: live.TransitGatewayAttachmentId,
          type: "TransitGatewayPeeringAttachment",
          group: "EC2",
          providerName: config.providerName,
        }),
      get("id"),
    ])(),
  ],
});

exports.findNameRouteTableArm =
  ({ prefix, config }) =>
  ({ live, lives }) =>
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
        transitGatewayRouteTable,
      }) =>
        pipe([
          tap((params) => {
            assert(
              transitGatewayVpcAttachment || transitGatewayPeeringAttachment
            );
            assert(transitGatewayRouteTable);
          }),
          switchCase([
            () => transitGatewayVpcAttachment,
            () => transitGatewayVpcAttachment,
            () => transitGatewayPeeringAttachment,
            () => transitGatewayPeeringAttachment,
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
      transitGatewayRouteTable,
    },
  }) =>
    pipe([
      tap(() => {
        assert(transitGatewayVpcAttachment || transitGatewayPeeringAttachment);
        assert(transitGatewayRouteTable);
      }),
      switchCase([
        () => transitGatewayVpcAttachment,
        () => transitGatewayVpcAttachment,
        () => transitGatewayPeeringAttachment,
        () => transitGatewayPeeringAttachment,
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
  transitGatewayPeeringAttachment: {
    type: "TransitGatewayPeeringAttachment",
    group: "EC2",
    parent: true,
  },
};
