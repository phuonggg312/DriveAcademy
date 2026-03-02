<div align="center">
  <img src="https://cdn.shopify.com/s/files/1/1987/3449/t/5/assets/mindarc-logo-blk.png?v=152472296200138488861589258936" width="160" height="160"></img>
  <h1><code>MindArc ArcTheme</code></h1>
  <strong>NPX Template for Arctheme</strong>


</div>

<hr>

<div align="center">

<a href="">[![Publish Project to NPM](https://github.com/mindarc/arcbridge/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/mindarc/arctheme/actions/workflows/tagged-release.yml) </a>

</div>

### Instructions

To create a starter template simply run:

```
npx @mindarc/arctheme@latest <your_project_name>
```

Refer to ```README.md``` in the generated directory for further instructions.

### Deployment instructions
- Confirm the value of ```npm view @mindarc/arctheme version``` and the Github release version are the same
- Update ```package.json``` using semantic versioning
- Commit this change and create a tag that matches the version in package.json e.g ```git tag v1.0.22```
- Push this tag, this will trigger a release build
- The command ```npx @mindarc/arctheme@latest <your_project_name>``` should contain any files that have been updated

|Level|Workflow|Type|Description |
|-|-|-|-|
|arctheme|tagged-release.yml|Manual|This workflow will push the Arctheme package to NPM so that npx commands are able to pull the latest version|
