#!/usr/bin/env node
const shell = require('shelljs');
const colors = require('colors');
const fs = require('fs');

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
      return cdIntoNewDir();
    })
    .then(() => {
      return installPackages();
    })
    .then(() => {
      return updateTemplates();
    })
    .then(() => {
      console.log("\nAll jobs done!".green);
    })
    .catch(error => {
      if (!error) {
        return console.log('\nSomething went wrong while trying to create a new app using original create-react-app'.red);
      } 
      console.error('\nError:', error);
    });
};

const createReactApp = (name) => {
    return Promise.resolve(name)
      .then(name => {
        if (name) {
          return Promise.resolve(shell.exec(`npx create-react-app ${name}`).code)
            .then(code => {
              if (code) {
                throw new Error(`Exited with non-zero code: ${code}`);
              } else 
                return `Created react app: ${name}`;
            });
        } else {
          console.log("\nNo app name was provided.".red);
          console.log("\nUsage: ".grey);
          console.log("\create-react-app ", "app-name\n".cyan);
          return Promise.reject();
        }
    });
};

const cdIntoNewDir = () => {
    return Promise.resolve(shell.cd(appDirectory))
      .then(() => {
        console.log(`cd into new directory: ${appDirectory}`);
      });
};

const installPackages = () => {
  return Promise.resolve()
    .then(() => {
      console.log("\nInstalling redux, react-router, react-router-dom, react-redux, and redux-thunk\n".cyan);
      return shell.exec(`yarn add redux react-router react-redux redux-thunk react-router-dom`).code;
    })
    .then(code => {
      if (!code) {
        console.log("\nFinished installing packages".green);
      } else {
        throw new Error(`Package installation failed with code ${code}`);
      }
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
