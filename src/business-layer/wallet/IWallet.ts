export interface IWallet {
  password: string;
  label: string;
}

export interface IWalletSchema {
  password: string;
  label: string;
  walletId?: string;
  address: string;
  userId: string;
}

export interface IWalletSchemaUpdate {
  password?: string;
  label?: string;
}

export interface ISendMoney {
  senderWalletId: string;
  receiverWalletId: string;
  amount: number;
}
