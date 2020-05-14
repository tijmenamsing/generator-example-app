const Generator = require('yeoman-generator');
const rename = require('gulp-rename');
const chalkPipe = require('chalk-pipe');
const info = chalkPipe('cyan');

module.exports = class extends Generator {
  async prompting() {
    this.log(info('\nHi! Please answer some questions to setup your example app:'));

    this.answers = await this.prompt([
      {
        type: 'input',
        name: 'appname',
        message: 'What is the name of your app?',
        validate: (input) => (/[\w-]+/.test(input) ? true : 'Enter a valid name for your app'),
      },
      {
        type: 'list',
        name: 'type',
        message: 'What type of app is it?',
        choices: ['angular', 'react', 'vuejs'],
        default: 1,
      },
      {
        type: 'input',
        name: 'why',
        message: 'Why not Angular?',
        when: (answers) => answers.type !== 'angular',
      },
    ]);
  }

  configuring() {
    this.settings = this.answers;

    // You can add or change settings here
    this.settings.version = '1.0.0';

    this.log(info('\nThe following configuration will be used:'));
    this.log(`destinationPath: ${info(this.destinationRoot())}`);

    for (let s in this.settings) {
      this.log(`${s}: ${info(this.settings[s])}`);
    }
  }

  writing() {
    this.log(info('\nWriting files:'));

    // Replace the placeholders (surrounded by $$) in directory- and filenames
    this.registerTransformStream(
      rename((path) => {
        for (let s in this.settings) {
          let regexp = new RegExp('\\$\\$' + s + '\\$\\$', 'g');
          path.basename = path.basename.replace(regexp, this.settings[s]);
          path.dirname = path.dirname.replace(regexp, this.settings[s]);
        }
        // This is a fix for writing files starting with a "."
        path.basename = path.basename.replace('_gitignore', '.gitignore');
      })
    );

    // Copy the files to the destination path and replace the placeholders within templates
    this.fs.copyTpl(this.templatePath(), this.destinationPath(), this.settings, null, { globOptions: { dot: true } });
  }

  end() {
    this.log(info('\nFinished!'));
  }
};
