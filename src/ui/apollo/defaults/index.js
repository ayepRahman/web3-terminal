// Apollo Defaults - https://www.apollographql.com/docs/link/links/state.html#defaults

const UserExchangeBalance = {
  id: '',
  userAddress: '',
  exchangeAddress: '',
  ethDeposited: 0,
  tokensDeposited: 0,
  uniTokensMinted: 0,
  uniTokensBurned: 0,
  ethWithdrawn: 0,
  tokensWithdrawn: 0,
  ethBought: 0,
  tokensBought: 0,
  totalEthFeesPaid: 0,
  totalTokenFeesPaid: 0,
  __typename: 'UserExchangeBalance',
};

const Transaction = {
  id: '',
  event: '',
  block: '',
  timeStamp: '',
  exchangeAddress: '',
  tokenSymbol: '',
  userAddress: '',
  ethAmount: 0,
  tokenAmount: 0,
  fee: 0,
  __typename: 'Transaction',
};

const User = {
  id: '',
  ethBalance: 0,
  exchangeBalances: [UserExchangeBalance],
  txs: [Transaction],
  __typename: 'User',
};

export const defaults = {
  store: {
    users: [User],
    __typename: 'Store',
  },
};
