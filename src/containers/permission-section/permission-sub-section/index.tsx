import { FC, useState } from "react";

import { mdiChevronDown } from "@mdi/js";
import { IPermissionSection } from "@store";
import { Icon } from "@ui-kit";
import { cn } from "@utils";

import { PermissionItem } from "../permission-item";

interface PermissionSubSectionProps {
  section: IPermissionSection;
}

export const PermissionSubSection: FC<PermissionSubSectionProps> = ({ section }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex border-b px-5 py-3">
        <div className="w-[18%]"></div>
        <div className="flex w-[18%] cursor-pointer select-none items-center" onClick={() => setOpen((prev) => !prev)}>
          <Icon name={mdiChevronDown} className={cn(open && "rotate-180 transition-transform")} />
          {section.Name}
        </div>
      </div>

      {open &&
        section.subPermissionSections?.map((subSection) => (
          <PermissionItem key={subSection.Name} section={subSection} />
        ))}
    </>
  );
};
