import { useState } from "react";

import { ProfileForm } from "@forms";

export const ProfilePage = () => {
  const [readOnly, setReadOnly] = useState(true);

  return (
    <div className="p-5">
      <div className="rounded-xl border bg-background-subtle p-5">
        <ProfileForm readOnly={readOnly} onReadOnlyChange={setReadOnly} />
      </div>
    </div>
  );
};
