import { mdiAlert } from "@mdi/js";
import { Icon } from "@ui-kit";

export const AlertGenerationFailed = () => {
  return (
    <div className="flex h-full items-center justify-center p-5">
      <div className="flex max-w-[501px] -translate-y-10 flex-col items-center gap-4 text-center text-foreground-muted-more">
        <div className="flex h-[60px] w-[60px] items-center justify-center rounded-2xl border">
          <Icon name={mdiAlert} color="current" size={32} />
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-semibold">No Alerts</h3>

          <p>Alert generation failed</p>
          <p>Please contact technical team</p>
        </div>
      </div>
    </div>
  );
};
