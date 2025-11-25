import { FC, FormEvent, useCallback, useEffect, useRef, useState } from "react";

import { MultiSelectDialog, PhoneInput } from "@containers";
import { useCheckPermission, useToast } from "@hooks";
import { mdiClose, mdiKeyVariant, mdiPencil } from "@mdi/js";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ISelectItem } from "@types";
import { Button, Icon, MultiSelect, ProgressCircular, Select, TextField } from "@ui-kit";
import { getErrorMessage } from "@utils";
import { isAxiosError } from "axios";
import { isEqual, omit, pick } from "lodash";

import { AdminUserFormSchema, AdminUserFormValues, emptyAdminUser } from "./AdminUserForm.consts";
import { AdminUserCard, UserAvatar } from "./components";

interface AdminUserFormProps {
  isModeEdit: boolean;
  readOnly: boolean;
  onReadOnlyChange: (value: boolean) => void;
}

export const AdminUserForm: FC<AdminUserFormProps> = ({ isModeEdit, readOnly, onReadOnlyChange }) => {
  const navigate = useNavigate();
  const { id } = useSearch({ from: "/auth/admin-users/admin-user" });
  const toast = useToast();
  const { checkPermission } = useCheckPermission();
  const [defaultValues, setDefaultValues] = useState(emptyAdminUser);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: AdminUserFormSchema,
    },
    onSubmit: ({ value }) => {
      if (isModeEdit) updateUser(value);
      else createUser(value);
    },
  });
  const { Field, Subscribe } = form;
  const setDialogs = useStore((s) => s.setDialogs);
  const setResetPasswordData = useStore((s) => s.setResetPasswordData);
  const canFetchInitialData = useRef(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [initialData, setInitialData] = useState({
    roles: [] as ISelectItem[],
    orgLevels: [] as ISelectItem[],
    brands: [] as ISelectItem[],
  });
  const { roles, orgLevels, brands } = initialData;
  const canFetchUser = useRef(true);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [rolesOpen, setRolesOpen] = useState(false);

  const handleEditClick = () => {
    onReadOnlyChange(false);
    setHasUnsavedChanges(false);
    form.reset();
  };

  const handleResetPasswordClick = () => {
    setResetPasswordData(pick(defaultValues, "email", "username", "phone"));
    setDialogs(["resetPassword"]);
  };

  const handleChange = () => {
    setHasUnsavedChanges(!isEqual(defaultValues, form.state.values));
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setDialogs(["unsavedChanges"]);
    } else {
      if (isModeEdit) onReadOnlyChange(true);
      else navigate({ to: "/admin-users" });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  const uploadImage = async (id: number, image: FormData) => {
    await api.post(`/bo/api/users/uploadProfilePicture/${id}`, image, undefined, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const createUser = async (requestData: AdminUserFormValues) => {
    try {
      setLoading(true);

      const { data } = await api.post("/bo/api/auth/addUser", requestData);

      if (requestData.image && data.id) await uploadImage(data.id, requestData.image);

      toast.success("Admin user has been added");

      navigate({ to: "/admin-users" });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (requestData: AdminUserFormValues) => {
    try {
      setLoading(true);

      if (requestData.id && requestData.image) uploadImage(requestData.id, requestData.image);

      await api.put(`/bo/api/users/${id}`, omit(requestData, "email"));

      onReadOnlyChange(true);
      getUser();

      toast.success(`${requestData.firstName} has been updated`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const getUser = useCallback(async () => {
    try {
      const { data } = await api.get(`/bo/api/users/${id}`);
      const roleIds = data.userRoles
        .filter((role: { status: number }) => role.status === 1)
        .map((role: { id: number }) => role.id);
      setDefaultValues({ ...data, roleIds, image: null, address: data.address || "", username: data.username || "" });

      const { data: avatarData } = await api.get(`/bo/api/users/profilePicture/${id}`);
      setAvatar(`data:image/png;base64,${avatarData.base64Image}`);
    } catch (err) {
      if (isAxiosError(err) && err.status !== 404) {
        toast.error(err.response?.data);
      }
    } finally {
      onReadOnlyChange(true);
      setPageLoading(false);
      form.reset();
    }
  }, [id, form, toast, onReadOnlyChange]);

  const getRoles = async () => {
    const { data } = await api.post("/bo/api/roles/all", { page: 1, pageSize: 10000 });
    return data.items.filter((item: { status: number }) => item.status === 1);
  };

  const getOrgLevels = async () => {
    const { data } = await api.get("/bo/api/orgLevels/all?page=1&pageSize=10000");
    return data.items;
  };

  const getBrands = async () => {
    const { data } = await api.get("/bo/api/brands/all?page=1&pageSize=10000");
    return data.items;
  };

  const getInitialData = useCallback(async () => {
    try {
      const roles = await getRoles();
      const orgLevels = await getOrgLevels();
      const brands = await getBrands();

      setInitialData({
        roles,
        orgLevels,
        brands,
      });
    } catch (err) {
      console.error("Error", err);
    } finally {
      setPageLoading(false);
    }
  }, []);

  useEffect(() => {
    if (canFetchInitialData.current) {
      canFetchInitialData.current = false;
      void getInitialData();
    }
  }, [getInitialData]);

  useEffect(() => {
    if (canFetchUser.current && id) {
      canFetchUser.current = false;
      void getUser();
    } else {
      setPageLoading(false);
    }
  }, [id, getUser]);

  return pageLoading ? (
    <div className="flex justify-center text-primary">
      <ProgressCircular indeterminate />
    </div>
  ) : (
    <form onChange={handleChange} onSubmit={handleSubmit}>
      <div className="flex flex-wrap gap-5">
        <div className="flex w-full justify-between">
          <UserAvatar
            readOnly={readOnly}
            avatar={avatar}
            onFileUpload={(formData) => form.setFieldValue("image", formData)}
          />

          {isModeEdit && (
            <div className="flex gap-1">
              {checkPermission("admin_user_update") && (
                <Button type="button" variant="icon" size="icon" onClick={readOnly ? handleEditClick : handleCancel}>
                  <Icon name={readOnly ? mdiPencil : mdiClose} color="current" />
                </Button>
              )}

              <Button type="button" variant="icon" size="icon" onClick={handleResetPasswordClick}>
                <Icon name={mdiKeyVariant} color="current" className="rotate-90" size={22} />
              </Button>
            </div>
          )}
        </div>

        {readOnly ? (
          <AdminUserCard
            user={defaultValues}
            roles={roles}
            orgLevels={orgLevels}
            brands={brands}
            onStatusUpdate={getUser}
          />
        ) : (
          <div className="flex grow flex-wrap gap-x-5 gap-y-1">
            <div className="w-[calc(50%_-_10px)]">
              <Field name="firstName">
                {({ name, state: { value, meta }, handleChange }) => (
                  <TextField
                    label="First Name"
                    name={name}
                    value={value}
                    errorMessage={meta.errors[0] || ""}
                    onChange={(e) => handleChange(e.target.value)}
                  />
                )}
              </Field>
            </div>

            <div className="w-[calc(50%_-_10px)]">
              <Field name="lastName">
                {({ name, state: { value, meta }, handleChange }) => (
                  <TextField
                    label="Last Name"
                    name={name}
                    value={value}
                    errorMessage={meta.errors[0] || ""}
                    onChange={(e) => handleChange(e.target.value)}
                  />
                )}
              </Field>
            </div>

            <div className="w-[calc(50%_-_10px)]">
              <Field name="email">
                {({ name, state: { value, meta }, handleChange }) => (
                  <TextField
                    label="Email Address"
                    name={name}
                    value={value}
                    readOnly={isModeEdit}
                    errorMessage={meta.errors[0] || ""}
                    onChange={(e) => handleChange(e.target.value)}
                  />
                )}
              </Field>
            </div>

            <div className="w-[calc(50%_-_10px)]">
              <Field name="phone">
                {({ name, state: { value, meta }, handleChange }) => (
                  <PhoneInput
                    label="Phone Number"
                    name={name}
                    value={value}
                    errorMessage={meta.errors[0] || ""}
                    onChange={(value, dialCode) => {
                      if (value.slice(1).slice(dialCode.length)) handleChange(value);
                      else handleChange("");
                    }}
                  />
                )}
              </Field>
            </div>

            <div className="w-[calc(50%_-_10px)]">
              <Field name="address">
                {({ name, state: { value, meta }, handleChange }) => (
                  <TextField
                    label="Address"
                    name={name}
                    value={value}
                    errorMessage={meta.errors[0] || ""}
                    onChange={(e) => handleChange(e.target.value)}
                  />
                )}
              </Field>
            </div>

            <div className="w-[calc(50%_-_10px)]">
              <Field name="roleIds">
                {({ state: { value, meta }, handleChange }) => (
                  <>
                    <MultiSelect
                      label="Role(s)"
                      value={value}
                      items={roles}
                      errorMessage={meta.errors[0] || ""}
                      onClick={() => setRolesOpen(true)}
                    />

                    <MultiSelectDialog
                      title="Role(s)"
                      open={rolesOpen}
                      onOpenChange={setRolesOpen}
                      items={roles}
                      selectedItems={value}
                      onSubmit={(selectedRoles) => {
                        setHasUnsavedChanges(!isEqual(defaultValues.roleIds, selectedRoles));
                        handleChange(selectedRoles);
                        setRolesOpen(false);
                      }}
                    />
                  </>
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
                    errorMessage={meta.errors[0] || ""}
                    onValueChange={(value) => handleChange(+value)}
                  />
                )}
              </Field>
            </div>

            <div className="w-[calc(50%_-_10px)]">
              <Field name="brandId">
                {({ name, state: { value, meta }, handleChange }) => (
                  <Select
                    label="Brand"
                    name={name}
                    value={String(value)}
                    items={brands}
                    errorMessage={meta.errors[0] || ""}
                    onValueChange={(value) => handleChange(+value)}
                  />
                )}
              </Field>
            </div>
          </div>
        )}
      </div>

      {!readOnly && (
        <div className="flex justify-end gap-5 pt-4">
          <Subscribe selector={({ canSubmit }) => [canSubmit]}>
            {([canSubmit]) => (
              <Button type="submit" className="w-[180px]" disabled={!canSubmit} loading={loading}>
                {isModeEdit ? "Update Admin User" : "Add Admin User"}
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
