import { createRouter } from "@tanstack/react-router";

import { rootRoute } from "./__root";
import { accountDetailsRoute } from "./account-details";
import { accountsRoute } from "./accounts";
import { adminUserRoute } from "./admin-user";
import { adminUsersRoute } from "./admin-users";
import { alertCenterRoute } from "./alert-center";
import { apiKeyDetailsRoute } from "./api-key-details";
import { apiKeysRoute } from "./api-keys";
import { assetsRoute } from "./assets";
import { authRoute } from "./auth";
import { brandsRoute } from "./brands";
import { checkEmailRoute } from "./check-email";
import { coinsRoute } from "./coins";
import { customerProfileRoute } from "./customer-profile";
import { customersRoute } from "./customers";
import { depositAnalyticsRoute } from "./deposit-analytics";
import { feeSettingsRoute } from "./fee-settings";
import { kycLimitsRoute } from "./kyc-limits";
import { levelsRoute } from "./levels";
import { mainRoute } from "./main";
import { marketCategoriesRoute } from "./market-categories";
import { marketDataFeedsRoute } from "./market-data-feeds";
import { networksRoute } from "./networks";
import { nodesRoute } from "./nodes";
import { orderHistoryRoute } from "./order-history";
import { orgLevelsRoute } from "./org-levels";
import { paymentHistoryRoute } from "./payment-history";
import { peerToPeerOfferDetailsRoute } from "./peer-to-peer-offer-details";
import { peerToPeerOffersRoute } from "./peer-to-peer-offers";
import { peerToPeerOrderDetailsRoute } from "./peer-to-peer-order-details";
import { peerToPeerOrdersRoute } from "./peer-to-peer-orders";
import { permissionSectionsRoute } from "./permission-sections";
import { permissionsRoute } from "./permissions";
import { productsRoute } from "./products";
import { profileRoute } from "./profile";
import { recoverPasswordRoute } from "./recover-password";
import { referralRoute } from "./referral";
import { referralDetailsRoute } from "./referral-details";
import { regionsRoute } from "./regions";
import { resetPasswordRoute } from "./reset-password";
import { roleRoute } from "./role";
import { rolesRoute } from "./roles";
import { scannersRoute } from "./scanners";
import { setPasswordRoute } from "./set-password";
import { signInRoute } from "./sign-in";
import { smsProvidersRoute } from "./sms-providers";
import { spotTradingPairsRoute } from "./spot-trading-pairs";
import { tradingContestRoute } from "./trading-contest";
import { tradingContestDetailsRoute } from "./trading-contest-details";
import { tradingFeesRoute } from "./trading-fees";
import { tradingHistoryRoute } from "./trading-history";
import { transactionsRoute } from "./transactions";
import { vaultsRoute } from "./vaults";
import { withdrawalAnalyticsRoute } from "./withdrawal-analytics";
import { withdrawalDepositSettingsRoute } from "./withdrawal-deposit-settings";

const routeTree = rootRoute.addChildren([
  authRoute.addChildren([
    mainRoute,
    profileRoute,
    customersRoute,
    customerProfileRoute,
    apiKeyDetailsRoute,
    apiKeysRoute,
    productsRoute,
    regionsRoute,
    transactionsRoute,
    orderHistoryRoute,
    tradingHistoryRoute,
    networksRoute,
    nodesRoute,
    coinsRoute,
    assetsRoute,
    withdrawalDepositSettingsRoute,
    vaultsRoute,
    scannersRoute,
    accountsRoute,
    accountDetailsRoute,
    depositAnalyticsRoute,
    withdrawalAnalyticsRoute,
    tradingFeesRoute,
    levelsRoute,
    feeSettingsRoute,
    peerToPeerOffersRoute,
    peerToPeerOfferDetailsRoute,
    peerToPeerOrdersRoute,
    peerToPeerOrderDetailsRoute,
    paymentHistoryRoute,
    kycLimitsRoute,
    alertCenterRoute,
    spotTradingPairsRoute,
    marketCategoriesRoute,
    marketDataFeedsRoute,
    smsProvidersRoute,
    referralRoute,
    referralDetailsRoute,
    tradingContestRoute,
    tradingContestDetailsRoute,
    adminUsersRoute,
    adminUserRoute,
    rolesRoute,
    roleRoute,
    permissionSectionsRoute,
    permissionsRoute,
    orgLevelsRoute,
    brandsRoute,
  ]),
  signInRoute,
  recoverPasswordRoute,
  checkEmailRoute,
  setPasswordRoute,
  resetPasswordRoute,
]);

export const router = createRouter({
  routeTree,
  context: { auth: undefined! },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
