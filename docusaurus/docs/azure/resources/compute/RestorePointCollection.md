---
id: RestorePointCollection
title: RestorePointCollection
---
Provides a **RestorePointCollection** from the **Compute** group
## Examples
### Create or update a restore point collection.
```js
exports.createResources = () => [
  {
    type: "RestorePointCollection",
    group: "Compute",
    name: "myRestorePointCollection",
    properties: () => ({
      location: "norwayeast",
      properties: {
        source: {
          id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM",
        },
      },
      tags: { myTag1: "tagValue1" },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      restorePoint: "myRestorePoint",
    }),
  },
];

```

### Create or update a restore point collection for cross region copy.
```js
exports.createResources = () => [
  {
    type: "RestorePointCollection",
    group: "Compute",
    name: "myRestorePointCollection",
    properties: () => ({
      location: "norwayeast",
      properties: {
        source: {
          id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/restorePointCollections/sourceRpcName",
        },
      },
      tags: { myTag1: "tagValue1" },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      restorePoint: "myRestorePoint",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [RestorePoint](../Compute/RestorePoint.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      properties: {
        source: {
          properties: {
            location: {
              type: 'string',
              readOnly: true,
              description: 'Location of the source resource used to create this restore point collection.'
            },
            id: {
              type: 'string',
              description: 'Resource Id of the source resource used to create this restore point collection'
            }
          },
          description: 'The properties of the source resource that this restore point collection is created from.'
        },
        provisioningState: {
          type: 'string',
          readOnly: true,
          description: 'The provisioning state of the restore point collection.'
        },
        restorePointCollectionId: {
          type: 'string',
          readOnly: true,
          description: 'The unique id of the restore point collection.'
        },
        restorePoints: {
          type: 'array',
          readOnly: true,
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                type: 'object',
                properties: {
                  excludeDisks: {
                    type: 'array',
                    items: {
                      properties: {
                        id: {
                          type: 'string',
                          description: 'The ARM resource id in the form of /subscriptions/{SubscriptionId}/resourceGroups/{ResourceGroupName}/...'
                        }
                      },
                      description: 'The API entity reference.'
                    },
                    description: 'List of disk resource ids that the customer wishes to exclude from the restore point. If no disks are specified, all disks will be included.'
                  },
                  sourceMetadata: {
                    readOnly: true,
                    description: 'Gets the details of the VM captured at the time of the restore point creation.',
                    properties: {
                      hardwareProfile: {
                        description: 'Gets the hardware profile.',
                        properties: {
                          vmSize: {
                            type: 'string',
                            description: 'Specifies the size of the virtual machine. <br><br> The enum data type is currently deprecated and will be removed by December 23rd 2023. <br><br> Recommended way to get the list of available sizes is using these APIs: <br><br> [List all available virtual machine sizes in an availability set](https://docs.microsoft.com/rest/api/compute/availabilitysets/listavailablesizes) <br><br> [List all available virtual machine sizes in a region]( https://docs.microsoft.com/rest/api/compute/resourceskus/list) <br><br> [List all available virtual machine sizes for resizing](https://docs.microsoft.com/rest/api/compute/virtualmachines/listavailablesizes). For more information about virtual machine sizes, see [Sizes for virtual machines](https://docs.microsoft.com/azure/virtual-machines/sizes). <br><br> The available VM sizes depend on region and availability set.',
                            enum: [
                              'Basic_A0',
                              'Basic_A1',
                              'Basic_A2',
                              'Basic_A3',
                              'Basic_A4',
                              'Standard_A0',
                              'Standard_A1',
                              'Standard_A2',
                              'Standard_A3',
                              'Standard_A4',
                              'Standard_A5',
                              'Standard_A6',
                              'Standard_A7',
                              'Standard_A8',
                              'Standard_A9',
                              'Standard_A10',
                              'Standard_A11',
                              'Standard_A1_v2',
                              'Standard_A2_v2',
                              'Standard_A4_v2',
                              'Standard_A8_v2',
                              'Standard_A2m_v2',
                              'Standard_A4m_v2',
                              'Standard_A8m_v2',
                              'Standard_B1s',
                              'Standard_B1ms',
                              'Standard_B2s',
                              'Standard_B2ms',
                              'Standard_B4ms',
                              'Standard_B8ms',
                              'Standard_D1',
                              'Standard_D2',
                              'Standard_D3',
                              'Standard_D4',
                              'Standard_D11',
                              'Standard_D12',
                              'Standard_D13',
                              'Standard_D14',
                              'Standard_D1_v2',
                              'Standard_D2_v2',
                              'Standard_D3_v2',
                              'Standard_D4_v2',
                              'Standard_D5_v2',
                              'Standard_D2_v3',
                              'Standard_D4_v3',
                              'Standard_D8_v3',
                              'Standard_D16_v3',
                              'Standard_D32_v3',
                              'Standard_D64_v3',
                              'Standard_D2s_v3',
                              'Standard_D4s_v3',
                              'Standard_D8s_v3',
                              'Standard_D16s_v3',
                              'Standard_D32s_v3',
                              'Standard_D64s_v3',
                              'Standard_D11_v2',
                              'Standard_D12_v2',
                              'Standard_D13_v2',
                              'Standard_D14_v2',
                              'Standard_D15_v2',
                              'Standard_DS1',
                              'Standard_DS2',
                              'Standard_DS3',
                              'Standard_DS4',
                              'Standard_DS11',
                              'Standard_DS12',
                              'Standard_DS13',
                              'Standard_DS14',
                              'Standard_DS1_v2',
                              'Standard_DS2_v2',
                              'Standard_DS3_v2',
                              'Standard_DS4_v2',
                              'Standard_DS5_v2',
                              'Standard_DS11_v2',
                              'Standard_DS12_v2',
                              'Standard_DS13_v2',
                              'Standard_DS14_v2',
                              'Standard_DS15_v2',
                              'Standard_DS13-4_v2',
                              'Standard_DS13-2_v2',
                              'Standard_DS14-8_v2',
                              'Standard_DS14-4_v2',
                              'Standard_E2_v3',
                              'Standard_E4_v3',
                              'Standard_E8_v3',
                              'Standard_E16_v3',
                              'Standard_E32_v3',
                              'Standard_E64_v3',
                              'Standard_E2s_v3',
                              'Standard_E4s_v3',
                              'Standard_E8s_v3',
                              'Standard_E16s_v3',
                              'Standard_E32s_v3',
                              'Standard_E64s_v3',
                              'Standard_E32-16_v3',
                              'Standard_E32-8s_v3',
                              'Standard_E64-32s_v3',
                              'Standard_E64-16s_v3',
                              'Standard_F1',
                              'Standard_F2',
                              ... 66 more items
                            ],
                            'x-ms-enum': {
                              name: 'VirtualMachineSizeTypes',
                              modelAsString: true
                            }
                          },
                          vmSizeProperties: {
                            description: 'Specifies the properties for customizing the size of the virtual machine. Minimum api-version: 2021-07-01. <br><br> This feature is still in preview mode and is not supported for VirtualMachineScaleSet. <br><br> Please follow the instructions in [VM Customization](https://aka.ms/vmcustomization) for more details.',
                            type: 'object',
                            properties: {
                              vCPUsAvailable: {
                                type: 'integer',
                                format: 'int32',
                                description: 'Specifies the number of vCPUs available for the VM. <br><br> When this property is not specified in the request body the default behavior is to set it to the value of vCPUs available for that VM size exposed in api response of [List all available virtual machine sizes in a region](https://docs.microsoft.com/en-us/rest/api/compute/resource-skus/list) .'
                              },
                              vCPUsPerCore: {
                                type: 'integer',
                                format: 'int32',
                                description: 'Specifies the vCPU to physical core ratio. <br><br> When this property is not specified in the request body the default behavior is set to the value of vCPUsPerCore for the VM Size exposed in api response of [List all available virtual machine sizes in a region](https://docs.microsoft.com/en-us/rest/api/compute/resource-skus/list) <br><br> Setting this property to 1 also means that hyper-threading is disabled.'
                              }
                            }
                          }
                        }
                      },
                      storageProfile: {
                        description: 'Gets the storage profile.',
                        properties: {
                          osDisk: {
                            description: 'Gets the OS disk of the VM captured at the time of the restore point creation.',
                            properties: {
                              osType: {
                                type: 'string',
                                description: 'Gets the Operating System type.',
                                enum: [Array],
                                'x-ms-enum': [Object]
                              },
                              encryptionSettings: {
                                properties: [Object],
                                description: 'Describes a Encryption Settings for a Disk'
                              },
                              name: {
                                type: 'string',
                                description: 'Gets the disk name.'
                              },
                              caching: {
                                description: 'Gets the caching type.',
                                type: 'string',
                                enum: [Array],
                                'x-ms-enum': [Object]
                              },
                              diskSizeGB: {
                                type: 'integer',
                                format: 'int32',
                                description: 'Gets the disk size in GB.'
                              },
                              managedDisk: {
                                description: 'Gets the managed disk details',
                                properties: [Object],
                                allOf: [Array]
                              },
                              diskRestorePoint: {
                                properties: [Object],
                                description: 'The API entity reference.'
                              }
                            }
                          },
                          dataDisks: {
                            type: 'array',
                            items: {
                              properties: {
                                lun: [Object],
                                name: [Object],
                                caching: [Object],
                                diskSizeGB: [Object],
                                managedDisk: [Object],
                                diskRestorePoint: [Object]
                              },
                              description: 'Describes a data disk.'
                            },
                            'x-ms-identifiers': [ 'lun' ],
                            description: 'Gets the data disks of the VM captured at the time of the restore point creation.'
                          }
                        }
                      },
                      osProfile: {
                        description: 'Gets the OS profile.',
                        properties: {
                          computerName: {
                            type: 'string',
                            description: 'Specifies the host OS name of the virtual machine. <br><br> This name cannot be updated after the VM is created. <br><br> **Max-length (Windows):** 15 characters <br><br> **Max-length (Linux):** 64 characters. <br><br> For naming conventions and restrictions see [Azure infrastructure services implementation guidelines](https://docs.microsoft.com/azure/azure-resource-manager/management/resource-name-rules).'
                          },
                          adminUsername: {
                            type: 'string',
                            description: 'Specifies the name of the administrator account. <br><br> This property cannot be updated after the VM is created. <br><br> **Windows-only restriction:** Cannot end in "." <br><br> **Disallowed values:** "administrator", "admin", "user", "user1", "test", "user2", "test1", "user3", "admin1", "1", "123", "a", "actuser", "adm", "admin2", "aspnet", "backup", "console", "david", "guest", "john", "owner", "root", "server", "sql", "support", "support_388945a0", "sys", "test2", "test3", "user4", "user5". <br><br> **Minimum-length (Linux):** 1  character <br><br> **Max-length (Linux):** 64 characters <br><br> **Max-length (Windows):** 20 characters.'
                          },
                          adminPassword: {
                            type: 'string',
                            description: 'Specifies the password of the administrator account. <br><br> **Minimum-length (Windows):** 8 characters <br><br> **Minimum-length (Linux):** 6 characters <br><br> **Max-length (Windows):** 123 characters <br><br> **Max-length (Linux):** 72 characters <br><br> **Complexity requirements:** 3 out of 4 conditions below need to be fulfilled <br> Has lower characters <br>Has upper characters <br> Has a digit <br> Has a special character (Regex match [\\W_]) <br><br> **Disallowed values:** "abc@123", "P@$$w0rd", "P@ssw0rd", "P@ssword123", "Pa$$word", "pass@word1", "Password!", "Password1", "Password22", "iloveyou!" <br><br> For resetting the password, see [How to reset the Remote Desktop service or its login password in a Windows VM](https://docs.microsoft.com/troubleshoot/azure/virtual-machines/reset-rdp) <br><br> For resetting root password, see [Manage users, SSH, and check or repair disks on Azure Linux VMs using the VMAccess Extension](https://docs.microsoft.com/troubleshoot/azure/virtual-machines/troubleshoot-ssh-connection)'
                          },
                          customData: {
                            type: 'string',
                            description: 'Specifies a base-64 encoded string of custom data. The base-64 encoded string is decoded to a binary array that is saved as a file on the Virtual Machine. The maximum length of the binary array is 65535 bytes. <br><br> **Note: Do not pass any secrets or passwords in customData property** <br><br> This property cannot be updated after the VM is created. <br><br> customData is passed to the VM to be saved as a file, for more information see [Custom Data on Azure VMs](https://azure.microsoft.com/blog/custom-data-and-cloud-init-on-windows-azure/) <br><br> For using cloud-init for your Linux VM, see [Using cloud-init to customize a Linux VM during creation](https://docs.microsoft.com/azure/virtual-machines/linux/using-cloud-init)'
                          },
                          windowsConfiguration: {
                            description: 'Specifies Windows operating system settings on the virtual machine.',
                            properties: {
                              provisionVMAgent: {
                                type: 'boolean',
                                description: 'Indicates whether virtual machine agent should be provisioned on the virtual machine. <br><br> When this property is not specified in the request body, default behavior is to set it to true.  This will ensure that VM Agent is installed on the VM so that extensions can be added to the VM later.'
                              },
                              enableAutomaticUpdates: {
                                type: 'boolean',
                                description: 'Indicates whether Automatic Updates is enabled for the Windows virtual machine. Default value is true. <br><br> For virtual machine scale sets, this property can be updated and updates will take effect on OS reprovisioning.'
                              },
                              timeZone: {
                                type: 'string',
                                description: 'Specifies the time zone of the virtual machine. e.g. "Pacific Standard Time". <br><br> Possible values can be [TimeZoneInfo.Id](https://docs.microsoft.com/dotnet/api/system.timezoneinfo.id?#System_TimeZoneInfo_Id) value from time zones returned by [TimeZoneInfo.GetSystemTimeZones](https://docs.microsoft.com/dotnet/api/system.timezoneinfo.getsystemtimezones).'
                              },
                              additionalUnattendContent: {
                                type: 'array',
                                items: [Object],
                                'x-ms-identifiers': [],
                                description: 'Specifies additional base-64 encoded XML formatted information that can be included in the Unattend.xml file, which is used by Windows Setup.'
                              },
                              patchSettings: {
                                description: '[Preview Feature] Specifies settings related to VM Guest Patching on Windows.',
                                properties: [Object]
                              },
                              winRM: {
                                description: 'Specifies the Windows Remote Management listeners. This enables remote Windows PowerShell.',
                                properties: [Object]
                              }
                            }
                          },
                          linuxConfiguration: {
                            description: 'Specifies the Linux operating system settings on the virtual machine. <br><br>For a list of supported Linux distributions, see [Linux on Azure-Endorsed Distributions](https://docs.microsoft.com/azure/virtual-machines/linux/endorsed-distros).',
                            properties: {
                              disablePasswordAuthentication: {
                                type: 'boolean',
                                description: 'Specifies whether password authentication should be disabled.'
                              },
                              ssh: {
                                description: 'Specifies the ssh key configuration for a Linux OS.',
                                properties: [Object]
                              },
                              provisionVMAgent: {
                                type: 'boolean',
                                description: 'Indicates whether virtual machine agent should be provisioned on the virtual machine. <br><br> When this property is not specified in the request body, default behavior is to set it to true.  This will ensure that VM Agent is installed on the VM so that extensions can be added to the VM later.'
                              },
                              patchSettings: {
                                description: '[Preview Feature] Specifies settings related to VM Guest Patching on Linux.',
                                properties: [Object]
                              }
                            }
                          },
                          secrets: {
                            type: 'array',
                            items: {
                              properties: {
                                sourceVault: [Object],
                                vaultCertificates: [Object]
                              },
                              description: 'Describes a set of certificates which are all in the same Key Vault.'
                            },
                            'x-ms-identifiers': [ 'sourceVault/id' ],
                            description: 'Specifies set of certificates that should be installed onto the virtual machine. To install certificates on a virtual machine it is recommended to use the [Azure Key Vault virtual machine extension for Linux](https://docs.microsoft.com/azure/virtual-machines/extensions/key-vault-linux) or the [Azure Key Vault virtual machine extension for Windows](https://docs.microsoft.com/azure/virtual-machines/extensions/key-vault-windows).'
                          },
                          allowExtensionOperations: {
                            type: 'boolean',
                            description: 'Specifies whether extension operations should be allowed on the virtual machine. <br><br>This may only be set to False when no extensions are present on the virtual machine.'
                          },
                          requireGuestProvisionSignal: {
                            type: 'boolean',
                            description: 'Specifies whether the guest provision signal is required to infer provision success of the virtual machine.  **Note: This property is for private testing only, and all customers must not set the property to false.**'
                          }
                        }
                      },
                      diagnosticsProfile: {
                        description: 'Gets the diagnostics profile.',
                        properties: {
                          bootDiagnostics: {
                            description: 'Boot Diagnostics is a debugging feature which allows you to view Console Output and Screenshot to diagnose VM status. <br>**NOTE**: If storageUri is being specified then ensure that the storage account is in the same region and subscription as the VM. <br><br> You can easily view the output of your console log. <br><br> Azure also enables you to see a screenshot of the VM from the hypervisor.',
                            properties: {
                              enabled: {
                                type: 'boolean',
                                description: 'Whether boot diagnostics should be enabled on the Virtual Machine.'
                              },
                              storageUri: {
                                type: 'string',
                                description: 'Uri of the storage account to use for placing the console output and screenshot. <br><br>If storageUri is not specified while enabling boot diagnostics, managed storage will be used.'
                              }
                            }
                          }
                        }
                      },
                      licenseType: {
                        type: 'string',
                        description: 'Gets the license type, which is for bring your own license scenario.'
                      },
                      vmId: {
                        type: 'string',
                        description: 'Gets the virtual machine unique id.'
                      },
                      securityProfile: {
                        description: 'Gets the security profile.',
                        properties: {
                          uefiSettings: {
                            description: 'Specifies the security settings like secure boot and vTPM used while creating the virtual machine. <br><br>Minimum api-version: 2020-12-01',
                            properties: {
                              secureBootEnabled: {
                                type: 'boolean',
                                description: 'Specifies whether secure boot should be enabled on the virtual machine. <br><br>Minimum api-version: 2020-12-01'
                              },
                              vTpmEnabled: {
                                type: 'boolean',
                                description: 'Specifies whether vTPM should be enabled on the virtual machine. <br><br>Minimum api-version: 2020-12-01'
                              }
                            }
                          },
                          encryptionAtHost: {
                            type: 'boolean',
                            description: 'This property can be used by user in the request to enable or disable the Host Encryption for the virtual machine or virtual machine scale set. This will enable the encryption for all the disks including Resource/Temp disk at host itself. <br><br> Default: The Encryption at host will be disabled unless this property is set to true for the resource.'
                          },
                          securityType: {
                            type: 'string',
                            description: 'Specifies the SecurityType of the virtual machine. It has to be set to any specified value to enable UefiSettings. <br><br> Default: UefiSettings will not be enabled unless this property is set.',
                            enum: [ 'TrustedLaunch', 'ConfidentialVM' ],
                            'x-ms-enum': {
                              name: 'SecurityTypes',
                              modelAsString: true
                            }
                          }
                        }
                      },
                      location: {
                        type: 'string',
                        description: 'Location of the VM from which the restore point was created.'
                      }
                    }
                  },
                  provisioningState: {
                    type: 'string',
                    readOnly: true,
                    description: 'Gets the provisioning state of the restore point.'
                  },
                  consistencyMode: {
                    type: 'string',
                    readOnly: true,
                    enum: [
                      'CrashConsistent',
                      'FileSystemConsistent',
                      'ApplicationConsistent'
                    ],
                    'x-ms-enum': {
                      name: 'ConsistencyModeTypes',
                      modelAsString: true
                    },
                    description: 'Gets the consistency mode for the restore point. Please refer to https://aka.ms/RestorePoints for more details.'
                  },
                  timeCreated: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Gets the creation time of the restore point.'
                  },
                  sourceRestorePoint: {
                    properties: {
                      id: {
                        type: 'string',
                        description: 'The ARM resource id in the form of /subscriptions/{SubscriptionId}/resourceGroups/{ResourceGroupName}/...'
                      }
                    },
                    description: 'The API entity reference.'
                  },
                  instanceView: {
                    readOnly: true,
                    description: 'The restore point instance view.',
                    type: 'object',
                    properties: {
                      diskRestorePoints: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Disk restore point Id.'
                            },
                            replicationStatus: {
                              type: 'object',
                              items: {
                                type: 'object',
                                properties: [Object],
                                description: 'The instance view of a disk restore point.'
                              },
                              description: 'The disk restore point replication status information.'
                            }
                          },
                          description: 'The instance view of a disk restore point.'
                        },
                        description: 'The disk restore points information.'
                      },
                      statuses: {
                        type: 'array',
                        items: {
                          properties: {
                            code: {
                              type: 'string',
                              description: 'The status code.'
                            },
                            level: {
                              type: 'string',
                              description: 'The level code.',
                              enum: [ 'Info', 'Warning', 'Error' ],
                              'x-ms-enum': {
                                name: 'StatusLevelTypes',
                                modelAsString: false
                              }
                            },
                            displayStatus: {
                              type: 'string',
                              description: 'The short localizable label for the status.'
                            },
                            message: {
                              type: 'string',
                              description: 'The detailed status message, including for alerts and error messages.'
                            },
                            time: {
                              type: 'string',
                              format: 'date-time',
                              description: 'The time of the status.'
                            }
                          },
                          description: 'Instance view status.'
                        },
                        'x-ms-identifiers': [],
                        description: 'The resource status information.'
                      }
                    }
                  }
                },
                description: 'The restore point properties.'
              }
            },
            allOf: [
              {
                properties: {
                  id: {
                    readOnly: true,
                    type: 'string',
                    description: 'Resource Id'
                  },
                  name: {
                    readOnly: true,
                    type: 'string',
                    description: 'Resource name'
                  },
                  type: {
                    readOnly: true,
                    type: 'string',
                    description: 'Resource type'
                  }
                },
                description: 'The resource model definition for an Azure Resource Manager proxy resource. It will not have tags and a location',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Restore Point details.'
          },
          description: 'A list containing all restore points created under this restore point collection.'
        }
      },
      description: 'The restore point collection properties.'
    }
  },
  allOf: [
    {
      description: 'The Resource model definition.',
      properties: {
        id: { readOnly: true, type: 'string', description: 'Resource Id' },
        name: {
          readOnly: true,
          type: 'string',
          description: 'Resource name'
        },
        type: {
          readOnly: true,
          type: 'string',
          description: 'Resource type'
        },
        location: { type: 'string', description: 'Resource location' },
        tags: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'Resource tags'
        }
      },
      required: [ 'location' ],
      'x-ms-azure-resource': true
    }
  ],
  description: 'Create or update Restore Point collection parameters.'
}
```
## Misc
The resource version is `2021-11-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-11-01/compute.json).
