# web3-terminal

## Motive for this project

Bootstrap a simple project that uses the new React Hooks, Apollo Client. User are able to see list of users result from calling uriswap api. User are able to see the recent transactions made. User are able to make a fake transactions and able to see the updated tansaction in the table.

![](web3terminal.gif)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Quickstart

This project is running the latest `react` and `react-dom` `v16.8`
and using the latest React `Hooks`.

Apollo Client for state management, and interaction with GraphQL uriswap api

If you have not install `yarn` in you machine install yarn using `brew`
or for other methods https://yarnpkg.com/lang/en/docs/install/#mac-stable

### `brew install yarn`

Run yarn to install the dependencies.

### `yarn`

To start locally run:

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

## Checklist

- Create a FE for uniswap's user data, which displays a list of users using cursor-based pagination and infinite-scroll (rows are loaded while scrolling down the list).
- (Discuss here what to show in each row, but at least it should show User ID and ETH Balance)
- Clicking on a user row should show a list of his/her eth transactions (Bonus points if it shows token txs)
- Load data using graphql (Apollo) from https://thegraph.com/explorer/subgraph/graphprotocol/uniswap
- Display a "Transfer ETH button". When you click it, it shows `from ID` and `to ID` input. When you fill them (using any IDs of users loaded in the list) it will trigger a mutation. This mutation does not have to reach any remote endpoint, but has to modify Apollo's internal cache to represent the eth change in the UI, adding it to the `to ID` user and substracting it from the `from ID` user, and adding it as an item to the txs list of the affected users.
- First priority is performance, second is architecture/maintainability and last one is visual design.
