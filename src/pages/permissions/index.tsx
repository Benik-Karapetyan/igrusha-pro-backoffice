import { PermissionSection, TableContainer } from "@containers";
import { useStore } from "@store";

export const PermissionsPage = () => {
  const permissions = useStore((s) => s.authPermissions);
  const permissionSections = permissions.filter(
    (obj, index, self) => index === self.findIndex((o) => o.Name === obj.Name)
  );

  return (
    <TableContainer>
      <div className="flex px-5 py-3">
        <div className="w-[18%] text-sm font-semibold text-primary">Section</div>
        <div className="w-[18%] text-sm font-semibold text-primary">Sub Section</div>
        <div className="w-[18%] text-sm font-semibold text-primary">Item</div>
        <div className="w-[46%] text-sm font-semibold text-primary">Description</div>
      </div>
      <div className="flex flex-col gap-3">
        {permissionSections.map((section) => (
          <PermissionSection key={section.Name} section={section} />
        ))}
      </div>
    </TableContainer>
  );
};
