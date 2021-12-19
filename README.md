The Necro CLI
=================

The command line tool for faster developing experience

# Table of Contents
<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Installation
<!-- usage -->
Using NPM
```sh-session
$ npm install -g necro-cli
```
Or using Yarn
```sh-session
$ yarn global add necro-cli
```
You can also run directly using npx, for example
```sh-session
$ npx necro-cli bootstrap
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`necro bootstrap [PROJECT_TYPE] [VARIANT] [DIR]`](#necro-bootstrap-project_type-variant-dir)

## `necro bootstrap [PROJECT_TYPE] [VARIANT] [DIR]`

Use a boilerplate and setup a new project

```
USAGE
  $ necro bootstrap [PROJECT_TYPE] [VARIANT] [DIR] [-y]

ARGUMENTS
  PROJECT_TYPE  The type of the project. For example: react
  VARIANT       The variant of the boilerplate
  DIR           The path to the project directory

FLAGS
  -y, --yes  Skip input confirmation

DESCRIPTION
  Use a boilerplate and setup a new project
```

_See code: [dist/commands/bootstrap/index.ts](https://github.com/necrobits/necro-cli/blob/v0.0.0/dist/commands/bootstrap/index.ts)_
<!-- commandsstop -->
