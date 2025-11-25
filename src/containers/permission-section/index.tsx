import { FC, useState } from "react";

import { mdiChevronDown } from "@mdi/js";
import { IPermissionSection } from "@store";
import { Icon } from "@ui-kit";
import { cn } from "@utils";

import { PermissionSubSection } from "./permission-sub-section";

interface PermissionSectionProps {
  section: IPermissionSection;
}

export const PermissionSection: FC<PermissionSectionProps> = ({ section }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="text-sm font-semibold text-foreground-muted">
      <div key={section.Name} className="flex border-b border-t px-5 py-3">
        <div className="flex w-[18%] cursor-pointer select-none items-center" onClick={() => setOpen((prev) => !prev)}>
          <Icon name={mdiChevronDown} className={cn(open && "rotate-180 transition-transform")} />
          {section.Name}
        </div>
      </div>
      {open &&
        section.subPermissionSections?.map((subSection, i) => <PermissionSubSection key={i} section={subSection} />)}
    </div>
  );
};
