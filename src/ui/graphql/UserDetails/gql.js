import gql from 'graphql-tag';

export const GET_SINGLE_USER_BY_ID_STATE = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) @client {
      user {
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
