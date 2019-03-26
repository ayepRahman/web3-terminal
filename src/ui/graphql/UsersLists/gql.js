import gql from 'graphql-tag';

export const GET_USERS = gql`
  query getUsers($first: Int, $skip: Int) {
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

export const GET_ALL_USERS_STATE = gql`
  query getAllUsers {
    users @client
  }
`;

export const UPDATE_USERS_STATE = gql`
  mutation updateUsers($users: [User]) {
    updateUsers(users: $users) @client
  }
`;
