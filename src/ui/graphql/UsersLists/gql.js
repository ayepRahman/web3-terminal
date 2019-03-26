import gql from 'graphql-tag';

export const GET_USERS = gql`
  query GetUsers($first: Int, $skip: Int) {
    users(first: $first, skip: $skip) {
      id
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
`;

// local
export const GET_ALL_USERS_STATE = gql`
  {
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

export const UPDATE_USERS_STATE = gql`
  mutation UpdateUsers($users: [User]) {
    updateUsers(users: $users) @client
  }
`;
