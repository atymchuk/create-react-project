#!/usr/bin/env node
const Promise = require('bluebird');
const shell = require('shelljs');
const colors = require('colors');
const fs = require('fs');

const exec = Promise.promisify(shell.exec);
const cd = Promise.promisify(shell.cd);

const templates = [
    'App.js',
    'index.js',
    'store.js'
  ]
  .reduce((acc, fileName) => ({
    ...acc,
    [fileName]: require(`./templates/${fileName}`)
  }), {});

const appName = process.argv[2];
const appDirectory = `${process.cwd()}/${appName}`;

const run = () => {
  createReactApp(appName)
    .then(message => {
      console.log(`\n${message}`.green);
    })
    .catch((error) => {
      console.log('\nSomething went wrong while trying to create a new React app using create-react-app'.red);
      console.error("\nError:", error);
    })
    .then(() => {
      return cdIntoNewDir();
    })
    .then(() => {
      return installPackages();
    })
    .then(() => {
      return updateTemplates();
    })
    .then(() => {
      console.log("All jobs done!".green);
    });
};

const createReactApp = (name) => {
    return Promise.resolve(name)
      .then(name => {
        if (name) {
          return exec(`npx create-react-app ${name}`)
            .then(code => {
              if (code) {
                throw new Error(`Exited with non-zero code: ${code}`);
              } else 
                return `Created react app: ${name}`;
            });
        } else {
          console.log("\nNo app name was provided.".red);
          console.log("\nProvide an app name in the following format: ".grey);
          console.log("\ncreate-react-app ", "app-name\n".cyan);
          throw new Error('No app name provided');
        }
    });
};

const cdIntoNewDir = () => {
    return cd(appDirectory)
      .then((code) => {
        console.log(`cd return code: ${code}`);
        console.log(`cd into new directory: ${appDirectory}`);
      });
};

const installPackages = () => {
  return Promise.resolve()
    .then(() => {
      console.log("\nInstalling redux, react-router, react-router-dom, react-redux, and redux-thunk\n".cyan);
      exec(`yarn install -D redux react-router react-redux redux-thunk react-router-dom`)
        .then(() => {
          console.log("\nFinished installing packages\n".green);
        });
    });
};

const updateTemplates = () => {
  return new Promise(resolve => {
    const promises = Object.keys(templates).reduce((acc, fileName, i) => {
      const promise = new Promise(res => {
        fs.writeFile(`${appDirectory}/src/${fileName}`, templates[fileName], function(err) {
            if (err) {
              console.log(err);
            }
            res();
        });
      });
      return acc.concat(promise);
    }, []);

    Promise.all(promises).then(() => { 
      resolve();
      console.log("\nFinished updating templates".green);
    });
  });
};

run();
