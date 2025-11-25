import { FC, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useCheckPermission, useToast } from "@hooks";
import { mdiClose, mdiPencil } from "@mdi/js";
import { api } from "@services";
import { IPermissionSection, useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ENUM_ROLE_STATUS, ISelectItem } from "@types";
import { Alert, Button, Icon, ProgressCircular, Select, TextField } from "@ui-kit";
import { getErrorMessage } from "@utils";
import { isAxiosError } from "axios";
import { isEqual, omit } from "lodash";

import { PermissionSection } from "./components";
import { emptyRole, RoleFormSchema, RoleFormValues, RolePermissionSection } from "./RoleForm.consts";

interface RoleFormProps {
  isModeEdit: boolean;
  readOnly: boolean;
  onReadOnlyChange: (value: boolean) => void;
}

export const RoleForm: FC<RoleFormProps> = ({ isModeEdit, readOnly, onReadOnlyChange }) => {
  const navigate = useNavigate();
  const { id } = useSearch({ from: "/auth/roles/role" });
  const toast = useToast();
  const { checkPermission } = useCheckPermission();
  const [defaultValues, setDefaultValues] = useState(emptyRole);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: RoleFormSchema,
    },
    onSubmit: ({ value }) => {
      if (isModeEdit) updateRole(value);
      else createRole(value);
    },
  });
  const { Field, Subscribe } = form;
  const setDialogs = useStore((s) => s.setDialogs);
  const canFetchInitialData = useRef(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [initialData, setInitialData] = useState({
    orgLevels: [] as ISelectItem[],
    permissionSections: [] as IPermissionSection[],
  });
  const { orgLevels, permissionSections } = initialData;
  const canFetchRole = useRef(true);
  const [loading, setLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const filteredPermissionSections = useMemo(() => {
    if (!permissionSections) return [];

    return permissionSections?.filter((section) =>
      defaultValues.name.toLowerCase().includes("dev")
        ? !section.parentId && !!section.subPermissionSections?.length
        : !section.parentId && !!section.subPermissionSections?.length && section.Name !== "Permission Section"
    );
  }, [permissionSections, defaultValues.name]);
  const [selectedPermissionSections, setSelectedPermissionSections] = useState<RolePermissionSection[]>([]);

  const handlePermissionChange = (permission: RolePermissionSection) => {
    const newSelectedPermissionSections = [...selectedPermissionSections];
    const sectionIndex = selectedPermissionSections.findIndex(
      (sps) => sps.permissionSectionId === permission.permissionSectionId
    );

    if (sectionIndex !== -1) {
      if (permission.permissionTypeIds.length > 0) {
        newSelectedPermissionSections.splice(sectionIndex, 1, permission);
      } else {
        newSelectedPermissionSections.splice(sectionIndex, 1);
      }
    } else {
      newSelectedPermissionSections.push(permission);
    }

    setSelectedPermissionSections(newSelectedPermissionSections);
  };

  const handlePermissionsChange = (permissions: RolePermissionSection[]) => {
    const newSelectedPermissionSections = [...selectedPermissionSections];

    permissions.forEach((permission) => {
      const index = newSelectedPermissionSections.findIndex(
        (sps) => sps.permissionSectionId === permission.permissionSectionId
      );

      if (index !== -1) {
        if (permission.permissionTypeIds.length > 0) {
          newSelectedPermissionSections.splice(index, 1, permission);
        } else {
          newSelectedPermissionSections.splice(index, 1);
        }
      } else {
        newSelectedPermissionSections.push(permission);
      }
    });

    setSelectedPermissionSections(newSelectedPermissionSections);
  };

  const handleEditClick = () => {
    // This code will be restored in later stage
    // if (defaultValues.userCount) {
    //   toast.warning("Editing is not allowed for assigned roles.");
    // } else {
    if (defaultValues.status === ENUM_ROLE_STATUS.Deleted) {
      toast.warning("Editing is not allowed for deleted roles.");
    } else {
      onReadOnlyChange(false);
      setHasUnsavedChanges(false);
    }
    // }
  };

  const handleChange = () => {
    setHasUnsavedChanges(!isEqual(defaultValues, form.state.values));
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setDialogs(["unsavedChanges"]);
    } else {
      if (isModeEdit) onReadOnlyChange(true);
      else navigate({ to: "/roles" });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  const createRole = async (requestData: RoleFormValues) => {
    try {
      setLoading(true);

      await api.post("/bo/api/roles", requestData);

      toast.success(`${requestData.name} has been added`);

      navigate({ to: "/roles" });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (requestData: RoleFormValues) => {
    try {
      setLoading(true);

      await api.put(`/bo/api/roles/${id}`, requestData);

      onReadOnlyChange(true);

      toast.success(`${requestData.name} has been updated`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const getOrgLevels = async () => {
    const { data } = await api.get("/bo/api/orgLevels/all?page=1&pageSize=10000");
    return data.items;
  };

  const getPermissionSections = async () => {
    const { data } = await api.get("/bo/api/permissionSections/all?page=1&pageSize=10000&status=1");
    return data.items;
  };

  const getInitialData = useCallback(async () => {
    try {
      const orgLevels = await getOrgLevels();
      const permissionSections = await getPermissionSections();

      setInitialData({
        orgLevels,
        permissionSections,
      });
    } catch (err) {
      console.error("Error", err);
    } finally {
      setPageLoading(false);
    }
  }, []);

  const getRole = useCallback(async () => {
    try {
      const { data } = await api.get(`/bo/api/roles/${id}`);

      setDefaultValues({ ...data });
      setSelectedPermissionSections(
        data.permissionSections.map((ps: IPermissionSection) => ({
          permissionSectionId: ps.id,
          permissionTypeIds: ps.permissionTypeIds,
        }))
      );
      onReadOnlyChange(true);
    } catch (err) {
      if (isAxiosError(err) && err.status !== 404) {
        toast.error(err.response?.data);
      }
    } finally {
      form.reset();
    }
  }, [id, form, toast, onReadOnlyChange]);

  useEffect(() => {
    form.setFieldValue("rolesPermissionSections", selectedPermissionSections);
    form.validateField("rolesPermissionSections", "change");
    if (!isEqual(selectedPermissionSections, defaultValues.rolesPermissionSections)) {
      setHasUnsavedChanges(true);
    } else if (
      isEqual(omit(defaultValues, "rolesPermissionSections"), omit(form.state.values, "rolesPermissionSections"))
    ) {
      setHasUnsavedChanges(false);
    }
  }, [form, selectedPermissionSections, defaultValues]);

  useEffect(() => {
    if (canFetchInitialData.current) {
      canFetchInitialData.current = false;
      void getInitialData();
    }
  }, [getInitialData]);

  useEffect(() => {
    if (canFetchRole.current && id) {
      canFetchRole.current = false;
      void getRole();
    } else {
      setPageLoading(false);
    }
  }, [id, getRole]);

  return pageLoading ? (
    <div className="flex justify-center text-primary">
      <ProgressCircular indeterminate />
    </div>
  ) : (
    <form onChange={handleChange} onSubmit={handleSubmit}>
      <div className="flex flex-col gap-5">
        <div className="flex w-full justify-end">
          {checkPermission("roles_update") && isModeEdit && (
            <Button type="button" variant="icon" size="icon" onClick={readOnly ? handleEditClick : handleCancel}>
              <Icon name={readOnly ? mdiPencil : mdiClose} color="current" />
            </Button>
          )}
        </div>

        <div className="flex grow flex-wrap gap-x-5 gap-y-1">
          <div className="w-[calc(50%_-_10px)]">
            <Field name="name">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="Name"
                  name={name}
                  value={value}
                  readOnly={readOnly}
                  errorMessage={meta.errors[0] || ""}
                  onChange={(e) => handleChange(e.target.value)}
                />
              )}
            </Field>
          </div>

          <div className="w-[calc(50%_-_10px)]">
            <Field name="description">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="Description"
                  name={name}
                  value={value}
                  readOnly={readOnly}
                  errorMessage={meta.errors[0] || ""}
                  onChange={(e) => handleChange(e.target.value)}
                />
              )}
            </Field>
          </div>

          <div className="w-[calc(50%_-_10px)]">
            <Field name="orgLevelId">
              {({ name, state: { value, meta }, handleChange }) => (
                <Select
                  label="Org Level"
                  name={name}
                  value={String(value)}
                  items={orgLevels}
                  readOnly={readOnly}
                  errorMessage={meta.errors[0] || ""}
                  onValueChange={(value) => handleChange(+value)}
                />
              )}
            </Field>
          </div>
        </div>

        {!!filteredPermissionSections.length && (
          <div className="flex flex-col">
            <div className="flex gap-2 py-5">
              <div className="min-w-[calc(18%_-_41px_/_6)] max-w-[calc(18%_-_41px_/_6)] text-center text-sm font-semibold text-foreground-muted">
                Section
              </div>
              <div className="min-w-[calc(18%_-_41px_/_6)] max-w-[calc(18%_-_41px_/_6)] text-center text-sm font-semibold text-foreground-muted">
                Sub Section
              </div>
              <div className="min-w-[calc(18%_-_41px_/_6)] max-w-[calc(18%_-_41px_/_6)] text-center text-sm font-semibold text-foreground-muted">
                Items
              </div>
              <div className="min-w-[calc(11.5%_-_41px_/_6)] max-w-[calc(11.5%_-_41px_/_6)] text-center text-sm font-semibold text-foreground-muted">
                Read
              </div>
              <div className="min-w-[calc(11.5%_-_41px_/_6)] max-w-[calc(11.5%_-_41px_/_6)] text-center text-sm font-semibold text-foreground-muted">
                Update
              </div>
              <div className="min-w-[calc(11.5%_-_41px_/_6)] max-w-[calc(11.5%_-_41px_/_6)] text-center text-sm font-semibold text-foreground-muted">
                Create
              </div>
              <div className="min-w-[calc(11.5%_-_41px_/_6)] max-w-[calc(11.5%_-_41px_/_6)] text-center text-sm font-semibold text-foreground-muted">
                Delete
              </div>
            </div>

            <div className="flex flex-col gap-7 pb-10">
              {filteredPermissionSections.map((section) => (
                <PermissionSection
                  key={section.Name}
                  section={section}
                  selectedPermissionSections={selectedPermissionSections}
                  readOnly={readOnly}
                  onPermissionChange={handlePermissionChange}
                  onPermissionsChange={handlePermissionsChange}
                />
              ))}

              <Field name="rolesPermissionSections">
                {({ state: { meta } }) => (meta.errors[0] ? <Alert variant="error" text={meta.errors[0]} /> : null)}
              </Field>
            </div>
          </div>
        )}
      </div>

      {!readOnly && (
        <div className="flex justify-end gap-5">
          <Subscribe selector={({ canSubmit }) => [canSubmit]}>
            {([canSubmit]) => (
              <Button type="submit" className="w-[180px]" disabled={!canSubmit} loading={loading}>
                {isModeEdit ? "Update Role" : "Add Role"}
              </Button>
            )}
          </Subscribe>

          <Button type="button" variant="outline" className="w-[180px]" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      )}
    </form>
  );
};
