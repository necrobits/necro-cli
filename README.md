The Necro CLI
=================

The command line tool for faster developing experience

# Table of Contents
<!-- toc -->
* [Table of Contents](#table-of-contents)
* [Installation](#installation)
* [Commands](#commands)
<!-- tocstop -->
# Installation
<!-- usage -->
```sh-session
$ npm install -g necro-cli
$ necro COMMAND
running command...
$ necro (--version)
necro-cli/0.0.2 darwin-x64 node-v12.22.6
$ necro --help [COMMAND]
USAGE
  $ necro COMMAND
...
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

_See code: [dist/commands/bootstrap/index.ts](https://github.com/necrobits/necro-cli/blob/v0.0.2/dist/commands/bootstrap/index.ts)_
<!-- commandsstop -->
