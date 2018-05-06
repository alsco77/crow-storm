export enum Web3LoadingStatus {
    inProgress = "Wallet loading is in progress",
    noMetaMask = "MetaMask is not connected. Install or enable MetaMask in order to claim Crow Coins",
    noAccountsAvailable = "MetaMask is not unlocked or there are no accounts available.\n Load MetaMask and type \'refresh\' to try again",
    wrongNetwork = "Your MetaMask is connected to the wrong Network.\n Change to the Ropsten network in order to claim Crow Coins",
    error = "Something went wrong when loading your wallet",
    // newAccount = "New MetaMask account loaded",
    complete = "Complete"
  }