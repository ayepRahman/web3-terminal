import gql from 'graphql-tag';

export const GET_SINGLE_USER_BY_ID_STATE = gql`
  query getUserById($id: ID!) {
    getUserById(id: $id) @client
  }
`;

const GET_ALL_USERS_STATE = gql`
  query getAllUsers {
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
    }
  },
  getAllUsers: (root, args, context) => {
    const { cache } = context;
    console.log('getUserById - resolver', cache);

    // const data = {
    //   loginModal: {
    //     isOpen: !isOpen,
    //     __typename: 'loginModal',
    //   },
    // };

    // cache.writeData({ data });
    return null;
  },
};
