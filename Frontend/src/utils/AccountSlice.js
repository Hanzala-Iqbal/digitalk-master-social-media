export const AccountSlice=(currentAccount)=>`${currentAccount.substr(0,5)}...${currentAccount.substr(currentAccount.toString().length-4)}`;
