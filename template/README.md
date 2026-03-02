<div align="center">
  <img src="https://cdn.shopify.com/s/files/1/1987/3449/t/5/assets/mindarc-logo-blk.png?v=152472296200138488861589258936" width="160" height="160"></img>
  <h1><code>MindArc Arctheme</code></h1>
  <strong>NPX Template for Arctheme</strong>
</div>

This is the primary repository that holds the base structure to the Arctheme.
This package servers to provide a base of Arctheme inline with the latest version of [Arctheme Components](https://github.com/mindarc/arctheme-components) 

- A demonstration site can be found [here](https://arctheme.myshopify.com)
- Documentation for Arctheme can be found [here](https://doc.clickup.com/36604317/d/h/12x2cx-312316/5fabc8da69e00bd)

*_This repository will be maintained as new section/blocks/components are introduced into the Arctheme_*
<br /><hr />
## Getting started
To get started, please use the following command (replace latest with particular version you are after - @1.0.2 etc)

```angular2html
npx @mindarc/arctheme@latest <your_project_name>
```
Refer to README.md in the generated directory for further instructions.

<hr />

## Shopify CLI
To easily log into your preferred store and theme, create a `shopify.theme.toml` in the root directory and define your environement details.

Example:

```toml
[environments.development]
store = "mindarc-integrations"
theme = "123123123"

[environments.staging]
store = "mindarc-integrations"
theme = "123123123"
ignore = ["templates/*", "config/*"]

[environments.production]
store = "mindarc-integrations"
theme = "123123123"
ignore = ["templates/*", "config/*"]
```

### Commands

| Command                     |                                Purpose                                |                                          Notes                                          |
|-----------------------------|:---------------------------------------------------------------------:|:---------------------------------------------------------------------------------------:|
| `npm run shopify:dev`       |            Develop with local dev server with live reload             | See [Development Themes](https://shopify.dev/docs/themes/tools/cli#development-themes)  |
| `npm run shopify:push-live` |     Build and publish to live theme on Shopify (for deployments)      |                                                                                         |
| `npm run storybook`         |                    Start storybook local instance                     |          Use this is you want to view the components and update their controls          |
| `npm run chromatic`         |                 Pushes storybook to publish and build                 |                         Only use when new components are added                          |
| `npm run vite:watch`        | Starts local instance of Vite for any changes made to refresh/rebuild |                         Use this when developing locally     
| `npm run vite:build`        |       To be used when you want to build and compile for release       |                         Only for production pushing 
| `npm run storybook`         |            Runs local storybook for base components             |   |
| `npm run chromatic`         |   Builds and pushes the chromatic platform for build/testing    | Use only if changes are made to base, **this will use snapshots on chromatic when run** |


For all other NPM scripts and Shopify CLI theme commands reference **package.json** and [Shopify CLI commands for themes](https://shopify.dev/docs/themes/tools/cli/commands)

## Vite
Arctheme uses [Vite](https://vitejs.dev/) and the [Shopify Vite Plugin](https://github.com/barrel/shopify-vite) and uses the Shopify Vite Plugin default directory locations except for rendering the generated snippet `vite-tag.liquid` as `vite.liquid`.

## CSS

The standard Tailwind boilerplate is provided.

Additionally, **src/css/global.css** can be used for global styles and is not tree-shaken. Layers and @apply can also be used in this file. This is made possible via [@tailwindcss/nesting](https://www.npmjs.com/package/@tailwindcss/nesting).

## Javascript

### Alpine.js
[Alpine.js](https://alpinejs.dev/start-here) is included and Alpine magic properties, components, stores, and directives directories exist in **frontend/alpine**. The modules are auto-registered within **frontend/alpine/index.js**. Reference **frontend/alpine/components/dropdown.js** to see an example of how to export your module.

> By no means do you need to register your Alpine components in this way, and to reduce bundle size it would be advantageous to register components within a section or snippet.

## Storybook
Storybook is utilised to consolidate all components relevant to the project that are referenced and tested against our component library within Figma. This is a way for component building to be simpler and create
more reusability with what is developed and variants that can be utilised through entire project

## Public Directory
The **public** directory in the project root is a [Vite convention](https://vitejs.dev/guide/assets.html#the-public-directory) for placing your static assets. The *vite-plugin-shopify* Vite plugin moves these static files over to the **assets** on build, so you can serve them up just as you would if you placed them in **assets**.

<br /><hr />

## Technologies
[![Github](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com)
![Shopify](https://img.shields.io/static/v1?style=for-the-badge&message=Shopify&color=lightgreen&logo=Shopify&logoColor=white&label=)
![TypeScript](https://img.shields.io/static/v1?style=for-the-badge&message=TypeScript&color=3178C6&logo=TypeScript&logoColor=FFFFFF&label=)
![GithubActions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-966cfe?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-61dafb?style=for-the-badge&logo=react&logoColor=white)
![Storybook](https://img.shields.io/badge/Storybook-ff4686?style=for-the-badge&logo=storybook&logoColor=white)
