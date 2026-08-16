import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { Button, Typography, useToast } from "@humansignal/ui";
import { useUpdatePageTitle, createTitleFromSegments } from "@humansignal/core";
import { Label } from "../../components/Form";
import { modal } from "../../components/Modal/Modal";
import { useModalControls } from "../../components/Modal/ModalPopup";
import Input from "../../components/Form/Elements/Input/Input";
import { Space } from "../../components/Space/Space";
import { Spinner } from "../../components/Spinner/Spinner";
import { useAPI } from "../../providers/ApiProvider";
import { useProject } from "../../providers/ProjectProvider";
import { cn } from "../../utils/bem";

export const DangerZone = () => {
  const { t } = useTranslation();
  const { project } = useProject();
  const api = useAPI();
  const history = useHistory();
  const toast = useToast();
  const [processing, setProcessing] = useState(null);

  useUpdatePageTitle(createTitleFromSegments([project?.title, t("settings.dangerZone.title")]));

  const showDangerConfirmation = ({ title, message, requiredWord, buttonText, confirmWordKey, onConfirm }) => {
    const isDev = process.env.NODE_ENV === "development";

    return modal({
      title,
      width: 600,
      allowClose: false,
      body: () => {
        const ctrl = useModalControls();
        const inputValue = ctrl?.state?.inputValue || "";

        return (
          <div>
            <Typography variant="body" size="medium" className="mb-tight">
              {message}
            </Typography>
            <Input
              label={t("settings.dangerZone.confirmation.prompt", {
                word: t(`settings.dangerZone.confirmation.${confirmWordKey}`),
              })}
              value={inputValue}
              onChange={(e) => ctrl?.setState({ inputValue: e.target.value })}
              autoFocus
              data-testid="danger-zone-confirmation-input"
              autoComplete="off"
            />
          </div>
        );
      },
      footer: () => {
        const ctrl = useModalControls();
        const inputValue = (ctrl?.state?.inputValue || "").trim().toLowerCase();
        const isValid = isDev || inputValue === requiredWord.toLowerCase();

        return (
          <Space align="end">
            <Button
              variant="neutral"
              look="outline"
              onClick={() => ctrl?.hide()}
              data-testid="danger-zone-cancel-button"
            >
              {t("common.cancel")}
            </Button>
            <Button
              variant="negative"
              disabled={!isValid}
              onClick={async () => {
                await onConfirm();
                ctrl?.hide();
              }}
              data-testid="danger-zone-confirm-button"
            >
              {buttonText}
            </Button>
          </Space>
        );
      },
    });
  };

  const handleOnClick = (type) => () => {
    const actionConfig = {
      reset_cache: {
        title: t("settings.dangerZone.confirmation.title_resetCache"),
        message: t("settings.dangerZone.confirmation.message_resetCache", { title: project.title }),
        requiredWord: "cache",
        confirmWordKey: "word_cache",
        buttonText: t("settings.dangerZone.confirmation.confirmResetCache"),
      },
      tabs: {
        title: t("settings.dangerZone.confirmation.title_dropTabs"),
        message: t("settings.dangerZone.confirmation.message_dropTabs", { title: project.title }),
        requiredWord: "tabs",
        confirmWordKey: "word_tabs",
        buttonText: t("settings.dangerZone.confirmation.confirmDropTabs"),
      },
      project: {
        title: t("settings.dangerZone.confirmation.title_deleteProject"),
        message: t("settings.dangerZone.confirmation.message_deleteProject", { title: project.title }),
        requiredWord: "delete",
        confirmWordKey: "word_delete",
        buttonText: t("settings.dangerZone.confirmation.confirmDeleteProject"),
      },
    };

    const config = actionConfig[type];

    if (!config) {
      return;
    }

    showDangerConfirmation({
      ...config,
      onConfirm: async () => {
        setProcessing(type);
        try {
          if (type === "reset_cache") {
            await api.callApi("projectResetCache", {
              params: {
                pk: project.id,
              },
            });
            toast.show({ message: t("settings.dangerZone.toast.cacheReset") });
          } else if (type === "tabs") {
            await api.callApi("deleteTabs", {
              body: {
                project: project.id,
              },
            });
            toast.show({ message: t("settings.dangerZone.toast.tabsDropped") });
          } else if (type === "project") {
            await api.callApi("deleteProject", {
              params: {
                pk: project.id,
              },
            });
            toast.show({ message: t("settings.dangerZone.toast.projectDeleted") });
            history.replace("/projects");
          }
        } catch (error) {
          toast.show({ message: t("settings.dangerZone.toast.error", { message: error.message }), type: "error" });
        } finally {
          setProcessing(null);
        }
      },
    });
  };

  const buttons = useMemo(
    () => [
      {
        type: "annotations",
        disabled: true, //&& !project.total_annotations_number,
        label: t("settings.dangerZone.deleteAnnotations", { count: project.total_annotations_number }),
      },
      {
        type: "tasks",
        disabled: true, //&& !project.task_number,
        label: t("settings.dangerZone.deleteTasks", { count: project.task_number }),
      },
      {
        type: "predictions",
        disabled: true, //&& !project.total_predictions_number,
        label: t("settings.dangerZone.deletePredictions", { count: project.total_predictions_number }),
      },
      {
        type: "reset_cache",
        help: t("settings.dangerZone.resetCacheHelp"),
        label: t("settings.dangerZone.resetCache"),
      },
      {
        type: "tabs",
        help: t("settings.dangerZone.dropTabsHelp"),
        label: t("settings.dangerZone.dropTabs"),
      },
      {
        type: "project",
        help: t("settings.dangerZone.deleteProjectHelp"),
        label: t("settings.dangerZone.deleteProject"),
      },
    ],
    [project, t],
  );

  return (
    <div className={cn("simple-settings").toClassName()}>
      <Typography variant="headline" size="medium" className="mb-tighter">
        {t("settings.dangerZone.title")}
      </Typography>
      <Typography variant="body" size="medium" className="text-neutral-content-subtler !mb-base">
        {t("settings.dangerZone.subtitle")}
      </Typography>

      {project.id ? (
        <div style={{ marginTop: 16 }}>
          {buttons.map((btn) => {
            const waiting = processing === btn.type;
            const disabled = btn.disabled || (processing && !waiting);

            return (
              btn.disabled !== true && (
                <div className={cn("settings-wrapper").toClassName()} key={btn.type}>
                  <Typography variant="title" size="large">
                    {btn.label}
                  </Typography>
                  {btn.help && <Label description={btn.help} style={{ width: 600, display: "block" }} />}
                  <Button
                    key={btn.type}
                    variant="negative"
                    look="outlined"
                    disabled={disabled}
                    waiting={waiting}
                    onClick={handleOnClick(btn.type)}
                    style={{ marginTop: 16 }}
                  >
                    {btn.label}
                  </Button>
                </div>
              )
            );
          })}
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
          <Spinner size={32} />
        </div>
      )}
    </div>
  );
};

DangerZone.title = "危险区域";
DangerZone.path = "/danger-zone";
