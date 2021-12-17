import { Command, Flags } from '@oclif/core'
import _ from 'lodash';
import { prompt } from 'inquirer'
import * as path from 'path';
import * as fs from 'fs'
import axios from 'axios';
import { execSync } from 'child_process';

type BootstrapArgs = {
  project_type?: string;
  variant?: string;
  dirname?: string;
}
type BootstrapProject = {
  description?: string;
  variants: { [variantName: string]: BootstrapVariant };
  repo: string;
}

type BootstrapVariant = {
  description?: string;
  repo?: string;
  branch: string;
}
type BootstrapList = {
  [typeName: string]: BootstrapProject
}

const builtinBootstrapList = {
  "react": {
    "description": "A Frontend project using React",
    "repo": "https://github.com/necrobits/react-boilerplate",
    "variants": {
      "axios-router-v6": {
        "description": "with Axios and Router v6",
        "branch": "axios-router-v6"
      },
      "axios-router-v5": {
        "description": "with Axios and Router v5",
        "branch": "axios-router-v5"
      }
    }
  }
};

export default class BootstrapCommand extends Command {
  userArgs: BootstrapArgs = {};
  bootstrapList: BootstrapList = builtinBootstrapList;
  static description = 'Use a boilerplate and setup a new project'

  static examples = [
    //`$ necro bootstrap react`,
  ]

  static flags = {
    yes: Flags.boolean({ char: 'y', description: 'Skip input confirmation', required: false, default: false }),
  }

  static args = [
    { name: 'project_type', description: 'The type of the project. For example: react', required: false },
    { name: 'variant', description: 'The variant of the boilerplate', required: false },
    { name: 'dirname', description: 'The name of the project directory', required: false },
  ]

  async ensureUserInput() {
    const promptCfg = [{
      type: 'list',
      name: 'project_type',
      message: "Which type of project are you building? Choose one",
      choices: Object.keys(this.bootstrapList),
      when: () => !this.userArgs.project_type
    },
    {
      type: 'list',
      name: 'variant',
      message: "Choose a variant",
      choices: (answer: any) => Object.keys(this.bootstrapList[answer.project_type || this.userArgs.project_type].variants),
      when: () => !this.userArgs.variant,
    },
    {
      type: 'input',
      name: 'dirname',
      message: `The name of the project folder: `,
      when: () => !this.userArgs.dirname
    }];

    const promptedInput = await prompt(promptCfg);
    this.userArgs = _.merge(this.userArgs, promptedInput);
  }

  confirmInput(): Promise<boolean> {
    return prompt([{
      type: 'confirm',
      name: 'confirmed',
      default: false,
      message: 'Do you want to continue?'
    }]).then(answer => answer.confirmed)
  }

  async fetchBootstrapList(): Promise<void> {
    this.bootstrapList = await axios.get("https://raw.githubusercontent.com/necrobits/necro-cli-config/main/bootstrap/projects.json")
      .then(resp => resp.data);
  }

  validateUserInput(): boolean {
    const projectType = this.userArgs.project_type!;
    const variant = this.userArgs.variant!;

    const typeOk = _.has(this.bootstrapList, this.userArgs.project_type!)
    if (!typeOk) {
      console.log(`Project type '${projectType}' is not supported`);
      return false;
    }
    const variantOk = _.has(this.bootstrapList[projectType].variants, this.userArgs.variant!)
    if (!variantOk) {
      console.log(`Variant '${variant}' does not exist`);
      return false;
    }
    return true;
  }

  getBoilerplate() {
    const project = this.bootstrapList[this.userArgs.project_type!];
    const variant = this.bootstrapList[this.userArgs.project_type!].variants[this.userArgs.variant!];
    const dirname = this.userArgs.dirname!;
    const repoInfo = _.merge(project, variant);

    console.log('Getting the boilerplate...')
    execSync(`git clone -b ${repoInfo.branch} ${repoInfo.repo} ${path.resolve(dirname)}`);
    console.log('Finishing up...');
    fs.rmdirSync(`${path.resolve(dirname, '.git')}`, { recursive: true })
    console.log('Done. The project is now ready.');
  }

  async run(): Promise<void> {
    const { args, flags } = await this.parse(BootstrapCommand)
    this.userArgs = args;

    console.log(`Getting information about the repositories...`);
    await this.fetchBootstrapList();
    await this.ensureUserInput();
    if (!this.validateUserInput()) {
      return;
    }
    console.log('You are about to setup a project with the following config')
    console.log(`===============================================`);
    console.log(`Project type: ${this.userArgs.project_type}`);
    console.log(`Variant: ${this.userArgs.variant}`);
    console.log(`Location: ${this.userArgs.dirname}`);
    console.log(`===============================================`);
    // Prompt user confirmation if no --yes flag is provided
    if (!flags.yes) {
      const confirmed = await this.confirmInput();
      if (!confirmed) return;
    }

    this.getBoilerplate();
  }
}
