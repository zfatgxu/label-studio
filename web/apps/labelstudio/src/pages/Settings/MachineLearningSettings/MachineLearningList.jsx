import { formatDistanceToNow, format, parseISO } from "date-fns";
import { zhCN, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { useCallback, useContext } from "react";

import truncate from "truncate-middle";
import { Menu } from "../../../components";
import { Button, Dropdown } from "@humansignal/ui";
import { confirm } from "../../../components/Modal/Modal";
import { Oneof } from "../../../components/Oneof/Oneof";
import { IconEllipsis } from "@humansignal/icons";
import { Tooltip } from "@humansignal/ui";
import { ApiContext } from "../../../providers/ApiProvider";
import { cn } from "../../../utils/bem";

import "./MachineLearningList.scss";

const dateLocales = { "zh-CN": zhCN, "en-US": enUS };

export const MachineLearningList = ({ backends, fetchBackends, onEdit, onTestRequest, onStartTraining }) => {
  const api = useContext(ApiContext);

  const onDeleteModel = useCallback(
    async (backend) => {
      await api.callApi("deleteMLBackend", {
        params: {
          pk: backend.id,
        },
      });
      await fetchBackends();
    },
    [fetchBackends, api],
  );

  return (
    <div>
      {backends.map((backend) => (
        <BackendCard
          key={backend.id}
          backend={backend}
          onStartTrain={onStartTraining}
          onDelete={onDeleteModel}
          onEdit={onEdit}
          onTestRequest={onTestRequest}
        />
      ))}
    </div>
  );
};

const BackendCard = ({ backend, onStartTrain, onEdit, onDelete, onTestRequest }) => {
  const { t, i18n } = useTranslation();
  const confirmDelete = useCallback(
    (backend) => {
      confirm({
        title: t("settings.ml.list.deleteTitle"),
        body: t("settings.ml.list.deleteBody"),
        buttonLook: "destructive",
        onOk() {
          onDelete?.(backend);
        },
      });
    },
    [backend, onDelete, t],
  );

  const rootClass = cn("backend-card");

  return (
    <div className={rootClass.toClassName()}>
      <div className={rootClass.elem("title-container").toClassName()}>
        <div>
          <BackendState backend={backend} />
          <div className={rootClass.elem("title").toClassName()}>{backend.title}</div>
        </div>

        <div className={rootClass.elem("menu").toClassName()}>
          <Dropdown.Trigger
            align="right"
            content={
              <Menu size="medium" contextual>
                <Menu.Item onClick={() => onEdit(backend)}>{t("common.edit")}</Menu.Item>
                <Menu.Item onClick={() => onTestRequest(backend)}>{t("settings.ml.list.sendTestRequest")}</Menu.Item>
                <Menu.Item onClick={() => onStartTrain(backend)}>{t("settings.ml.list.startTraining")}</Menu.Item>
                <Menu.Divider />
                <Menu.Item onClick={() => confirmDelete(backend)} isDangerous>
                  {t("common.delete")}
                </Menu.Item>
              </Menu>
            }
          >
            <Button look="string" size="small" className="!p-0" aria-label={t("settings.ml.list.optionsAria")}>
              <IconEllipsis />
            </Button>
          </Dropdown.Trigger>
        </div>
      </div>

      <div className={rootClass.elem("meta").toClassName()}>
        <div className={rootClass.elem("group").toClassName()}>{truncate(backend.url, 20, 10, "...")}</div>
        <div className={rootClass.elem("group").toClassName()}>
          <Tooltip
            title={format(parseISO(backend.created_at), t("settings.ml.list.createdTooltipFormat"), {
              locale: dateLocales[i18n.language] ?? enUS,
            })}
          >
            <span>
              {t("settings.ml.list.created")}&nbsp;
              {formatDistanceToNow(parseISO(backend.created_at), {
                addSuffix: true,
                locale: dateLocales[i18n.language] ?? enUS,
              })}
            </span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

const BackendState = ({ backend }) => {
  const { t } = useTranslation();
  const { state } = backend;

  return (
    <div className={cn("ml").elem("status").toClassName()}>
      <span className={cn("ml").elem("indicator").mod({ state }).toClassName()} />
      <Oneof value={state} className={cn("ml").elem("status-label").toClassName()}>
        <span case="DI">{t("settings.ml.list.stateDisconnected")}</span>
        <span case="CO">{t("settings.ml.list.stateConnected")}</span>
        <span case="ER">{t("settings.ml.list.stateError")}</span>
        <span case="TR">{t("settings.ml.list.stateTraining")}</span>
        <span case="PR">{t("settings.ml.list.statePredicting")}</span>
      </Oneof>
    </div>
  );
};
