export enum Web3LoadingStatus {
    inProgress = "In progress",
    noMetaMask = "MetaMask is not connected",
    noAccountsAvailable = "MetaMask is not unlocked or there are no accounts available",
    wrongNetwork = "Wrong network - should be on Ropsten",
    error = "Something went wrong",
    // newAccount = "New MetaMask account loaded",
    complete = "Complete"
  }