---
id: Destroy
title: Destroy
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
    style={{ width: "100%", height: "700px" }}
    ></iframe>
</div>

## Command Options

```
gc help destroy
```

```
Usage: gc destroy|d [options]

Destroy the resources

Options:
  -f, --force             force destroy, will not prompt user
  -t, --types <type>      Filter by type, multiple values allowed
  -a, --all               destroy all resources including those not managed by us
  -n, --name <value>      destroy by name
  --id <value>            destroy by id
  -p, --provider <value>  Filter by provider name
  -h, --help              display help for command
```

### alias

The command alias is _d_

```
gc d
```

### force

The **force** option to not prompt the user to destroy the resources:

```
gc destroy --force
```

### all

By default, the destroy command only destroys the resources that has been created by this application.
The **all** options destroys resources that has deployed ouside this application.

```
gc destroy --all
```

### types

The **types** option allows to destroy resources of a given type:

```
gc destroy --types Server
```

Example with multiple types:

```
gc destroy --types Server --types Volume
```

### name

The **name** option allows to destroy a specific resource given its name:

```
gc destroy --name web-server
```

### id

The **id** option allows to destroy a specific resource given its id:

```
gc destroy --name ewBMe9BLC
```

### provider

The **provider** option allows to destroy resources of a given provider.

```
gc destroy --provider mock
```
