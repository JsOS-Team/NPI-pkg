---
layout: default
---
# JsOS / No Problem Installer

[![GitHub](https://img.shields.io/badge/Repository-GitHub-blue.svg)](https://github.com/JsOS-Team/NPI-pkg)
[![GitLab](https://img.shields.io/badge/Repository-GitLab-blue.svg)](https://gitlab.com/JsOS/NPI-pkg)

NPI is a package manager for [JsOS](https://github.com/JsOS-Team/JsOS).


## Installation

Start JsOS (use `jsos start --netdev virtio` if using QEMU, otherwise your network connection may fail).

```bash
$ install npi
App npi installed successful!
```


## Usage

To install a package, use:

```bash
$ start npi install <pkg>
```

or

```bash
$ start npi i <pkg>
```


Before installing, you may want to get some information about a package:

```bash
$ start npi info <pkg>
```

or

```bash
$ start npi f <pkg>
```


You can get more info with `start npi help`.


## Adding your package

[Fork our GitHub repository](https://github.com/JsOS-Team/NPI-pkg/fork). Then clone your fork:

```bash
$ git clone https://github.com/<your_username>/NPI-pkg
$ cd NPI-pkg
```

If your package has its own repository on GitHub (or elsewhere), add it as a submodule:

```bash
$ git submodule add https://github.com/<your_username>/<name> packages/<name>
```

If there is not repository, just copy the directory:

```bash
$ cp -r ../my_package packages/<name>
```

Publish changes:

```bash
$ git commit -a -m "Package <name>"
$ git push
```

[Create a pull request](https://github.com/JsOS-Team/NPI-pkg/compare) and set your fork as *head fork*. Describe your package, and we will approve it as soon as possible.