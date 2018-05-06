export enum Web3LoadingStatus {
    inProgress = "Wallet loading is in progress",
    noMetaMask = "MetaMask is not connected. Console needs MetaMask in order to give you Crow Coins",
    noAccountsAvailable = "MetaMask is not unlocked or there are no accounts available.\n Load MetaMask and type \'checkconnection\' to try again",
    wrongNetwork = "Your MetaMask is connected to the wrong Network.\n Console needs access to the Ropsten network in order to give you Crow Coins",
    error = "Something went wrong when connecting to your MetMask wallet",
    // newAccount = "New MetaMask account loaded",
    complete = "Console has successfully connected to your MetaMask wallet"
  }