import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAPI } from "../../../providers/ApiProvider";
import { Select } from "../../../components/Form";
import { ProjectContext } from "../../../providers/ProjectProvider";

export const ModelVersionSelector = ({
  name = "model_version",
  valueName = "model_version",
  apiName = "projectModelVersions",
  ...props
}) => {
  const { t } = useTranslation();
  const api = useAPI();
  const { project } = useContext(ProjectContext);
  const [loading, setLoading] = useState(true);
  const [versions, setVersions] = useState([]);
  const [models, setModels] = useState([]);
  const [version, setVersion] = useState(null);
  const [placeholder, setPlaceholder] = useState("");

  useEffect(() => {
    setVersion(project?.[valueName] || null);
  }, [project?.[valueName], versions]);

  const fetchMLVersions = useCallback(async () => {
    const pk = project?.id;

    if (!pk) return;

    const modelVersions = await api.callApi(apiName, {
      params: {
        pk,
        extended: true,
        include_live_models: true,
      },
    });

    if (modelVersions?.live?.length > 0) {
      const liveModels = modelVersions.live.map((item) => {
        const label = t("settings.annotation.modelVersion.liveLabel", {
          title: item.title,
          state: item.readable_state,
        });

        return {
          group: t("settings.annotation.modelVersion.modelsGroup"),
          value: item.title,
          label,
        };
      });

      setModels(liveModels);
    }

    if (modelVersions?.static?.length > 0) {
      const staticModels = modelVersions.static.map((item) => {
        const label = t("settings.annotation.modelVersion.staticLabel", {
          version: item.model_version,
          count: item.count,
        });

        return {
          group: t("settings.annotation.modelVersion.predictionsGroup"),
          value: item.model_version,
          label,
        };
      });

      setVersions(staticModels);
    }

    if (!modelVersions?.static?.length && !modelVersions?.live?.length) {
      setPlaceholder(t("settings.annotation.modelVersion.noOptions"));
    }

    setLoading(false);
  }, [project?.id, apiName]);

  useEffect(() => {
    fetchMLVersions();
  }, [fetchMLVersions]);

  return (
    <div>
      <label>{t("settings.annotation.modelVersion.label")}</label>
      <div style={{ display: "flex", alignItems: "center", width: 400 }}>
        <div style={{ flex: 1, paddingRight: 16 }}>
          <Select
            name={name}
            disabled={!versions.length && !models.length}
            value={version}
            onChange={setVersion}
            options={[...models, ...versions]}
            placeholder={placeholder || t("settings.annotation.modelVersion.placeholder")}
            isInProgress={loading}
            {...props}
          />
        </div>
      </div>
    </div>
  );
};
