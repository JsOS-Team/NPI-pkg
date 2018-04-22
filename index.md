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


NPI can install packages from the main repository (aka NPI-pkg) and forked repositories from both GitHub and GitLab. By default, packages are searched for in main GitLab repository. You can override this behaviour by using the following commands:

```bash
$ start npi backend github  # Load from main GitHub repository
$ start npi backend github:imachug  # Load from imachug's GitHub repository
$ start npi backend gitlab:imachug  # Load from imachug's GitLab repository
```

By default, GitHub's and GitLab's *raw files* feature is used. It is unknown whether is has limits, but it works for installation of a given version. If you want to install the latest version and at the same time use *GitHub/GitLab Pages* backend, use:

```bash
$ start npi i <pkg>@pages
```


## Creating a package

### 1. Fork

First, fork our [GitHub](https://github.com/JsOS-Team/NPI-pkg/fork) or [GitLab](https://gitlab.com/JsOS/NPI-pkg/forks/new) repository.

Then enable GitHub or GitLab pages, if you want to use `install <pkg>@pages`.

#### GitHub

Open your fork. Open settings and find *GitHub Pages* section. Choose *master branch* as source and press *Save*. Wait for page `https://<your_username>.github.io/NPI-pkg/` to appear.

#### GitLab

Open your fork. Open *CI / CD* tab on the left, then choose *Run Pipeline*. Choose *master* and *Create pipeline* and wait for the pipeline to finish. Open page `https://<your_username>.gitlab.io/NPI-pkg/`.


### 2. Develop

Then clone your fork:

```bash
$ git clone https://<github/gitlab>.com/<your_username>/NPI-pkg
$ cd NPI-pkg
```

If your package has its own repository on GitHub (or elsewhere), add it as a submodule:

```bash
$ git submodule add https://github.com/<your_username>/<name> packages/<name>
```

If there is no repository, just copy the directory:

```bash
$ cp -r ../my_package packages/<name>
```

Publish changes:

```bash
$ git commit -a -m "Package <name>"
$ git push
```

You may change something and push again, and so on.


### 3. Use

Install NPI as specified in [Installation](#installation). Now choose backend:

```bash
$ start npi backend github:<your_usename>
```

or:

```bash
$ start npi backend gitlab:<your_usename>
```

All packages will now be installed from your fork. For example, this will get `<name>` from your fork:

```bash
$ start npi i <name>
```

Or download from *GitHub/GitLab pages*:

```bash
$ start npi i <name>@pages
```


### 4. Publish

Create a pull request at [GitHub](https://github.com/JsOS-Team/NPI-pkg/compare) and set your fork as *head fork*. Describe your package, and we will approve it as soon as possible.