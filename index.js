#!/usr/bin/env node

// Usage: npx @mindarc/arcbridge@latest <name-of-project>
const spawn = require('cross-spawn');
const fs = require('fs');
const path = require('path');

// The first argument will be the project name.
const projectName = process.argv[2];

// Create a project directory with the project name.
const currentDir = process.cwd();
const projectDir = path.resolve(currentDir, projectName);
fs.mkdirSync(projectDir, { recursive: true });

// A common approach to building a starter template is to
// create a `template` folder which will house the template
// and the files we want to create.
const templateDir = path.resolve(__dirname, 'template');
fs.cpSync(templateDir, projectDir, { recursive: true });

// It is good practice to have dotfiles stored in the
// template without the dot (so they do not get picked
// up by the starter template repository). We can rename
// the dotfiles after we have copied them over to the
// new project directory.
fs.renameSync(path.join(projectDir, 'gitignore'), path.join(projectDir, '.gitignore'));
fs.renameSync(path.join(projectDir, 'gitattributes'), path.join(projectDir, '.gitattributes'));
fs.renameSync(path.join(projectDir, 'eslintrc'), path.join(projectDir, '.eslintrc'));
fs.renameSync(path.join(projectDir, 'editorconfig'), path.join(projectDir, '.editorconfig'));
fs.renameSync(path.join(projectDir, 'babelrc'), path.join(projectDir, '.babelrc'));
fs.renameSync(path.join(projectDir, 'shopifyignore'), path.join(projectDir, '.shopifyignore'));
fs.renameSync(path.join(projectDir, 'theme-check.yml'), path.join(projectDir, '.theme-check.yml'));

const projectPackageJson = require(path.join(projectDir, 'package.json'));

// Update the project's package.json with the new project name
projectPackageJson.name = projectName;

fs.writeFileSync(
    path.join(projectDir, 'package.json'),
    JSON.stringify(projectPackageJson, null, 2)
);
// Run `npm install` in the project directory to install
// the dependencies. We are using a third-party library
// called `cross-spawn` for cross-platform support.
// (Node has issues spawning child processes in Windows).
// spawn.sync('npm', ['install'], { stdio: 'inherit' });

console.log('Success! Your new project is ready.');
console.log(`Created ${projectName} at ${projectDir}`);
