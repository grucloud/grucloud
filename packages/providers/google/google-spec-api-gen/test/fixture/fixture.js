exports.SubnetworkSchema = {
  type: "object",
  properties: {
    state: {
      enum: ["DRAINING", "READY"],
      enumDescriptions: [
        "Subnetwork is being drained.",
        "Subnetwork is ready for use.",
      ],
      description:
        "[Output Only] The state of the subnetwork, which can be one of the following values: READY: Subnetwork is created and ready to use DRAINING: only applicable to subnetworks that have the purpose set to INTERNAL_HTTPS_LOAD_BALANCER and indicates that connections to the load balancer are being drained. A subnetwork that is draining cannot be used or modified until it reaches a status of READY",
      type: "string",
    },
    logConfig: {
      description: "The available logging options for this subnetwork.",
      properties: {
        filterExpr: {
          type: "string",
          description:
            "Can only be specified if VPC flow logs for this subnetwork is enabled. The filter expression is used to define which VPC flow logs should be exported to Cloud Logging.",
        },
        metadataFields: {
          type: "array",
          items: {
            type: "string",
          },
          description:
            'Can only be specified if VPC flow logs for this subnetwork is enabled and "metadata" was set to CUSTOM_METADATA.',
        },
        metadata: {
          type: "string",
          enum: [
            "CUSTOM_METADATA",
            "EXCLUDE_ALL_METADATA",
            "INCLUDE_ALL_METADATA",
          ],
          enumDescriptions: ["", "", ""],
          description:
            "Can only be specified if VPC flow logs for this subnetwork is enabled. Configures whether all, none or a subset of metadata fields should be added to the reported VPC flow logs. Default is EXCLUDE_ALL_METADATA.",
        },
        aggregationInterval: {
          enum: [
            "INTERVAL_10_MIN",
            "INTERVAL_15_MIN",
            "INTERVAL_1_MIN",
            "INTERVAL_30_SEC",
            "INTERVAL_5_MIN",
            "INTERVAL_5_SEC",
          ],
          enumDescriptions: ["", "", "", "", "", ""],
          type: "string",
          description:
            "Can only be specified if VPC flow logging for this subnetwork is enabled. Toggles the aggregation interval for collecting flow logs. Increasing the interval time will reduce the amount of generated flow logs for long lasting connections. Default is an interval of 5 seconds per connection.",
        },
        enable: {
          type: "boolean",
          description:
            "Whether to enable flow logging for this subnetwork. If this field is not explicitly set, it will not appear in get listings. If not set the default behavior is determined by the org policy, if there is no org policy specified, then it will default to disabled.",
        },
        flowSampling: {
          type: "number",
          format: "float",
          description:
            "Can only be specified if VPC flow logging for this subnetwork is enabled. The value of the field must be in [0, 1]. Set the sampling rate of VPC flow logs within the subnetwork where 1.0 means all collected logs are reported and 0.0 means no logs are reported. Default is 0.5 unless otherwise specified by the org policy, which means half of all collected logs are reported.",
        },
      },
      id: "SubnetworkLogConfig",
      type: "object",
    },
    enableFlowLogs: {
      type: "boolean",
      description:
        "Whether to enable flow logging for this subnetwork. If this field is not explicitly set, it will not appear in get listings. If not set the default behavior is determined by the org policy, if there is no org policy specified, then it will default to disabled. This field isn't supported with the purpose field set to INTERNAL_HTTPS_LOAD_BALANCER.",
    },
    description: {
      description:
        "An optional description of this resource. Provide this property when you create the resource. This field can be set only at resource creation time.",
      type: "string",
    },
    ipCidrRange: {
      description:
        "The range of internal addresses that are owned by this subnetwork. Provide this property when you create the subnetwork. For example, 10.0.0.0/8 or 100.64.0.0/10. Ranges must be unique and non-overlapping within a network. Only IPv4 is supported. This field is set at resource creation time. The range can be any range listed in the Valid ranges list. The range can be expanded after creation using expandIpCidrRange.",
      type: "string",
    },
    stackType: {
      enum: ["IPV4_IPV6", "IPV4_ONLY"],
      type: "string",
      enumDescriptions: [
        "New VMs in this subnet can have both IPv4 and IPv6 addresses.",
        "New VMs in this subnet will only be assigned IPv4 addresses.",
      ],
      description:
        "The stack type for the subnet. If set to IPV4_ONLY, new VMs in the subnet are assigned IPv4 addresses only. If set to IPV4_IPV6, new VMs in the subnet can be assigned both IPv4 and IPv6 addresses. If not specified, IPV4_ONLY is used. This field can be both set at resource creation time and updated using patch.",
    },
    network: {
      description:
        "The URL of the network to which this subnetwork belongs, provided by the client when initially creating the subnetwork. This field can be set only at resource creation time.",
      type: "string",
    },
    internalIpv6Prefix: {
      type: "string",
      description:
        "[Output Only] The internal IPv6 address range that is assigned to this subnetwork.",
    },
    region: {
      type: "string",
      description:
        "URL of the region where the Subnetwork resides. This field can be set only at resource creation time.",
    },
    privateIpGoogleAccess: {
      description:
        "Whether the VMs in this subnet can access Google services without assigned external IP addresses. This field can be both set at resource creation time and updated using setPrivateIpGoogleAccess.",
      type: "boolean",
    },
    kind: {
      description:
        "[Output Only] Type of the resource. Always compute#subnetwork for Subnetwork resources.",
      type: "string",
      default: "compute#subnetwork",
    },
    creationTimestamp: {
      type: "string",
      description: "[Output Only] Creation timestamp in RFC3339 text format.",
    },
    name: {
      pattern: "[a-z](?:[-a-z0-9]{0,61}[a-z0-9])?",
      description:
        "The name of the resource, provided by the client when initially creating the resource. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
      type: "string",
    },
    gatewayAddress: {
      description:
        "[Output Only] The gateway address for default routes to reach destination addresses outside this subnetwork.",
      type: "string",
    },
    selfLink: {
      description: "[Output Only] Server-defined URL for the resource.",
      type: "string",
    },
    role: {
      enumDescriptions: [
        "The ACTIVE subnet that is currently used.",
        "The BACKUP subnet that could be promoted to ACTIVE.",
      ],
      description:
        "The role of subnetwork. Currently, this field is only used when purpose = INTERNAL_HTTPS_LOAD_BALANCER. The value can be set to ACTIVE or BACKUP. An ACTIVE subnetwork is one that is currently being used for Internal HTTP(S) Load Balancing. A BACKUP subnetwork is one that is ready to be promoted to ACTIVE or is currently draining. This field can be updated with a patch request.",
      type: "string",
      enum: ["ACTIVE", "BACKUP"],
    },
    ipv6AccessType: {
      type: "string",
      enumDescriptions: [
        "VMs on this subnet will be assigned IPv6 addresses that are accessible via the Internet, as well as the VPC network.",
        "VMs on this subnet will be assigned IPv6 addresses that are only accessible over the VPC network.",
      ],
      description:
        "The access type of IPv6 address this subnet holds. It's immutable and can only be specified during creation or the first time the subnet is updated into IPV4_IPV6 dual stack.",
      enum: ["EXTERNAL", "INTERNAL"],
    },
    fingerprint: {
      description:
        "Fingerprint of this resource. A hash of the contents stored in this object. This field is used in optimistic locking. This field will be ignored when inserting a Subnetwork. An up-to-date fingerprint must be provided in order to update the Subnetwork, otherwise the request will fail with error 412 conditionNotMet. To see the latest fingerprint, make a get() request to retrieve a Subnetwork.",
      type: "string",
      format: "byte",
    },
    secondaryIpRanges: {
      items: {
        type: "object",
        id: "SubnetworkSecondaryRange",
        properties: {
          ipCidrRange: {
            description:
              "The range of IP addresses belonging to this subnetwork secondary range. Provide this property when you create the subnetwork. Ranges must be unique and non-overlapping with all primary and secondary IP ranges within a network. Only IPv4 is supported. The range can be any range listed in the Valid ranges list.",
            type: "string",
          },
          rangeName: {
            type: "string",
            description:
              "The name associated with this subnetwork secondary range, used when adding an alias IP range to a VM instance. The name must be 1-63 characters long, and comply with RFC1035. The name must be unique within the subnetwork.",
          },
        },
        description: "Represents a secondary IP range of a subnetwork.",
      },
      type: "array",
      description:
        "An array of configurations for secondary IP ranges for VM instances contained in this subnetwork. The primary IP of such VM must belong to the primary ipCidrRange of the subnetwork. The alias IPs may belong to either primary or secondary ranges. This field can be updated with a patch request.",
    },
    ipv6CidrRange: {
      description: "[Output Only] This field is for internal use.",
      type: "string",
    },
    purpose: {
      description:
        "The purpose of the resource. This field can be either PRIVATE_RFC_1918 or INTERNAL_HTTPS_LOAD_BALANCER. A subnetwork with purpose set to INTERNAL_HTTPS_LOAD_BALANCER is a user-created subnetwork that is reserved for Internal HTTP(S) Load Balancing. If unspecified, the purpose defaults to PRIVATE_RFC_1918. The enableFlowLogs field isn't supported with the purpose field set to INTERNAL_HTTPS_LOAD_BALANCER.",
      enumDescriptions: [
        "Subnet reserved for Internal HTTP(S) Load Balancing.",
        "Regular user created or automatically created subnet.",
        "Regular user created or automatically created subnet.",
        "Subnetworks created for Private Service Connect in the producer network.",
        "Subnetwork used for Regional Internal/External HTTP(S) Load Balancing.",
      ],
      type: "string",
      enum: [
        "INTERNAL_HTTPS_LOAD_BALANCER",
        "PRIVATE",
        "PRIVATE_RFC_1918",
        "PRIVATE_SERVICE_CONNECT",
        "REGIONAL_MANAGED_PROXY",
      ],
    },
    privateIpv6GoogleAccess: {
      description:
        "This field is for internal use. This field can be both set at resource creation time and updated using patch.",
      type: "string",
      enumDescriptions: [
        "Disable private IPv6 access to/from Google services.",
        "Bidirectional private IPv6 access to/from Google services.",
        "Outbound private IPv6 access from VMs in this subnet to Google services.",
      ],
      enum: [
        "DISABLE_GOOGLE_ACCESS",
        "ENABLE_BIDIRECTIONAL_ACCESS_TO_GOOGLE",
        "ENABLE_OUTBOUND_VM_ACCESS_TO_GOOGLE",
      ],
    },
    externalIpv6Prefix: {
      description:
        "[Output Only] The external IPv6 address range that is assigned to this subnetwork.",
      type: "string",
    },
    id: {
      type: "string",
      format: "uint64",
      description:
        "[Output Only] The unique identifier for the resource. This identifier is defined by the server.",
    },
  },
  description:
    "Represents a Subnetwork resource. A subnetwork (also known as a subnet) is a logical partition of a Virtual Private Cloud network with one primary IP range and zero or more secondary IP ranges. For more information, read Virtual Private Cloud (VPC) Network.",
  id: "Subnetwork",
};

exports.SubnetworkSchemaOnlyNetwork = {
  type: "object",
  properties: {
    // state: {
    //   enum: ["DRAINING", "READY"],
    //   enumDescriptions: [
    //     "Subnetwork is being drained.",
    //     "Subnetwork is ready for use.",
    //   ],
    //   description:
    //     "[Output Only] The state of the subnetwork, which can be one of the following values: READY: Subnetwork is created and ready to use DRAINING: only applicable to subnetworks that have the purpose set to INTERNAL_HTTPS_LOAD_BALANCER and indicates that connections to the load balancer are being drained. A subnetwork that is draining cannot be used or modified until it reaches a status of READY",
    //   type: "string",
    // },
    // logConfig: {
    //   description: "The available logging options for this subnetwork.",
    //   properties: {
    //     filterExpr: {
    //       type: "string",
    //       description:
    //         "Can only be specified if VPC flow logs for this subnetwork is enabled. The filter expression is used to define which VPC flow logs should be exported to Cloud Logging.",
    //     },
    //     metadataFields: {
    //       type: "array",
    //       items: {
    //         type: "string",
    //       },
    //       description:
    //         'Can only be specified if VPC flow logs for this subnetwork is enabled and "metadata" was set to CUSTOM_METADATA.',
    //     },
    //     metadata: {
    //       type: "string",
    //       enum: [
    //         "CUSTOM_METADATA",
    //         "EXCLUDE_ALL_METADATA",
    //         "INCLUDE_ALL_METADATA",
    //       ],
    //       enumDescriptions: ["", "", ""],
    //       description:
    //         "Can only be specified if VPC flow logs for this subnetwork is enabled. Configures whether all, none or a subset of metadata fields should be added to the reported VPC flow logs. Default is EXCLUDE_ALL_METADATA.",
    //     },
    //     aggregationInterval: {
    //       enum: [
    //         "INTERVAL_10_MIN",
    //         "INTERVAL_15_MIN",
    //         "INTERVAL_1_MIN",
    //         "INTERVAL_30_SEC",
    //         "INTERVAL_5_MIN",
    //         "INTERVAL_5_SEC",
    //       ],
    //       enumDescriptions: ["", "", "", "", "", ""],
    //       type: "string",
    //       description:
    //         "Can only be specified if VPC flow logging for this subnetwork is enabled. Toggles the aggregation interval for collecting flow logs. Increasing the interval time will reduce the amount of generated flow logs for long lasting connections. Default is an interval of 5 seconds per connection.",
    //     },
    //     enable: {
    //       type: "boolean",
    //       description:
    //         "Whether to enable flow logging for this subnetwork. If this field is not explicitly set, it will not appear in get listings. If not set the default behavior is determined by the org policy, if there is no org policy specified, then it will default to disabled.",
    //     },
    //     flowSampling: {
    //       type: "number",
    //       format: "float",
    //       description:
    //         "Can only be specified if VPC flow logging for this subnetwork is enabled. The value of the field must be in [0, 1]. Set the sampling rate of VPC flow logs within the subnetwork where 1.0 means all collected logs are reported and 0.0 means no logs are reported. Default is 0.5 unless otherwise specified by the org policy, which means half of all collected logs are reported.",
    //     },
    //   },
    //   id: "SubnetworkLogConfig",
    //   type: "object",
    // },
    // enableFlowLogs: {
    //   type: "boolean",
    //   description:
    //     "Whether to enable flow logging for this subnetwork. If this field is not explicitly set, it will not appear in get listings. If not set the default behavior is determined by the org policy, if there is no org policy specified, then it will default to disabled. This field isn't supported with the purpose field set to INTERNAL_HTTPS_LOAD_BALANCER.",
    // },
    // description: {
    //   description:
    //     "An optional description of this resource. Provide this property when you create the resource. This field can be set only at resource creation time.",
    //   type: "string",
    // },
    // ipCidrRange: {
    //   description:
    //     "The range of internal addresses that are owned by this subnetwork. Provide this property when you create the subnetwork. For example, 10.0.0.0/8 or 100.64.0.0/10. Ranges must be unique and non-overlapping within a network. Only IPv4 is supported. This field is set at resource creation time. The range can be any range listed in the Valid ranges list. The range can be expanded after creation using expandIpCidrRange.",
    //   type: "string",
    // },
    // stackType: {
    //   enum: ["IPV4_IPV6", "IPV4_ONLY"],
    //   type: "string",
    //   enumDescriptions: [
    //     "New VMs in this subnet can have both IPv4 and IPv6 addresses.",
    //     "New VMs in this subnet will only be assigned IPv4 addresses.",
    //   ],
    //   description:
    //     "The stack type for the subnet. If set to IPV4_ONLY, new VMs in the subnet are assigned IPv4 addresses only. If set to IPV4_IPV6, new VMs in the subnet can be assigned both IPv4 and IPv6 addresses. If not specified, IPV4_ONLY is used. This field can be both set at resource creation time and updated using patch.",
    // },
    network: {
      description:
        "The URL of the network to which this subnetwork belongs, provided by the client when initially creating the subnetwork. This field can be set only at resource creation time.",
      type: "string",
    },
  },
  description:
    "Represents a Subnetwork resource. A subnetwork (also known as a subnet) is a logical partition of a Virtual Private Cloud network with one primary IP range and zero or more secondary IP ranges. For more information, read Virtual Private Cloud (VPC) Network.",
  id: "Subnetwork",
};
