import { Connectors } from 'web3-react';
const {
  // MetaMaskConnector,
  // WalletConnectConnector,
  NetworkOnlyConnector,
} = Connectors;

const INFURA_API_KEY = process.env.REACT_APP_INFURA_API_KEY || 'e99b01ab413f41e1975e2189dbe507ae';

// const metaMask = new MetaMaskConnector({ supportedNetworks: 1 });
// const metaMask = new MetaMaskConnector();

// const walletConnect = new WalletConnectConnector({
//   bridge: 'https://bridge.walletconnect.org',
//   supportedNetworkURLs: { 1: 'https://mainnet.infura.io/v3/...' },
//   defaultNetwork: 1,
// });

const infura = new NetworkOnlyConnector({
  providerURL: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
});

export const connectors = {
  // metaMask,
  //  walletConnect,
  infura,
};
