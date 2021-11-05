---
id: GenCode
title: Generate Code
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
  --inventory <file>       resources inventory (default:
                           "artifacts/inventory.json")
  --no-inventory-fetch     do not fetch the inventory
  --no-download            do not download assets
  -o, --outputCode <file>  resources.js output (default: "resources.js")
  --outputEnv <file>       default.env environment variables (default:
                           "artifacts/default.env")
  -m, --mapping <file>     mapping file (default: "mapping.json")
  --no-prompt              no prompt for saving
  -p, --provider <value>   Filter by provider, multiple values allowed
  -h, --help               display help for command
```
