---
id: RestorePoint
title: RestorePoint
---
Provides a **RestorePoint** from the **Compute** group
## Examples
### Create a restore point
```js
provider.Compute.makeRestorePoint({
  name: "myRestorePoint",
  properties: () => ({
    properties: {
      excludeDisks: [
        {
          id: "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/disks/disk123",
        },
      ],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    vault: resources.KeyVault.Vault["myVault"],
    key: resources.KeyVault.Key["myKey"],
    disk: resources.Compute.Disk["myDisk"],
    virtualMachineScaleSetVm:
      resources.Compute.VirtualMachineScaleSetVM["myVirtualMachineScaleSetVM"],
    restorePointCollection:
      resources.Compute.RestorePointCollection["myRestorePointCollection"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Vault](../KeyVault/Vault.md)
- [Key](../KeyVault/Key.md)
- [Disk](../Compute/Disk.md)
- [VirtualMachineScaleSetVM](../Compute/VirtualMachineScaleSetVM.md)
- [RestorePointCollection](../Compute/RestorePointCollection.md)
## Swagger Schema
```js
{
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
                      enum: [ 'Windows', 'Linux' ],
                      'x-ms-enum': {
                        name: 'OperatingSystemType',
                        modelAsString: true
                      }
                    },
                    encryptionSettings: {
                      properties: {
                        diskEncryptionKey: {
                          description: 'Specifies the location of the disk encryption key, which is a Key Vault Secret.',
                          properties: {
                            secretUrl: {
                              type: 'string',
                              description: 'The URL referencing a secret in a Key Vault.'
                            },
                            sourceVault: {
                              properties: { id: [Object] },
                              'x-ms-azure-resource': true,
                              description: 'The relative URL of the Key Vault containing the secret.'
                            }
                          },
                          required: [ 'secretUrl', 'sourceVault' ]
                        },
                        keyEncryptionKey: {
                          description: 'Specifies the location of the key encryption key in Key Vault.',
                          properties: {
                            keyUrl: {
                              type: 'string',
                              description: 'The URL referencing a key encryption key in Key Vault.'
                            },
                            sourceVault: {
                              properties: { id: [Object] },
                              'x-ms-azure-resource': true,
                              description: 'The relative URL of the Key Vault containing the key.'
                            }
                          },
                          required: [ 'keyUrl', 'sourceVault' ]
                        },
                        enabled: {
                          type: 'boolean',
                          description: 'Specifies whether disk encryption should be enabled on the virtual machine.'
                        }
                      },
                      description: 'Describes a Encryption Settings for a Disk'
                    },
                    name: {
                      type: 'string',
                      description: 'Gets the disk name.'
                    },
                    caching: {
                      description: 'Gets the caching type.',
                      type: 'string',
                      enum: [ 'None', 'ReadOnly', 'ReadWrite' ],
                      'x-ms-enum': { name: 'CachingTypes', modelAsString: false }
                    },
                    diskSizeGB: {
                      type: 'integer',
                      format: 'int32',
                      description: 'Gets the disk size in GB.'
                    },
                    managedDisk: {
                      description: 'Gets the managed disk details',
                      properties: {
                        storageAccountType: {
                          description: 'Specifies the storage account type for the managed disk. NOTE: UltraSSD_LRS can only be used with data disks, it cannot be used with OS Disk.',
                          type: 'string',
                          enum: [
                            'Standard_LRS',
                            'Premium_LRS',
                            'StandardSSD_LRS',
                            'UltraSSD_LRS',
                            'Premium_ZRS',
                            'StandardSSD_ZRS'
                          ],
                          'x-ms-enum': {
                            name: 'StorageAccountTypes',
                            modelAsString: true
                          }
                        },
                        diskEncryptionSet: {
                          description: 'Specifies the customer managed disk encryption set resource id for the managed disk.',
                          allOf: [
                            {
                              properties: { id: [Object] },
                              'x-ms-azure-resource': true
                            }
                          ]
                        }
                      },
                      allOf: [
                        {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource Id'
                            }
                          },
                          'x-ms-azure-resource': true
                        }
                      ]
                    },
                    diskRestorePoint: {
                      properties: {
                        id: {
                          type: 'string',
                          description: 'The ARM resource id in the form of /subscriptions/{SubscriptionId}/resourceGroups/{ResourceGroupName}/...'
                        }
                      },
                      description: 'The API entity reference.'
                    }
                  }
                },
                dataDisks: {
                  type: 'array',
                  items: {
                    properties: {
                      lun: {
                        type: 'integer',
                        format: 'int32',
                        description: 'Gets the logical unit number.'
                      },
                      name: {
                        type: 'string',
                        description: 'Gets the disk name.'
                      },
                      caching: {
                        description: 'Gets the caching type.',
                        type: 'string',
                        enum: [ 'None', 'ReadOnly', 'ReadWrite' ],
                        'x-ms-enum': { name: 'CachingTypes', modelAsString: false }
                      },
                      diskSizeGB: {
                        type: 'integer',
                        format: 'int32',
                        description: 'Gets the initial disk size in GB for blank data disks, and the new desired size for existing OS and Data disks.'
                      },
                      managedDisk: {
                        description: 'Gets the managed disk details',
                        properties: {
                          storageAccountType: {
                            description: 'Specifies the storage account type for the managed disk. NOTE: UltraSSD_LRS can only be used with data disks, it cannot be used with OS Disk.',
                            type: 'string',
                            enum: [
                              'Standard_LRS',
                              'Premium_LRS',
                              'StandardSSD_LRS',
                              'UltraSSD_LRS',
                              'Premium_ZRS',
                              'StandardSSD_ZRS'
                            ],
                            'x-ms-enum': {
                              name: 'StorageAccountTypes',
                              modelAsString: true
                            }
                          },
                          diskEncryptionSet: {
                            description: 'Specifies the customer managed disk encryption set resource id for the managed disk.',
                            allOf: [
                              {
                                properties: [Object],
                                'x-ms-azure-resource': true
                              }
                            ]
                          }
                        },
                        allOf: [
                          {
                            properties: {
                              id: {
                                type: 'string',
                                description: 'Resource Id'
                              }
                            },
                            'x-ms-azure-resource': true
                          }
                        ]
                      },
                      diskRestorePoint: {
                        properties: {
                          id: {
                            type: 'string',
                            description: 'The ARM resource id in the form of /subscriptions/{SubscriptionId}/resourceGroups/{ResourceGroupName}/...'
                          }
                        },
                        description: 'The API entity reference.'
                      }
                    },
                    description: 'Describes a data disk.'
                  },
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
                      items: {
                        properties: {
                          passName: {
                            type: 'string',
                            description: 'The pass name. Currently, the only allowable value is OobeSystem.',
                            enum: [ 'OobeSystem' ],
                            'x-ms-enum': { name: 'PassNames', modelAsString: false }
                          },
                          componentName: {
                            type: 'string',
                            description: 'The component name. Currently, the only allowable value is Microsoft-Windows-Shell-Setup.',
                            enum: [ 'Microsoft-Windows-Shell-Setup' ],
                            'x-ms-enum': {
                              name: 'ComponentNames',
                              modelAsString: false
                            }
                          },
                          settingName: {
                            type: 'string',
                            description: 'Specifies the name of the setting to which the content applies. Possible values are: FirstLogonCommands and AutoLogon.',
                            enum: [ 'AutoLogon', 'FirstLogonCommands' ],
                            'x-ms-enum': {
                              name: 'SettingNames',
                              modelAsString: false
                            }
                          },
                          content: {
                            type: 'string',
                            description: 'Specifies the XML formatted content that is added to the unattend.xml file for the specified path and component. The XML must be less than 4KB and must include the root element for the setting or feature that is being inserted.'
                          }
                        },
                        description: 'Specifies additional XML formatted information that can be included in the Unattend.xml file, which is used by Windows Setup. Contents are defined by setting name, component name, and the pass in which the content is applied.'
                      },
                      description: 'Specifies additional base-64 encoded XML formatted information that can be included in the Unattend.xml file, which is used by Windows Setup.'
                    },
                    patchSettings: {
                      description: '[Preview Feature] Specifies settings related to VM Guest Patching on Windows.',
                      properties: {
                        patchMode: {
                          type: 'string',
                          description: 'Specifies the mode of VM Guest Patching to IaaS virtual machine or virtual machines associated to virtual machine scale set with OrchestrationMode as Flexible.<br /><br /> Possible values are:<br /><br /> **Manual** - You  control the application of patches to a virtual machine. You do this by applying patches manually inside the VM. In this mode, automatic updates are disabled; the property WindowsConfiguration.enableAutomaticUpdates must be false<br /><br /> **AutomaticByOS** - The virtual machine will automatically be updated by the OS. The property WindowsConfiguration.enableAutomaticUpdates must be true. <br /><br /> **AutomaticByPlatform** - the virtual machine will automatically updated by the platform. The properties provisionVMAgent and WindowsConfiguration.enableAutomaticUpdates must be true ',
                          enum: [
                            'Manual',
                            'AutomaticByOS',
                            'AutomaticByPlatform'
                          ],
                          'x-ms-enum': {
                            name: 'WindowsVMGuestPatchMode',
                            modelAsString: true
                          }
                        },
                        enableHotpatching: {
                          type: 'boolean',
                          description: "Enables customers to patch their Azure VMs without requiring a reboot. For enableHotpatching, the 'provisionVMAgent' must be set to true and 'patchMode' must be set to 'AutomaticByPlatform'."
                        },
                        assessmentMode: {
                          type: 'string',
                          description: 'Specifies the mode of VM Guest patch assessment for the IaaS virtual machine.<br /><br /> Possible values are:<br /><br /> **ImageDefault** - You control the timing of patch assessments on a virtual machine.<br /><br /> **AutomaticByPlatform** - The platform will trigger periodic patch assessments. The property provisionVMAgent must be true. ',
                          enum: [ 'ImageDefault', 'AutomaticByPlatform' ],
                          'x-ms-enum': {
                            name: 'WindowsPatchAssessmentMode',
                            modelAsString: true
                          }
                        }
                      }
                    },
                    winRM: {
                      description: 'Specifies the Windows Remote Management listeners. This enables remote Windows PowerShell.',
                      properties: {
                        listeners: {
                          type: 'array',
                          items: {
                            properties: {
                              protocol: {
                                type: 'string',
                                description: 'Specifies the protocol of WinRM listener. <br><br> Possible values are: <br>**http** <br><br> **https**',
                                enum: [Array],
                                'x-ms-enum': [Object]
                              },
                              certificateUrl: {
                                type: 'string',
                                description: 'This is the URL of a certificate that has been uploaded to Key Vault as a secret. For adding a secret to the Key Vault, see [Add a key or secret to the key vault](https://docs.microsoft.com/azure/key-vault/key-vault-get-started/#add). In this case, your certificate needs to be It is the Base64 encoding of the following JSON Object which is encoded in UTF-8: <br><br> {<br>  "data":"<Base64-encoded-certificate>",<br>  "dataType":"pfx",<br>  "password":"<pfx-file-password>"<br>} <br> To install certificates on a virtual machine it is recommended to use the [Azure Key Vault virtual machine extension for Linux](https://docs.microsoft.com/azure/virtual-machines/extensions/key-vault-linux) or the [Azure Key Vault virtual machine extension for Windows](https://docs.microsoft.com/azure/virtual-machines/extensions/key-vault-windows).'
                              }
                            },
                            description: 'Describes Protocol and thumbprint of Windows Remote Management listener'
                          },
                          description: 'The list of Windows Remote Management listeners'
                        }
                      }
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
                      properties: {
                        publicKeys: {
                          type: 'array',
                          items: {
                            properties: {
                              path: {
                                type: 'string',
                                description: 'Specifies the full path on the created VM where ssh public key is stored. If the file already exists, the specified key is appended to the file. Example: /home/user/.ssh/authorized_keys'
                              },
                              keyData: {
                                type: 'string',
                                description: 'SSH public key certificate used to authenticate with the VM through ssh. The key needs to be at least 2048-bit and in ssh-rsa format. <br><br> For creating ssh keys, see [Create SSH keys on Linux and Mac for Linux VMs in Azure]https://docs.microsoft.com/azure/virtual-machines/linux/create-ssh-keys-detailed).'
                              }
                            },
                            description: 'Contains information about SSH certificate public key and the path on the Linux VM where the public key is placed.'
                          },
                          description: 'The list of SSH public keys used to authenticate with linux based VMs.'
                        }
                      }
                    },
                    provisionVMAgent: {
                      type: 'boolean',
                      description: 'Indicates whether virtual machine agent should be provisioned on the virtual machine. <br><br> When this property is not specified in the request body, default behavior is to set it to true.  This will ensure that VM Agent is installed on the VM so that extensions can be added to the VM later.'
                    },
                    patchSettings: {
                      description: '[Preview Feature] Specifies settings related to VM Guest Patching on Linux.',
                      properties: {
                        patchMode: {
                          type: 'string',
                          description: "Specifies the mode of VM Guest Patching to IaaS virtual machine or virtual machines associated to virtual machine scale set with OrchestrationMode as Flexible.<br /><br /> Possible values are:<br /><br /> **ImageDefault** - The virtual machine's default patching configuration is used. <br /><br /> **AutomaticByPlatform** - The virtual machine will be automatically updated by the platform. The property provisionVMAgent must be true",
                          enum: [ 'ImageDefault', 'AutomaticByPlatform' ],
                          'x-ms-enum': {
                            name: 'LinuxVMGuestPatchMode',
                            modelAsString: true
                          }
                        },
                        assessmentMode: {
                          type: 'string',
                          description: 'Specifies the mode of VM Guest Patch Assessment for the IaaS virtual machine.<br /><br /> Possible values are:<br /><br /> **ImageDefault** - You control the timing of patch assessments on a virtual machine. <br /><br /> **AutomaticByPlatform** - The platform will trigger periodic patch assessments. The property provisionVMAgent must be true.',
                          enum: [ 'ImageDefault', 'AutomaticByPlatform' ],
                          'x-ms-enum': {
                            name: 'LinuxPatchAssessmentMode',
                            modelAsString: true
                          }
                        }
                      }
                    }
                  }
                },
                secrets: {
                  type: 'array',
                  items: {
                    properties: {
                      sourceVault: {
                        properties: {
                          id: {
                            type: 'string',
                            description: 'Resource Id'
                          }
                        },
                        'x-ms-azure-resource': true,
                        description: 'The relative URL of the Key Vault containing all of the certificates in VaultCertificates.'
                      },
                      vaultCertificates: {
                        type: 'array',
                        items: {
                          properties: {
                            certificateUrl: {
                              type: 'string',
                              description: 'This is the URL of a certificate that has been uploaded to Key Vault as a secret. For adding a secret to the Key Vault, see [Add a key or secret to the key vault](https://docs.microsoft.com/azure/key-vault/key-vault-get-started/#add). In this case, your certificate needs to be It is the Base64 encoding of the following JSON Object which is encoded in UTF-8: <br><br> {<br>  "data":"<Base64-encoded-certificate>",<br>  "dataType":"pfx",<br>  "password":"<pfx-file-password>"<br>} <br> To install certificates on a virtual machine it is recommended to use the [Azure Key Vault virtual machine extension for Linux](https://docs.microsoft.com/azure/virtual-machines/extensions/key-vault-linux) or the [Azure Key Vault virtual machine extension for Windows](https://docs.microsoft.com/azure/virtual-machines/extensions/key-vault-windows).'
                            },
                            certificateStore: {
                              type: 'string',
                              description: 'For Windows VMs, specifies the certificate store on the Virtual Machine to which the certificate should be added. The specified certificate store is implicitly in the LocalMachine account. <br><br>For Linux VMs, the certificate file is placed under the /var/lib/waagent directory, with the file name &lt;UppercaseThumbprint&gt;.crt for the X509 certificate file and &lt;UppercaseThumbprint&gt;.prv for private key. Both of these files are .pem formatted.'
                            }
                          },
                          description: 'Describes a single certificate reference in a Key Vault, and where the certificate should reside on the VM.'
                        },
                        description: 'The list of key vault references in SourceVault which contain certificates.'
                      }
                    },
                    description: 'Describes a set of certificates which are all in the same Key Vault.'
                  },
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
                  description: 'Specifies the SecurityType of the virtual machine. It is set as TrustedLaunch to enable UefiSettings. <br><br> Default: UefiSettings will not be enabled unless this property is set as TrustedLaunch.',
                  enum: [ 'TrustedLaunch' ],
                  'x-ms-enum': { name: 'SecurityTypes', modelAsString: true }
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
          'x-ms-enum': { name: 'ConsistencyModeTypes', modelAsString: true },
          description: 'Gets the consistency mode for the restore point. Please refer to https://aka.ms/RestorePoints for more details.'
        },
        timeCreated: {
          type: 'string',
          format: 'date-time',
          description: 'Gets the creation time of the restore point.'
        }
      },
      description: 'The restore point properties.'
    }
  },
  allOf: [
    {
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
        }
      },
      description: 'The resource model definition for an Azure Resource Manager proxy resource. It will not have tags and a location',
      'x-ms-azure-resource': true
    }
  ],
  description: 'Restore Point details.'
}
```
## Misc
The resource version is `2021-07-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-07-01/compute.json).
