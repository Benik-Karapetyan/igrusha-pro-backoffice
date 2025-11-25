import { useStore } from "@store";
import { cn } from "@utils";

import { CustomerDetailsCard } from "./customer-details-card";
import { NotesCard } from "./notes-card";
import { OrderInfoCard } from "./order-info-card";
import { PaymentMethodDetailsCard } from "./payment-method-details-card";

export const PeerToPeerOrderInfoCards = () => {
  const isAppSidebarMini = useStore((s) => s.isAppSidebarMini);

  return (
    <div
      className={cn(
        "flex max-h-[calc(100vh_-_6.625rem)] grow flex-col gap-4 overflow-auto rounded-xl border bg-white p-4",
        isAppSidebarMini ? "max-w-[calc(100vw_-_506px)]" : "max-w-[calc(100vw_-_750px)]"
      )}
    >
      <OrderInfoCard
        orderId="839274"
        offerId="658456"
        orderType="Buy"
        chipType="future"
        chipTitle="Completed"
        appeal="158664"
        orderDuration="15d-27h-10m-09s"
        creationTime="07.05.2025 14:25:14"
        lastStatusUpdate="07.05.2025 18:45:22"
        cryptoAmount="1688 USDT"
        price="1 USD"
        fiatAmount="1688 USD"
      />

      <CustomerDetailsCard
        cardTitle="Buyer’s Details (Taker)"
        customerId="1234567890"
        fullName="John Doe"
        email="john.doe@example.com"
        phoneNumber="1234567890"
        accountAge="10 days"
        completedOrTotalOrders="10/20"
        completionRate="50%"
        attachments={10}
      />

      <CustomerDetailsCard
        cardTitle="Seller’s Details (Maker)"
        customerId="1234567890"
        fullName="John Doe"
        email="john.doe@example.com"
        phoneNumber="1234567890"
        accountAge="10 days"
        completedOrTotalOrders="10/20"
        completionRate="50%"
        attachments={10}
      />

      <PaymentMethodDetailsCard
        paymentMethod="AmeriaBank"
        accountHolderName="Elias Nansen"
        accountNumber="1234 5678 7895 4563"
        paymentDuration="00h-15m-09s"
        accountInfo="Third-party payments are not allowed; the account holder's name must match the payment source for security reasons"
      />

      <NotesCard notes="Please note: To ensure a smooth transaction, the seller requires immediate payment. If payment is not received promptly, the offer may be subject to cancellation. Thank you for your understanding." />
    </div>
  );
};
