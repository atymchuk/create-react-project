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

const run = async () => {
  const success = await createReactApp(appName);
  if (!success){
    console.log('Something went wrong while trying to create a new React app using create-react-app'.red);
    return false;
  }
  await cdIntoNewDir();
  console.log('step 1 done');
  await installPackages();
  console.log('step 2 done');
  await updateTemplates();
  console.log("All 3 steps done");
};

const createReactApp = (name) => {
  return new Promise(resolve => {
    if (name) {
      shell.exec(`npx create-react-app ${name}`, (code) => {
        console.log("Exited with code ", code);
        console.log("Created react app");
        resolve(true);
      })
    } else {
      console.log("\nNo app name was provided.".red);
      console.log("\nProvide an app name in the following format: ");
      console.log("\ncreate-react-app ", "app-name\n".cyan);
      resolve(false);
    }
  });
};

const cdIntoNewDir = () => {
  return new Promise(resolve => {
    shell.cd(appDirectory);
    console.log(`cd into new directory: ${appDirectory}`);
    resolve();
  });
};

const installPackages = () => {
  return new Promise(resolve => {
    console.log("\nInstalling redux, react-router, react-router-dom, react-redux, and redux-thunk\n".cyan)
    shell.exec(`npm install -D redux react-router react-redux redux-thunk react-router-dom`, () => {
      console.log("\nFinished installing packages\n".green)
      resolve()
    })
  })
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
