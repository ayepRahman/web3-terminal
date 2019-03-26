import axios from 'axios';
import { utils } from 'ethers';

const etherScanApiKeys =
  process.env.REACT_APP_ETHERSCAN_API_KEYS || 'C852K7V62PDKJ5AG3VRQCIRX55ZAWC8NWF';

// return user eth balance
export default async walletAddress => {
  try {
    const response = await axios(
      `https://api.etherscan.io/api?module=account&action=balance&address=${walletAddress}&tag=latest&apikey=${etherScanApiKeys}`,
    );
    const wei = response.data.result;
    const ethBalance = utils.formatEther(wei);

    return ethBalance;
  } catch (error) {
    console.log(error.message);
  }
};
