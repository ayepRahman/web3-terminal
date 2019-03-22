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
};

const user = {
  id: '',
  exchangeBalances: [UserExchangeBalance],
  txs: [Transaction],
};

export const defaults = {
  users: [user],
};
