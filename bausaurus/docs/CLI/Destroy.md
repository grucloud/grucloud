---
id: Destroy
title: gc destroy
---

The **destroy** command destroys the resources which has been previously deployed.

```sh
gc destroy
```

<div>
    <iframe
    data-autoplay
    src="https://asciinema.org/a/0lD2ub5ltJCEifqifCWGNYAg6/iframe?autoplay=true&amp;speed=2&amp;loop=true"
    id="asciicast-iframe-13761"
    name="asciicast-iframe-13761"
    scrolling="no"
    style="width: 100%; height: 600px"
    ></iframe>

</div>

## Command Options

```sh
gc help destroy
```

```txt
Usage: gc destroy|d [options]

Destroy the resources

Options:
  -f, --force                  force destroy, will not prompt user
  -p, --provider <value>       Filter by provider, multiple values allowed
  -t, --types <value>          Include by type, multiple values allowed
  --group <value>              Include by group, multiple values allowed
  -e, --types-exclude <value>  Exclude by type, multiple values allowed
  -a, --all                    destroy all resources including those not managed by us
  -n, --name <value>           destroy by name
  --id <value>                 destroy by id
  -h, --help                   display help for command
```

### alias

The command alias is _d_

```sh
gc d
```

### force

The **force** option to not prompt the user to destroy the resources:

```sh
gc destroy --force
```

### all

By default, the destroy command only destroys the resources that has been created by this application.
The **all** options destroys resources that has deployed ouside this application.

```sh
gc destroy --all
```

### types

The **types** option allows to destroy resources of a given type:

```sh
gc destroy --types Server
```

Example with multiple types:

```sh
gc destroy --types Server --types Volume
```

### name

The **name** option allows to destroy a specific resource given its name:

```sh
gc destroy --name web-server
```

### id

The **id** option allows to destroy a specific resource given its id:

```sh
gc destroy --name ewBMe9BLC
```

### provider

The **provider** option allows to destroy resources of a given provider.

```sh
gc destroy --provider mock
```
