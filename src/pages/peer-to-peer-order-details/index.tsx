import { AppHeader, PeerToPeerOrderInfoCards } from "@containers";
import { useParams } from "@tanstack/react-router";
import { Button } from "@ui-kit";

export const PeerToPeerOrderDetailsPage = () => {
  const { id } = useParams({ from: "/auth/peer-to-peer-orders/$id" });

  return (
    <div>
      <AppHeader
        title={id}
        backUrl="/peer-to-peer-orders"
        MainButton={<Button variant="critical">Exclude Order</Button>}
      />

      <div className="flex gap-4 p-4">
        <PeerToPeerOrderInfoCards />

        <div className="h-screen max-h-[calc(100vh_-_6.625rem)] w-[400px] overflow-auto rounded-xl border bg-white p-4"></div>
      </div>
    </div>
  );
};
