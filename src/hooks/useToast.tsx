import { useCallback, useMemo } from "react";

import { Icon } from "@ui-kit";
import { closeIcon, errorIconVariant, infoIconVariant, successIconVariant, warningIconVariant } from "@utils";
import { toast as sonnerToast } from "sonner";

export const useToast = () => {
  const closeButton = useMemo(() => {
    return <Icon name={closeIcon} size={16} />;
  }, []);

  const info = useCallback(
    (message: string) => {
      return sonnerToast.info(message, {
        icon: <Icon name={infoIconVariant} color="icon-primary" size={24} />,
        action: {
          label: closeButton,
          onClick: () => {},
        },
      });
    },
    [closeButton]
  );

  const success = useCallback(
    (message: string) => {
      return sonnerToast.success(message, {
        icon: <Icon name={successIconVariant} color="icon-success" size={24} />,
        action: {
          label: closeButton,
          onClick: () => {},
        },
      });
    },
    [closeButton]
  );

  const warning = useCallback(
    (message: string) => {
      return sonnerToast.warning(message, {
        icon: <Icon name={warningIconVariant} color="icon-warning" size={24} />,
        action: {
          label: closeButton,
          onClick: () => {},
        },
      });
    },
    [closeButton]
  );

  const error = useCallback(
    (message: string) => {
      return sonnerToast.error(message, {
        icon: <Icon name={errorIconVariant} color="icon-error" size={24} />,
        action: {
          label: closeButton,
          onClick: () => {},
        },
      });
    },
    [closeButton]
  );

  return {
    ...sonnerToast,
    info,
    success,
    error,
    warning,
  };
};
