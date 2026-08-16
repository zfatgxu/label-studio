import { Button } from "@humansignal/ui";
import { modal } from "../../components/Modal/Modal";
import { useModalControls } from "../../components/Modal/ModalPopup";
import { Space } from "../../components/Space/Space";
import { cn } from "../../utils/bem";

export const WebhookDeleteModal = ({ onDelete, t }) => {
  return modal({
    title: t("settings.webhook.deleteModal.title"),
    body: () => {
      const rootClass = cn("webhook-delete-modal");
      return (
        <div className={rootClass}>
          <div className={rootClass.elem("modal-text").toClassName()}>{t("settings.webhook.deleteModal.message")}</div>
        </div>
      );
    },
    footer: () => {
      const ctrl = useModalControls();
      return (
        <Space align="end">
          <Button
            look="outlined"
            onClick={() => {
              ctrl.hide();
            }}
            aria-label={t("settings.webhook.deleteModal.cancel")}
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant="negative"
            onClick={async () => {
              await onDelete();
              ctrl.hide();
            }}
            aria-label={t("settings.webhook.deleteModal.confirm")}
          >
            {t("settings.webhook.delete")}
          </Button>
        </Space>
      );
    },
    style: { width: 512 },
  });
};
