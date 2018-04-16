# @roox/create-react-project

## No global installation required

This is utility package, and you may need it only once to perform a specific task and then throw it away.
Luckily, since `npx` came on stage, you no longer need to install it globally. 

Under the hood, it relies on the awesomeness of [create-react-app](https://github.com/facebookincubator/create-react-app)
to create your app. We just augment it by adding a few extra dependencies to boostrap your project.

## Creating a new app

To create a new app, run
```
npx @roox/create-react-project <my-app-name>
```

## What this package is:

#### A thin wrapper around `create-react-app`
This project is a thin wrapper around Facebook's [create-react-app](https://github.com/facebookincubator/create-react-app) but adds the following common libraries needed for most medium to large-sized web apps:

- [redux](http://redux.js.org/)
- [react-redux](https://github.com/reactjs/react-redux)
- [react-router](https://github.com/ReactTraining/react-router)
- [react-router-dom](https://www.npmjs.com/package/react-router-dom)
- [redux-thunk](https://github.com/gaearon/redux-thunk)

## What this package is not:

#### A replacement for `create-react-app`
This project is not a replacement for `create-react-app`, but rather a thin wrapper around it. Apps created using this project are not ejected out of `create-react-app` and can still be upgraded to newer versions of `react-scripts` as needed. This project also includes all the same scripts included with `create-react-app` for running a development server and building production versions.

## What you get?

`@roox/create-react-app` not only installs the latest versions of the above-described packages, but also overwrites some of the default template files included with `create-react-app`, specifically:

- `App.js` - imports a `connect()` function from `react-redux` and connects `<App />` to the Redux store.
- `index.js` - This file wraps the `<App/>` component included with `create-react-app` in the `<Provider/>` component imported from `react-redux`, and the `<BrowserRouter/>` component imported from `react-router-dom`.
- `store.js` - This file imports `createStore()` from `redux` and exports a Redux store with a basic reducer.

## What if I fork this repo and modify it to satisfy my project requirements?

You are free to do so. For example, you may want to replace `redux-thunk` with a more powerfull `redux-saga`, then event add `reselect` to the list of dependencies.

### Inspiration

The project was largely inspired by the [this](https://github.com/chrisjpatty/create-react-redux-router-app) awesome repo
by Chris Patty.
