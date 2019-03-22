const UserExchangeBalance = {
  id: '',
  userAddress: '',
  exchangeAddress: '',
  ethDeposited: '',
  tokensDeposited: '',
  uniTokensMinted: '',
  uniTokensBurned: '',
  ethWithdrawn: '',
  tokensWithdrawn: '',
  ethBought: '',
  tokensBought: '',
  totalEthFeesPaid: '',
  totalTokenFeesPaid: '',
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
  ethAmount: '',
  tokenAmount: '',
  fee: '',
  __typename: 'Transaction',
};

const user = {
  id: '',
  exchangeBalances: [UserExchangeBalance],
  txs: [Transaction],
  __typename: 'User',
};

export const defaults = {
  store: {
    users: [user],
  },
};
