// NOTE: best practice for resolver is to pass a gql tag with all the params

import gql from 'graphql-tag';

const GET_ALL_USERS_STATE = gql`
  query GetAllUsers {
    store @client {
      users {
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

    try {
      const { store } = cache.readQuery({
        query: GET_ALL_USERS_STATE,
      });
      const users = store && store.users;

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
