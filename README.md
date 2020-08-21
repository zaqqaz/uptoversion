[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#)

# UPTOVERSION
Raise a pull request to update the dependency to the specific version in any project

### Installation

- For CI
```
npm i uptoversion
```

- For local usage
```
npm i -g uptoversion
```

### Usage

Just pass GITHUB_TOKEN, RepoName, PackageName, CustomPath(optional, i.e. "packages/myPackage"), PackageVersion, BaseBranch(optional, default - "master") and run uptoversion
```
GITHUB_TOKEN="token" BaseBranch="master" RepoName="zaqqaz/uptoversion" PackageName="typescript" PackageVersion="next" uptoversion
```

## Enjoy 🚀🥤
