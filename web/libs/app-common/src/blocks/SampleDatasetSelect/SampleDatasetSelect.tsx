import { Select } from "@humansignal/ui";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

type Sample = {
  title: string;
  url: string;
  description: string;
};

export function SampleDatasetSelect({
  samples,
  sample,
  onSampleApplied,
}: {
  samples: Sample[];
  sample?: Sample;
  onSampleApplied: (sample?: Sample) => void;
}) {
  const { t } = useTranslation();

  const onSelect = useCallback(
    (value: string) => {
      if ("__lsa" in window) {
        __lsa("sample.select", { dataset: value });
      }
      onSampleApplied(samples.find((s) => s.url === value));
    },
    [samples, onSampleApplied],
  );

  const options = useMemo(() => {
    return samples.map((sample) => ({
      value: sample.url,
      label: (
        <div className="flex flex-col">
          <div className="font-bold">{t(sample.title)}</div>
          <div className="mt-2">{t(sample.description)}</div>
        </div>
      ),
    }));
  }, [samples, t]);
  const onClick = () => {
    if ("__lsa" in window) {
      __lsa("sample.open");
    }
  };

  const selectedValueRenderer = useCallback(
    (option: any) => {
      const found = samples.find((o) => o.url === option.value);
      return found ? t(found.title) : option?.label;
    },
    [samples, t],
  );

  return (
    <div className="flex gap-3 items-center">
      <span className="text-neutral-content-subtler">{t("dataImport.sampleDatasets.orUseSample")}</span>
      <Select
        value={sample?.url ?? undefined}
        placeholder={t("dataImport.sampleDatasets.selectSample")}
        onChange={onSelect}
        triggerProps={{ onClick }}
        options={options}
        selectedValueRenderer={selectedValueRenderer}
      />
    </div>
  );
}
