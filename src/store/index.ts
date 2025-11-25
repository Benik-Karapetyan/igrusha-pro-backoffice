import {
  AssetFormValues,
  AssetTransferFormValues,
  BanCloseCustomerFormValues,
  BrandFormValues,
  CoinFormValues,
  CustomerRiskLevelFormValues,
  CustomerVipLevelFormValues,
  CustomFeeFormValues,
  emptyAsset,
  emptyAssetTransfer,
  emptyBanCloseCustomer,
  emptyBrand,
  emptyCoin,
  emptyCustomerRiskLevel,
  emptyCustomerVipLevel,
  emptyCustomFee,
  emptyKycLimit,
  emptyLevel,
  emptyLevelFee,
  emptyLevelingSystem,
  emptyMarketCategory,
  emptyMarketDataFeed,
  emptyNetwork,
  emptyNode,
  emptyOrgLevel,
  emptyPermissionSection,
  emptyProduct,
  emptyRegion,
  emptyScanner,
  emptySmsProvider,
  emptySpotTradingPair,
  emptySpotTradingPairStatus,
  emptySuspendCustomer,
  emptyTradingFee,
  emptyVault,
  emptyVerificationTriggers,
  emptyWithdrawalDepositSetting,
  emptyWithdrawalThresholds,
  emptyWithdrawAsset,
  emptyWithdrawNode,
  emptyWithdrawVault,
  KycLimitFormValues,
  LevelFeeFormValues,
  LevelFormValues,
  LevelingSystemFormValues,
  MarketCategoryFormValues,
  MarketDataFeedFormValues,
  NetworkFormValues,
  NodeFormValues,
  OrgLevelFormValues,
  PermissionSectionFormValues,
  ProductFormValues,
  RegionFormValues,
  ScannerFormValues,
  SmsProviderFormValues,
  SpotTradingPairFormValues,
  SpotTradingPairStatusFormValues,
  SpotTradingPairStatusValues,
  SuspendCustomerFormValues,
  TradingContestFormValues,
  TradingFeeFormValues,
  TradingModeValues,
  VaultFormValues,
  VerificationTriggersFormValues,
  WithdrawalDepositSettingFormValues,
  WithdrawalThresholdsFormValues,
  WithdrawAssetFormValues,
  WithdrawNodeFormValues,
  WithdrawVaultFormValues,
} from "@forms";
import {
  ICustomerComplianceOverview,
  ICustomerMainInfo,
  ITradingContestCustomer,
  TOnChainTransaction,
  TOnOffRampTransaction,
} from "@types";
import { create } from "zustand";

export type DialogTypes =
  | "unsavedChanges"
  | "confirm"
  | "filters"
  | "warning"
  | "status"
  | "spotTradingPairStatus"
  | "spotTradingPairMatching"
  | "delete"
  | "resetPassword"
  | "product"
  | "region"
  | "network"
  | "node"
  | "withdrawNode"
  | "coin"
  | "asset"
  | "withdrawAsset"
  | "withdrawalDepositSetting"
  | "vault"
  | "withdrawVault"
  | "vaultAssets"
  | "scanner"
  | "tradingFee"
  | "level"
  | "kycLimit"
  | "spotTradingPair"
  | "marketCategory"
  | "marketDataFeed"
  | "smsProvider"
  | "permissionSection"
  | "orgLevel"
  | "brand"
  | "adminUserRoles"
  | "banCustomer"
  | "closeCustomer"
  | "blockReferralLink"
  | "apiKeyDetailsStatus"
  | "confirmTransfer";

export type DialogMode = "" | "create" | "update";

interface IPermissionDetails {
  id: number;
  name: string;
  key: string;
  description: string;
  status: number;
}

interface IPermission {
  description: string;
  permissions: IPermissionDetails[];
}

export interface IPermissionSection {
  id: number;
  parentId: number;
  Name: string;
  readPermissions: IPermission | null;
  createPermissions: IPermission | null;
  editPermissions: IPermission | null;
  deletePermissions: IPermission | null;
  exportPermissions: IPermission | null;
  permissionTypeIds?: number[];
  subPermissionSections?: IPermissionSection[];
}

export interface IRole {
  id: number;
  name: string;
  description: string;
  status: number;
  permissionSections: IPermissionSection[];
}

interface IUser {
  id: number;
  identityId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  userRoles: IRole[];
}

export interface IAuth {
  isLoading: boolean;
  check: boolean;
  user: IUser | null;
  avatar?: string;
}

export interface IResetPasswordData {
  email: string;
  username: string;
  phone: string;
}

export interface INode {
  name: string;
  rpc: string;
  username: string;
  stack: string;
  status: number;
}

interface IAsset {
  name: string;
  key: string;
  type: string;
  status: number;
}

export interface IVaultAsset {
  asset: IAsset;
  nodes: INode[];
}

export interface IAdminUserRole {
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: number;
}

export interface ISelectedSpotTradingPair {
  id: number;
  status: SpotTradingPairStatusValues;
  tradingMode: TradingModeValues;
  tradingModeStartDate: string | null;
  tradingModeEndDate: string | null;
  isMatchingEnabled: boolean;
}

interface ICustomer {
  identityId?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  status?: number;
  registrationDate?: string;
  lastLoginDate?: string;
  lastLoginLocation?: string;
  regionId?: string;
  country?: string;
  kycLevel?: string;
  kycStatus?: string;
  applicantId?: string;
  applicantLink?: string;
  birthDay?: string;
  address?: string;
  rejectionReason?: string;
  messageForApplicant?: string;
  internalNote?: string;
  level?: { name: string; id: number };
  internalComment?: string;
  twoFactorEnabled?: boolean;
  location?: { countryName: string };
}

export interface ISelectedReferralLink {
  id: string;
  status: number;
}

export type TAppMode = "default" | "wallet";

interface IStoreState {
  appMode: TAppMode;
  setAppMode: (value: TAppMode) => void;
  auth: IAuth;
  setAuth: (value: IAuth) => void;
  authPermissions: IPermissionSection[];
  setAuthPermissions: (value: IPermissionSection[]) => void;
  isAppSidebarMini: boolean;
  setIsAppSidebarMini: (value: boolean) => void;
  drawerOpen: boolean;
  setDrawerOpen: (value: boolean) => void;
  dialogs: DialogTypes[];
  setDialogs: (dialogs: DialogTypes[]) => void;
  dialogMode: DialogMode;
  setDialogMode: (mode: DialogMode) => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
  selectedElementEnabled: boolean;
  setSelectedElementEnabled: (enabled: boolean) => void;
  selectedIds: number[];
  setSelectedIds: (ids: number[]) => void;
  product: ProductFormValues;
  setProduct: (value: ProductFormValues) => void;
  region: RegionFormValues;
  setRegion: (value: RegionFormValues) => void;
  network: NetworkFormValues;
  setNetwork: (value: NetworkFormValues) => void;
  node: NodeFormValues;
  setNode: (value: NodeFormValues) => void;
  withdrawNode: WithdrawNodeFormValues;
  setWithdrawNode: (value: WithdrawNodeFormValues) => void;
  coin: CoinFormValues;
  setCoin: (value: CoinFormValues) => void;
  asset: AssetFormValues;
  setAsset: (value: AssetFormValues) => void;
  withdrawAsset: WithdrawAssetFormValues;
  setWithdrawAsset: (value: WithdrawAssetFormValues) => void;
  withdrawalDepositSetting: WithdrawalDepositSettingFormValues;
  setWithdrawalDepositSetting: (value: WithdrawalDepositSettingFormValues) => void;
  vault: VaultFormValues;
  setVault: (value: VaultFormValues) => void;
  withdrawVault: WithdrawVaultFormValues;
  setWithdrawVault: (value: WithdrawVaultFormValues) => void;
  vaultAssets: IVaultAsset[];
  setVaultAssets: (value: IVaultAsset[]) => void;
  selectedVaultAssetNodes: INode[];
  setSelectedVaultAssetNodes: (value: INode[]) => void;
  scanner: ScannerFormValues;
  setScanner: (value: ScannerFormValues) => void;
  tradingFee: TradingFeeFormValues;
  setTradingFee: (value: TradingFeeFormValues) => void;
  level: LevelFormValues;
  setLevel: (value: LevelFormValues) => void;
  kycLimit: KycLimitFormValues;
  setKycLimit: (value: KycLimitFormValues) => void;
  spotTradingPair: SpotTradingPairFormValues;
  setSpotTradingPair: (value: SpotTradingPairFormValues) => void;
  spotTradingPairStatus: SpotTradingPairStatusFormValues;
  setSpotTradingPairStatus: (value: SpotTradingPairStatusFormValues) => void;
  allSpotTradingPairsSelected: boolean;
  setAllSpotTradingPairsSelected: (value: boolean) => void;
  selectedSpotTradingPair: ISelectedSpotTradingPair | null;
  setSelectedSpotTradingPair: (value: ISelectedSpotTradingPair) => void;
  selectedSpotTradingPairs: ISelectedSpotTradingPair[];
  setSelectedSpotTradingPairs: (value: ISelectedSpotTradingPair[]) => void;
  marketCategory: MarketCategoryFormValues;
  setMarketCategory: (value: MarketCategoryFormValues) => void;
  marketDataFeed: MarketDataFeedFormValues;
  setMarketDataFeed: (value: MarketDataFeedFormValues) => void;
  smsProvider: SmsProviderFormValues;
  setSmsProvider: (value: SmsProviderFormValues) => void;
  permissionSection: PermissionSectionFormValues;
  setPermissionSection: (value: PermissionSectionFormValues) => void;
  orgLevel: OrgLevelFormValues;
  setOrgLevel: (value: OrgLevelFormValues) => void;
  brand: BrandFormValues;
  setBrand: (value: BrandFormValues) => void;
  resetPasswordData: IResetPasswordData | null;
  setResetPasswordData: (value: IResetPasswordData | null) => void;
  selectedAdminUserRoles: IAdminUserRole[];
  setSelectedAdminUserRoles: (value: IAdminUserRole[]) => void;
  customer: ICustomer;
  setCustomer: (value: ICustomer) => void;
  customerMainInfo: ICustomerMainInfo | null;
  setCustomerMainInfo: (value: ICustomerMainInfo) => void;
  customerComplianceOverview: ICustomerComplianceOverview | null;
  setCustomerComplianceOverview: (value: ICustomerComplianceOverview) => void;
  banCloseCustomer: BanCloseCustomerFormValues;
  setBanCloseCustomer: (value: BanCloseCustomerFormValues) => void;
  suspendCustomer: SuspendCustomerFormValues;
  setSuspendCustomer: (value: SuspendCustomerFormValues) => void;
  customerVipLevel: CustomerVipLevelFormValues;
  setCustomerVipLevel: (value: CustomerVipLevelFormValues) => void;
  customerRiskLevel: CustomerRiskLevelFormValues;
  setCustomerRiskLevel: (value: CustomerRiskLevelFormValues) => void;
  levelingSystem: LevelingSystemFormValues;
  setLevelingSystem: (value: LevelingSystemFormValues) => void;
  verificationTriggers: VerificationTriggersFormValues;
  setVerificationTriggers: (value: VerificationTriggersFormValues) => void;
  withdrawalThresholds: WithdrawalThresholdsFormValues;
  setWithdrawalThresholds: (value: WithdrawalThresholdsFormValues) => void;
  assetTransfer: AssetTransferFormValues;
  setAssetTransfer: (value: AssetTransferFormValues) => void;
  levelFee: LevelFeeFormValues;
  setLevelFee: (value: LevelFeeFormValues) => void;
  customFee: CustomFeeFormValues;
  setCustomFee: (value: CustomFeeFormValues) => void;
  selectedReferralLink: ISelectedReferralLink | null;
  setSelectedReferralLink: (value: ISelectedReferralLink | null) => void;
  selectedOnChainTransaction: TOnChainTransaction | null;
  setSelectedOnChainTransaction: (value: TOnChainTransaction | null) => void;
  selectedOnOffRampTransaction: TOnOffRampTransaction | null;
  setSelectedOnOffRampTransaction: (value: TOnOffRampTransaction | null) => void;
  selectedTradingContest: TradingContestFormValues | null;
  setSelectedTradingContest: (value: TradingContestFormValues | null) => void;
  selectedDistributeRewardsId: number | null;
  setSelectedDistributeRewardsId: (value: number | null) => void;
  selectedExcludeCustomerId: string | null;
  setSelectedExcludeCustomerId: (value: string | null) => void;
  selectedTradingContestCustomer: ITradingContestCustomer | null;
  setSelectedTradingContestCustomer: (value: ITradingContestCustomer | null) => void;
  selectedAlertTransactionId: string | null;
  setSelectedAlertTransactionId: (value: string | null) => void;
}

export const useStore = create<IStoreState>((set) => ({
  appMode: "default",
  setAppMode: (appMode) => set({ appMode }),
  auth: {
    isLoading: false,
    check: false,
    user: null,
  },
  setAuth: (auth) => set({ auth }),
  authPermissions: [],
  setAuthPermissions: (authPermissions) => set({ authPermissions }),
  isAppSidebarMini: false,
  setIsAppSidebarMini: (isAppSidebarMini) => set({ isAppSidebarMini }),
  drawerOpen: false,
  setDrawerOpen: (drawerOpen) => set({ drawerOpen }),
  dialogs: [],
  setDialogs: (dialogs) => set({ dialogs }),
  dialogMode: "",
  setDialogMode: (dialogMode) => set({ dialogMode }),
  hasUnsavedChanges: false,
  setHasUnsavedChanges: (hasUnsavedChanges) => set({ hasUnsavedChanges }),
  selectedElementEnabled: false,
  setSelectedElementEnabled: (selectedElementEnabled) => set({ selectedElementEnabled }),
  selectedIds: [],
  setSelectedIds: (selectedIds) => set({ selectedIds }),
  product: emptyProduct,
  setProduct: (product) => set({ product }),
  region: emptyRegion,
  setRegion: (region) => set({ region }),
  network: emptyNetwork,
  setNetwork: (network) => set({ network }),
  node: emptyNode,
  setNode: (node) => set({ node }),
  withdrawNode: emptyWithdrawNode,
  setWithdrawNode: (withdrawNode) => set({ withdrawNode }),
  coin: emptyCoin,
  setCoin: (coin) => set({ coin }),
  asset: emptyAsset,
  setAsset: (asset) => set({ asset }),
  withdrawAsset: emptyWithdrawAsset,
  setWithdrawAsset: (withdrawAsset) => set({ withdrawAsset }),
  withdrawalDepositSetting: emptyWithdrawalDepositSetting,
  setWithdrawalDepositSetting: (withdrawalDepositSetting) => set({ withdrawalDepositSetting }),
  vault: emptyVault,
  setVault: (vault) => set({ vault }),
  withdrawVault: emptyWithdrawVault,
  setWithdrawVault: (withdrawVault) => set({ withdrawVault }),
  vaultAssets: [],
  setVaultAssets: (vaultAssets) => set({ vaultAssets }),
  selectedVaultAssetNodes: [],
  setSelectedVaultAssetNodes: (selectedVaultAssetNodes) => set({ selectedVaultAssetNodes }),
  scanner: emptyScanner,
  setScanner: (scanner) => set({ scanner }),
  tradingFee: emptyTradingFee,
  setTradingFee: (tradingFee) => set({ tradingFee }),
  level: emptyLevel,
  setLevel: (level) => set({ level }),
  kycLimit: emptyKycLimit,
  setKycLimit: (kycLimit) => set({ kycLimit }),
  spotTradingPair: emptySpotTradingPair,
  setSpotTradingPair: (spotTradingPair) => set({ spotTradingPair }),
  spotTradingPairStatus: emptySpotTradingPairStatus,
  setSpotTradingPairStatus: (spotTradingPairStatus) => set({ spotTradingPairStatus }),
  allSpotTradingPairsSelected: false,
  setAllSpotTradingPairsSelected: (allSpotTradingPairsSelected) => set({ allSpotTradingPairsSelected }),
  selectedSpotTradingPair: null,
  setSelectedSpotTradingPair: (selectedSpotTradingPair) => set({ selectedSpotTradingPair }),
  selectedSpotTradingPairs: [],
  setSelectedSpotTradingPairs: (selectedSpotTradingPairs) => set({ selectedSpotTradingPairs }),
  marketCategory: emptyMarketCategory,
  setMarketCategory: (marketCategory) => set({ marketCategory }),
  marketDataFeed: emptyMarketDataFeed,
  setMarketDataFeed: (marketDataFeed) => set({ marketDataFeed }),
  smsProvider: emptySmsProvider,
  setSmsProvider: (smsProvider) => set({ smsProvider }),
  permissionSection: emptyPermissionSection,
  setPermissionSection: (permissionSection) => set({ permissionSection }),
  orgLevel: emptyOrgLevel,
  setOrgLevel: (orgLevel) => set({ orgLevel }),
  brand: emptyBrand,
  setBrand: (brand) => set({ brand }),
  resetPasswordData: null,
  setResetPasswordData: (resetPasswordData) => set({ resetPasswordData }),
  selectedAdminUserRoles: [],
  setSelectedAdminUserRoles: (selectedAdminUserRoles) => set({ selectedAdminUserRoles }),
  customer: {},
  setCustomer: (customer) => set({ customer }),
  customerMainInfo: null,
  setCustomerMainInfo: (customerMainInfo: ICustomerMainInfo) => set({ customerMainInfo }),
  customerComplianceOverview: null,
  setCustomerComplianceOverview: (customerComplianceOverview) => set({ customerComplianceOverview }),
  banCloseCustomer: emptyBanCloseCustomer,
  setBanCloseCustomer: (banCloseCustomer) => set({ banCloseCustomer }),
  suspendCustomer: emptySuspendCustomer,
  setSuspendCustomer: (suspendCustomer) => set({ suspendCustomer }),
  customerVipLevel: emptyCustomerVipLevel,
  setCustomerVipLevel: (customerVipLevel) => set({ customerVipLevel }),
  customerRiskLevel: emptyCustomerRiskLevel,
  setCustomerRiskLevel: (customerRiskLevel) => set({ customerRiskLevel }),
  levelingSystem: emptyLevelingSystem,
  setLevelingSystem: (levelingSystem) => set({ levelingSystem }),
  verificationTriggers: emptyVerificationTriggers,
  setVerificationTriggers: (verificationTriggers) => set({ verificationTriggers }),
  withdrawalThresholds: emptyWithdrawalThresholds,
  setWithdrawalThresholds: (withdrawalThresholds) => set({ withdrawalThresholds }),
  assetTransfer: emptyAssetTransfer,
  setAssetTransfer: (assetTransfer) => set({ assetTransfer }),
  levelFee: emptyLevelFee,
  setLevelFee: (levelFee) => set({ levelFee }),
  customFee: emptyCustomFee,
  setCustomFee: (customFee) => set({ customFee }),
  selectedReferralLink: null,
  setSelectedReferralLink: (selectedReferralLink) => set({ selectedReferralLink }),
  selectedOnChainTransaction: null,
  setSelectedOnChainTransaction: (selectedOnChainTransaction) => set({ selectedOnChainTransaction }),
  selectedOnOffRampTransaction: null,
  setSelectedOnOffRampTransaction: (selectedOnOffRampTransaction) => set({ selectedOnOffRampTransaction }),
  selectedTradingContest: null,
  setSelectedTradingContest: (selectedTradingContest) => set({ selectedTradingContest }),
  selectedDistributeRewardsId: null,
  setSelectedDistributeRewardsId: (selectedDistributeRewardsId) => set({ selectedDistributeRewardsId }),
  selectedExcludeCustomerId: null,
  setSelectedExcludeCustomerId: (selectedExcludeCustomerId) => set({ selectedExcludeCustomerId }),
  selectedTradingContestCustomer: null,
  setSelectedTradingContestCustomer: (selectedTradingContestCustomer) => set({ selectedTradingContestCustomer }),
  selectedAlertTransactionId: null,
  setSelectedAlertTransactionId: (selectedAlertTransactionId) => set({ selectedAlertTransactionId }),
}));
