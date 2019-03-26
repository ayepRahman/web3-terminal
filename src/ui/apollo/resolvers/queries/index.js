// NOTE: best practice for resolver is to pass a gql tag with all the params

import gql from 'graphql-tag';

const GET_ALL_USERS_STATE = gql`
  query GetAllUsers {
    store @client {
      __typename
      users {
        __typename
        id
        ethBalance
        exchangeBalances {
          id
          userAddress
          exchangeAddress
          ethDeposited
          tokensDeposited
          uniTokensMinted
          uniTokensBurned
          ethWithdrawn
          tokensWithdrawn
          ethBought
          tokensBought
          totalEthFeesPaid
          totalTokenFeesPaid
          __typename
        }
        txs {
          id
          event
          block
          timeStamp
          exchangeAddress
          tokenSymbol
          userAddress
          ethAmount
          tokenAmount
          fee
          __typename
        }
      }
    }
  }
`;

export default {
  getUserById: (root, { id }, { cache }) => {
    try {
      const { store } = cache.readQuery({
        query: GET_ALL_USERS_STATE,
      });

      const users = store && store.users;
      const findUser = users.find(user => user.id === id);

      return {
        user: findUser,
      };
    } catch (error) {
      console.log(error.message);
      return {
        error: error.message,
      };
    }
  },
  getAllUsers: (root, args, context) => {
    const { cache } = context;
    console.log('getUserById - resolver', cache);

    debugger;

    try {
      const { store } = cache.readQuery({
        query: GET_ALL_USERS_STATE,
      });
      const users = store && store.users;

      console.log(users);

      return {
        users,
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  },
};
