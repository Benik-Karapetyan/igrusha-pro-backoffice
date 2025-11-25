import { FC, FormEvent, useCallback, useEffect, useRef, useState } from "react";

import { PhoneInput, ReadOnlyField } from "@containers";
import { mdiClose, mdiPencil } from "@mdi/js";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { ISelectItem } from "@types";
import { Button, Icon, ProgressCircular, TextField } from "@ui-kit";
import { getErrorMessage } from "@utils";
import { isAxiosError } from "axios";
import { isEqual, omit } from "lodash";
import { toast } from "sonner";

import { ProfileAvatar } from "./components";
import { emptyProfile, ProfileFormSchema, ProfileFormValues } from "./ProfileForm.consts";

interface ProfileFormProps {
  readOnly: boolean;
  onReadOnlyChange: (value: boolean) => void;
}

export const ProfileForm: FC<ProfileFormProps> = ({ readOnly, onReadOnlyChange }) => {
  const [defaultValues, setDefaultValues] = useState(emptyProfile);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: ProfileFormSchema,
    },
    onSubmit: ({ value }) => {
      updateProfile(value);
    },
  });
  const { Field, Subscribe } = form;
  const auth = useStore((s) => s.auth);
  const { isLoading, user, avatar } = auth;
  const setAuth = useStore((s) => s.setAuth);
  const setDialogs = useStore((s) => s.setDialogs);
  const canFetchInitialData = useRef(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState({
    roles: [] as ISelectItem[],
    orgLevels: [] as ISelectItem[],
    brands: [] as ISelectItem[],
  });
  const { roles, orgLevels, brands } = initialData;
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const getRoleNames = (roleIds: number[]) => {
    const roleNames: string[] = [];

    roleIds?.forEach((id) => {
      const role = roles.find((role) => role.id === id);

      if (role) roleNames.push(role.name as string);
    });

    return roleNames;
  };

  const handleEditClick = () => {
    onReadOnlyChange(false);
    setHasUnsavedChanges(false);
    form.reset();
  };

  const handleChange = () => {
    setHasUnsavedChanges(!isEqual(defaultValues, form.state.values));
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setDialogs(["unsavedChanges"]);
    } else {
      onReadOnlyChange(true);
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

  const getProfile = useCallback(async () => {
    try {
      const { data } = await api.get(`/bo/api/auth/me/`);
      const roleIds = data.userRoles.map((role: { id: number }) => role.id);
      setDefaultValues({ ...data, roleIds, image: null, orgLevelId: null, brandId: null });

      const { data: avatarData } = await api.get(`/bo/api/users/profilePicture/${data.id}`);
      setAuth({ ...auth, avatar: `data:image/png;base64,${avatarData.base64Image}` });
    } catch (err) {
      if (isAxiosError(err) && err.status !== 404) {
        toast.error(err.response?.data);
      }
    } finally {
      onReadOnlyChange(true);
      setPageLoading(false);
      form.reset();
    }
  }, [auth, form, setAuth, onReadOnlyChange]);

  const updateProfile = async (requestData: ProfileFormValues) => {
    try {
      setLoading(true);

      if (requestData.id && requestData.image) uploadImage(requestData.id, requestData.image);

      await api.put(`/bo/api/users/${defaultValues.id}`, omit(requestData, "email"));

      onReadOnlyChange(true);
      getProfile();

      toast.success(`Profile has been updated`, {
        action: {
          label: <Icon name={mdiClose} small />,
          onClick: () => {},
        },
      });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const getRoles = async () => {
    const { data } = await api.post("/bo/api/roles/all", { page: 1, pageSize: 10000 });
    return data.items;
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
    if (user) {
      const roleIds = user.userRoles.map((role: { id: number }) => role.id);
      setDefaultValues({ ...user, roleIds, image: null, orgLevelId: null, brandId: null });
    }
  }, [user]);

  useEffect(() => {
    if (canFetchInitialData.current) {
      canFetchInitialData.current = false;
      getInitialData();
    }
  }, [getInitialData]);

  return isLoading || pageLoading ? (
    <div className="flex justify-center text-primary">
      <ProgressCircular indeterminate />
    </div>
  ) : (
    <form onChange={handleChange} onSubmit={handleSubmit}>
      <div className="flex flex-wrap gap-5">
        <div className="flex w-full justify-between">
          <ProfileAvatar
            readOnly={readOnly}
            avatar={avatar}
            onFileUpload={(formData) => form.setFieldValue("image", formData)}
          />

          <Button type="button" variant="ghost" size="icon" onClick={readOnly ? handleEditClick : handleCancel}>
            <Icon name={readOnly ? mdiPencil : mdiClose} />
          </Button>
        </div>

        <div className="flex w-full flex-wrap gap-x-5 gap-y-1">
          <div className="w-[calc(50%_-_10px)]">
            <Field name="firstName">
              {({ state: { value } }) => <ReadOnlyField label="First Name" value={value} className="pb-4" />}
            </Field>
          </div>

          <div className="w-[calc(50%_-_10px)]">
            <Field name="lastName">
              {({ state: { value } }) => <ReadOnlyField label="Last Name" value={value} className="pb-4" />}
            </Field>
          </div>

          <div className="w-[calc(50%_-_10px)]">
            <Field name="email">
              {({ state: { value } }) => <ReadOnlyField label="Email Address" value={value} className="pb-4" />}
            </Field>
          </div>

          <div className="w-[calc(50%_-_10px)]">
            <Field name="phone">
              {(data) => {
                const { name, state, handleChange } = data;

                const value = state?.value || "";
                const meta = state?.meta || { errors: [] };

                return readOnly ? (
                  <ReadOnlyField label="Phone Number" value={value} className="pb-4" />
                ) : (
                  <PhoneInput
                    label="Phone Number"
                    name={name}
                    value={value}
                    errorMessage={meta.errors[0] || ""}
                    onChange={(value, dialCode) => {
                      if (value && value.slice(1).slice(dialCode.length)) handleChange(value);
                      else handleChange("");
                    }}
                  />
                );
              }}
            </Field>
          </div>

          <div className="w-[calc(50%_-_10px)]">
            <Field name="address">
              {({ name, state: { value, meta }, handleChange }) =>
                readOnly ? (
                  <ReadOnlyField label="Address" value={value} className="pb-4" />
                ) : (
                  <TextField
                    label="Address"
                    name={name}
                    value={value}
                    errorMessage={meta.errors[0] || ""}
                    onChange={(e) => handleChange(e.target.value)}
                  />
                )
              }
            </Field>
          </div>

          <div className="w-[calc(50%_-_10px)]">
            <Field name="roleIds">
              {({ state: { value } }) => <ReadOnlyField label="Roles" value={getRoleNames(value)} className="pb-4" />}
            </Field>
          </div>

          <div className="w-[calc(50%_-_10px)]">
            <Field name="orgLevelId">
              {({ state: { value } }) => (
                <ReadOnlyField
                  label="Org Level"
                  value={orgLevels.find((o) => o.id === value)?.name as string}
                  className="pb-4"
                />
              )}
            </Field>
          </div>

          <div className="w-[calc(50%_-_10px)]">
            <Field name="brandId">
              {({ state: { value, meta } }) => (
                <>
                  <ReadOnlyField
                    label="Brand"
                    value={brands.find((b) => b.id === value)?.name as string}
                    className="pb-4"
                  />

                  {meta.errors}
                </>
              )}
            </Field>
          </div>
        </div>
      </div>

      {!readOnly && (
        <div className="flex justify-end gap-5">
          <Subscribe selector={({ canSubmit }) => [canSubmit]}>
            {([canSubmit]) => (
              <Button type="submit" className="w-[180px]" disabled={!canSubmit} loading={loading}>
                Update Profile
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
