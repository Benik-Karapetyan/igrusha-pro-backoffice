import { GeneralInfoCard } from "./general-info-card";
import { NotesCard } from "./notes-card";
import { OfferDetailsCard } from "./offer-details-card";
import { SummaryCard } from "./summary-card";
import { UserInfoCard } from "./user-info-card";

export const PeerToPeerOfferInfoCards = () => {
  return (
    <div className="flex max-h-[calc(100vh-6.625rem)] w-[300px] min-w-[300px] flex-col gap-4 overflow-auto rounded-xl border bg-white p-4">
      <GeneralInfoCard
        offerId="12840i0241"
        offerType="Buy"
        chipType="active"
        chipTitle="Active"
        timeActive="6 Month"
        creationTime="07.05.2025 14:25:14"
        lastModified="07.05.2025 14:25:14"
      />

      <OfferDetailsCard
        priceType="Fixed"
        price="1,1 USD"
        cryptoFiatPair="USDT/USD"
        visibility="Public"
        paymentMethods="Revolut, Ameriabank, IDram, Paypal, Paysera"
      />

      <UserInfoCard
        makerId="3297493hj"
        verifiedName="Tony Stark"
        nickname="Iron Man"
        email="tony.stark@gmail.com"
        accountNumber="3297493hj"
      />

      <SummaryCard
        min="1.1 USDT"
        max="1.1 USDT"
        available="1.1 USDT"
        completedOrdersCount="200"
        filledAmount="1.1 USDT/ 2.8 USDT"
      />

      <NotesCard notes="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
    </div>
  );
};
