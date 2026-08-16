import {
  Button,
  EmptyState,
  IconCloudCustom,
  IconCloudProviderAzure,
  IconCloudProviderGCS,
  IconCloudProviderRedis,
  IconCloudProviderS3,
  SimpleCard,
  Spinner,
  Tooltip,
  Typography,
} from "@humansignal/ui";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { useUpdatePageTitle, createTitleFromSegments } from "@humansignal/core";
import { useProject } from "../../../providers/ProjectProvider";
import { cn } from "../../../utils/bem";
import { StorageSet } from "./StorageSet";
import { useStorageCard } from "./hooks/useStorageCard";
import "./StorageSettings.scss";

export const StorageSettings = () => {
  const { t } = useTranslation();
  const { project } = useProject();
  const rootClass = cn("storage-settings"); // TODO: Remove in the next BEM cleanup
  const history = useHistory();
  const location = useLocation();
  const sourceStorageRef = useRef();
  const targetStorageRef = useRef();

  useUpdatePageTitle(createTitleFromSegments([project?.title, t("settings.storage.title")]));

  // Fetch storage data at parent level
  const sourceStorage = useStorageCard("", project?.id);
  const targetStorage = useStorageCard("export", project?.id);

  // Check if any storages exist
  const hasAnyStorages = sourceStorage.storages?.length > 0 || targetStorage.storages?.length > 0;
  const isLoading = sourceStorage.loading || targetStorage.loading;
  const isLoaded = sourceStorage.loaded && targetStorage.loaded;

  // Handle auto-open query parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get("open") === "source" && isLoaded) {
      // Auto-trigger "Add Source Storage" modal
      setTimeout(() => {
        sourceStorageRef.current?.openAddModal();
      }, 100); // Small delay to ensure component is mounted

      // Clean URL by removing the query parameter
      history.replace(location.pathname);
    }
  }, [location, history, isLoaded]);

  return (
    <section className="max-w-[680px]">
      <Typography variant="headline" size="medium" className="mb-base">
        {t("settings.storage.heading")}
      </Typography>
      {hasAnyStorages && (
        <Typography size="small" className="text-neutral-content-subtler mb-wider">
          {t("settings.storage.description")}
        </Typography>
      )}

      {isLoading && !isLoaded && (
        <div className="flex items-center justify-center h-[50rem]">
          <Spinner />
        </div>
      )}

      {/* Always render StorageSet components (hidden when showing EmptyState) so refs are populated */}
      <div className={!hasAnyStorages && isLoaded ? "hidden" : ""}>
        <div className="grid grid-cols-2 gap-8">
          <StorageSet
            ref={sourceStorageRef}
            title={t("settings.storage.sourceTitle")}
            buttonLabel={t("settings.storage.addSource")}
            rootClass={rootClass}
            storageTypes={sourceStorage.storageTypes}
            storages={sourceStorage.storages}
            storagesLoaded={sourceStorage.storagesLoaded}
            loading={sourceStorage.loading}
            loaded={sourceStorage.loaded}
            fetchStorages={sourceStorage.fetchStorages}
          />

          <StorageSet
            ref={targetStorageRef}
            title={t("settings.storage.targetTitle")}
            target="export"
            buttonLabel={t("settings.storage.addTarget")}
            rootClass={rootClass}
            storageTypes={targetStorage.storageTypes}
            storages={targetStorage.storages}
            storagesLoaded={targetStorage.storagesLoaded}
            loading={targetStorage.loading}
            loaded={targetStorage.loaded}
            fetchStorages={targetStorage.fetchStorages}
          />
        </div>
      </div>

      {/* Show EmptyState when no storages exist */}
      {!hasAnyStorages && isLoaded && !isLoading && (
        <SimpleCard title="" className="bg-primary-background border-primary-border-subtler p-base">
          <EmptyState
            size="medium"
            variant="primary"
            icon={<IconCloudCustom />}
            title={t("settings.storage.emptyTitle")}
            description={t("settings.storage.description")}
            additionalContent={
              <div className="flex items-center justify-center gap-base" data-testid="dm-storage-provider-icons">
                <Tooltip title={t("settings.storage.s3")}>
                  <div className="flex items-center justify-center p-2" aria-label={t("settings.storage.s3")}>
                    <IconCloudProviderS3 width={32} height={32} className="text-neutral-content-subtler" />
                  </div>
                </Tooltip>
                <Tooltip title={t("settings.storage.gcs")}>
                  <div className="flex items-center justify-center p-2" aria-label={t("settings.storage.gcs")}>
                    <IconCloudProviderGCS width={32} height={32} className="text-neutral-content-subtler" />
                  </div>
                </Tooltip>
                <Tooltip title={t("settings.storage.azure")}>
                  <div className="flex items-center justify-center p-2" aria-label={t("settings.storage.azure")}>
                    <IconCloudProviderAzure width={32} height={32} className="text-neutral-content-subtler" />
                  </div>
                </Tooltip>
                <Tooltip title={t("settings.storage.redis")}>
                  <div className="flex items-center justify-center p-2" aria-label={t("settings.storage.redis")}>
                    <IconCloudProviderRedis width={32} height={32} className="text-neutral-content-subtler" />
                  </div>
                </Tooltip>
              </div>
            }
            actions={
              <div className="flex gap-base">
                <Button
                  look="primary"
                  data-testid="add-source-storage-button-empty-state"
                  aria-label={t("settings.storage.addSource")}
                  onClick={() => sourceStorageRef.current?.openAddModal()}
                >
                  {t("settings.storage.addSource")}
                </Button>
                <Button
                  look="primary"
                  data-testid="add-target-storage-button-empty-state"
                  aria-label={t("settings.storage.addTarget")}
                  onClick={() => targetStorageRef.current?.openAddModal()}
                >
                  {t("settings.storage.addTarget")}
                </Button>
              </div>
            }
            footer={
              !window.APP_SETTINGS?.whitelabel_is_active && (
                <Typography variant="label" size="small" className="text-primary-link">
                  {t("settings.storage.learnMore")}
                </Typography>
              )
            }
          />
        </SimpleCard>
      )}
    </section>
  );
};

StorageSettings.title = "云存储";
StorageSettings.path = "/storage";
