---
id: Apply
title: gc apply
---

The **apply** commands effectively deploys the resources. It first finds out which resources has to be deployed by running the **plan** command. The user is prompted to confirm the plan.

## Command

```sh
gc apply
```

## Screencast

<div>
    <iframe
    data-autoplay
    src="https://asciinema.org/a/fSjitJBdZt7qoIGPbIemGk3rq/iframe?autoplay=true&amp;speed=2&amp;loop=true"
    id="asciicast-iframe-13761"
    name="asciicast-iframe-13761"
    scrolling="no"
    style="width: 100%;height: 500px"
    ></iframe>
</div>

## Command options

```sh
gc help apply
```

```txt
Usage: gc apply|a [options]

Apply the plan, a.k.a deploy the resources

Options:
  -f, --force             force deploy, will not prompt user
  -p, --provider <value>  Filter by provider, multiple values allowed
  -h, --help              display help for command
```

### alias

The command alias is _a_

```sh
gc a
```

### force

The **force** option do not prompt the user to apply the plan

```sh
gc apply --force
```

### provider

The **provider** option allows to apply for a specific set of providers

```sh
gc apply --provider aws
```
