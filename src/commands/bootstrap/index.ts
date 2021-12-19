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
  dir?: string;
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

export default class BootstrapCommand extends Command {
  userArgs: BootstrapArgs = {};
  bootstrapList: BootstrapList = {};
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
    { name: 'dir', description: 'The path to the project directory', required: false },
  ]

  async ensureUserInput() {
    const promptCfg = [{
      type: 'list',
      name: 'project_type',
      message: "Which type of project are you building? Choose one:",
      choices: Object.keys(this.bootstrapList),
      when: () => !this.userArgs.project_type
    },
    {
      type: 'list',
      name: 'variant',
      message: "Choose a variant: ",
      choices: (answer: any) => {
        const variants = this.bootstrapList[answer.project_type || this.userArgs.project_type].variants
        const values = Object.keys(variants);
        const choices = [];
        for (let v of values) {
          let name = v;
          if (!!variants[v].description) {
            name = `${name} (${variants[v].description})`;
          }
          choices.push({
            name: name,
            short: v,
            value: v
          })
        }
        return choices;
      },
      when: () => !this.userArgs.variant,
    },
    {
      type: 'input',
      name: 'dir',
      message: `The name of the project folder:`,
      when: () => !this.userArgs.dir
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

  validateArgs(): boolean {
    return this.validateUserInput(true);
  }

  validateUserInput(acceptMissing = false): boolean {
    const projectType = this.userArgs.project_type!;
    const variant = this.userArgs.variant!;

    if (!this.userArgs.project_type && !acceptMissing) {
      console.log(`You must provide a project type.`);
      return false;
    }

    const typeMissingOk = acceptMissing && !this.userArgs.project_type;
    const typeOk = _.has(this.bootstrapList, this.userArgs.project_type!)
    if (!typeOk && !typeMissingOk) {
      console.log(`Project type '${projectType}' is not supported`);
      return false;
    }
    if (typeMissingOk){
      return true;
    }

    if (!this.userArgs.variant && !acceptMissing) {
      console.log(`You must provide a variant.`);
      return false;
    }

    const variantMissingOk = acceptMissing && !this.userArgs.variant;
    const variantOk = _.has(this.bootstrapList[projectType].variants, this.userArgs.variant!)
    if (!variantOk && !variantMissingOk) {
      console.log(`Variant '${variant}' does not exist in the project type '${projectType}'`);
      return false;
    }

    return true;
  }

  getBoilerplate() {
    const project = this.bootstrapList[this.userArgs.project_type!];
    const variant = this.bootstrapList[this.userArgs.project_type!].variants[this.userArgs.variant!];
    const dir = this.userArgs.dir!;
    const repoInfo = _.merge(project, variant);

    console.log('Getting the boilerplate...')
    execSync(`git clone -b ${repoInfo.branch} ${repoInfo.repo} ${path.resolve(dir)}`);
    console.log('Finishing up...');
    fs.rmdirSync(`${path.resolve(dir, '.git')}`, { recursive: true })
    console.log('Done. The project is now ready.');
  }

  async run(): Promise<void> {
    const { args, flags } = await this.parse(BootstrapCommand)
    this.userArgs = args;

    console.log(`Getting information about the repositories...`);
    await this.fetchBootstrapList();
    if (!this.validateArgs()) {
      return;
    }
    await this.ensureUserInput();
    if (!this.validateUserInput()) {
      return;
    }
    console.log('You are about to setup a project with the following config')
    console.log(`===============================================`);
    console.log(`Project type: ${this.userArgs.project_type}`);
    console.log(`Variant: ${this.userArgs.variant}`);
    console.log(`Location: ${this.userArgs.dir}`);
    console.log(`===============================================`);
    // Prompt user confirmation if no --yes flag is provided
    if (!flags.yes) {
      const confirmed = await this.confirmInput();
      if (!confirmed) return;
    }

    this.getBoilerplate();
  }
}
