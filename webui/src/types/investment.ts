export type AccountType =
  | 'Cash'
  | 'RRSP'
  | 'TFSA'
  | 'NonRegistered'
  | 'Chequing'
  | 'Saving'
  | 'RESP';

export type OwnerType = 'Personal' | 'Corporate';

export type ActivityType =
  | 'Deposit'
  | 'Withdraw'
  | 'Expense'
  | 'Buy'
  | 'Sell'
  | 'Dividend'
  | 'Fee'
  | 'FxTransfer';

export type Account = {
  id: string;
  name: string;
  accountType: AccountType;
  ownerType: OwnerType;
  accountNumber: string;
  brokerOrInstitution: string;
};

export type CreateAccountInput = {
  name: string;
  accountType: AccountType;
  ownerType: OwnerType;
  accountNumber: string;
  brokerOrInstitution: string;
};

export type Activity = {
  id: string;
  accountId: string;
  type: ActivityType;
  tradeDate: string;
  currency: string;
  amount: number;
  quantity?: number | null;
  price?: number | null;
  fee?: number | null;
  fxRateToCad: number;
  instrumentSymbol?: string | null;
  notes?: string | null;
};

export type CreateActivityInput = Omit<Activity, 'id'>;

export type PortfolioSummary = {
  totalInvestedCad: number;
  totalValueCad: number;
  realizedPnlCad: number;
  unrealizedPnlCad: number;
  totalProfitLossCad: number;
};

export type PortfolioPerformance = {
  closedTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  realizedPnlCad: number;
  unrealizedPnlCad: number;
  totalProfitLossCad: number;
};

