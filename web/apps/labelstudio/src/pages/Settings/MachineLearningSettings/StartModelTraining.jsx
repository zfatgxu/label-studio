import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@humansignal/ui";
import { useAPI } from "../../../providers/ApiProvider";
import { Typography } from "@humansignal/ui";

export const StartModelTraining = ({ backend }) => {
  const { t } = useTranslation();
  const api = useAPI();
  const [response, setResponse] = useState(null);

  const onStartTraining = useCallback(
    async (backend) => {
      const res = await api.callApi("trainMLBackend", {
        params: {
          pk: backend.id,
        },
      });

      setResponse(res.response || {});
    },
    [api],
  );

  return (
    <div className="max-w-[680px]">
      <Typography size="small" className="text-neutral-content-subtler">
        {t("settings.ml.startTraining.description")}
      </Typography>
      <Typography size="small" className="text-neutral-content-subtler mt-base mb-wide">
        {t("settings.ml.startTraining.note")}
      </Typography>

      {!response && (
        <Button
          onClick={() => {
            onStartTraining(backend);
          }}
        >
          {t("settings.ml.startTraining.start")}
        </Button>
      )}

      {!!response && (
        <>
          <pre>{t("settings.ml.startTraining.requestSent")}</pre>
          <pre>
            {t("settings.ml.startTraining.response")}: {JSON.stringify(response, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
};
