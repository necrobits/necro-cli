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
$ yarn add -g necro-cli
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`necro bootstrap [PROJECT_TYPE] [VARIANT] [DIRNAME]`](#necro-bootstrap-project_type-variant-dirname)

## `necro bootstrap [PROJECT_TYPE] [VARIANT] [DIRNAME]`

Use a boilerplate and setup a new project

```
USAGE
  $ necro bootstrap [PROJECT_TYPE] [VARIANT] [DIRNAME] [-y]

ARGUMENTS
  PROJECT_TYPE  The type of the project. For example: react
  VARIANT       The variant of the boilerplate
  DIRNAME       The name of the project directory

FLAGS
  -y, --yes  Skip input confirmation

DESCRIPTION
  Use a boilerplate and setup a new project
```

_See code: [dist/commands/bootstrap/index.ts](https://github.com/necrobits/necro-cli/blob/v0.0.0/dist/commands/bootstrap/index.ts)_
<!-- commandsstop -->
