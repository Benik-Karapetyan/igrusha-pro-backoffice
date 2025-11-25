import { useState } from "react";

import { ENUM_PEER_TO_PEER_OFFER_SEARCH_TERM } from "@types";
import { Button, DropdownItem, Icon, Popover, PopoverContent, PopoverTrigger, TextField } from "@ui-kit";
import { searchIcon, settingsIcon } from "@utils";

interface PeerToPeerOfferSearchProps {
  searchTerm: ENUM_PEER_TO_PEER_OFFER_SEARCH_TERM;
  searchValue: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchTermChange: (term: ENUM_PEER_TO_PEER_OFFER_SEARCH_TERM) => void;
}

export const PeerToPeerOfferSearch = ({
  searchTerm,
  searchValue,
  handleSearchChange,
  handleSearchTermChange,
}: PeerToPeerOfferSearchProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div>
          <TextField
            value={searchValue}
            placeholder={
              searchTerm === ENUM_PEER_TO_PEER_OFFER_SEARCH_TERM.customerOrOfferId
                ? "Search by Customer ID/Offer ID"
                : "Search by Email/Nickname"
            }
            className="w-[222px]"
            hideDetails
            prependInner={<Icon name={searchIcon} className="mr-2" />}
            appendInner={
              <Button variant="ghost" size="iconSmall">
                <Icon name={settingsIcon} color={open ? "icon-primary" : "icon-default"} />
              </Button>
            }
            onClick={() => setOpen(true)}
            onChange={handleSearchChange}
          />
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-[308px]" align="start">
        <DropdownItem
          text="Customer ID/Offer ID"
          value={ENUM_PEER_TO_PEER_OFFER_SEARCH_TERM.customerOrOfferId}
          selected={searchTerm === ENUM_PEER_TO_PEER_OFFER_SEARCH_TERM.customerOrOfferId}
          onClick={(val) => {
            handleSearchTermChange(val as ENUM_PEER_TO_PEER_OFFER_SEARCH_TERM);
            setOpen(false);
          }}
        />
        <DropdownItem
          text="Email/Nickname"
          value={ENUM_PEER_TO_PEER_OFFER_SEARCH_TERM.emailOrNickname}
          selected={searchTerm === ENUM_PEER_TO_PEER_OFFER_SEARCH_TERM.emailOrNickname}
          onClick={(val) => {
            handleSearchTermChange(val as ENUM_PEER_TO_PEER_OFFER_SEARCH_TERM);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
