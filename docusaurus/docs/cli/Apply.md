---
id: Apply
title: Apply
---

The **apply** commands effectively deploys the resources. It first finds out which resources has to be deployed by running the **plan** command. The user is prompted to confirm the plan.

## Command

```
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
    style={{ width: "100%", height: "900px" }}
    ></iframe>
</div>

## Command options

```
gc help apply
```

```
Usage: gc apply|a [options]

Apply the plan, a.k.a deploy the resources

Options:
  -f, --force  force deploy, will not prompt user
  -h, --help   display help for command
```

### alias

The command alias is _a_

```
gc a
```

### force

The **force** option to not prompt the user to apply the plan

```
gc apply --force
```
