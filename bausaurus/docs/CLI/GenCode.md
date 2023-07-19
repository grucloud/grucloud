---
id: GenCode
title: gc gencode
---

The **gencode** commands generates the code from the live infrastructure.

## Command Options

```sh
gc help gencode
```

```txt
Usage: gc gencode|c [options]

Generate infrastruture code from deployed resources

Options:
  -t, --types <value>          Include by type, multiple values allowed
  --group <value>              Include by group, multiple values allowed
  -e, --types-exclude <value>  Exclude by type, multiple values allowed
  --resource-group <value>     Azure only: Filter by resource groups, multiple values
                               allowed
  --inventory <file>           resources inventory (default: "artifacts/inventory.json")
  --no-inventory-fetch         do not fetch the inventory
  download                     download the assets, i.e S3 Object
  -o, --outputDir <file>       output directory (default: "")
  --outputFile <file>          output filename (default: "resources")
  --outputEnv <file>           default.env environment variables (default:
                               "default.template.env")
  -m, --mapping <file>         mapping file (default: "mapping.json")
  --no-prompt                  no prompt for saving
  -p, --provider <value>       Filter by provider, multiple values allowed
  -h, --help                   display help for command
```
