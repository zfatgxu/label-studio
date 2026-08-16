import { Button, Select } from "@humansignal/ui";
import { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Form, Input, TextArea } from "../../components/Form";
import { RadioGroup } from "../../components/Form/Elements/RadioGroup/RadioGroup";
import { ProjectContext } from "../../providers/ProjectProvider";
import { cn } from "../../utils/bem";
import { FF_LSDV_E_297, isFF } from "../../utils/feature-flags";

export const GeneralSettings = () => {
  const { t } = useTranslation();
  const { project, fetchProject } = useContext(ProjectContext);

  const updateProject = useCallback(() => {
    if (project.id) fetchProject(project.id, true);
  }, [project]);

  const colors = ["#FDFDFC", "#FF4C25", "#FF750F", "#ECB800", "#9AC422", "#34988D", "#617ADA", "#CC6FBE"];

  const samplings = [
    {
      value: "Sequential",
      label: t("settings.sampling.sequential"),
      description: t("settings.sampling.sequentialDesc"),
    },
    {
      value: "Uniform",
      label: t("settings.sampling.random"),
      description: t("settings.sampling.randomDesc"),
    },
  ];

  return (
    <div className={cn("general-settings").toClassName()}>
      <div className={cn("general-settings").elem("wrapper").toClassName()}>
        <h1>{t("settings.general.title")}</h1>
        <div className={cn("settings-wrapper").toClassName()}>
          <Form action="updateProject" formData={{ ...project }} params={{ pk: project.id }} onSubmit={updateProject}>
            <Form.Row columnCount={1} rowGap="16px">
              <Input name="title" label={t("settings.fields.projectName")} />

              <TextArea name="description" label={t("settings.fields.description")} style={{ minHeight: 128 }} />
              {isFF(FF_LSDV_E_297) && (
                <div className={cn("workspace-placeholder").toClassName()}>
                  <Select placeholder={t("common.selectOption")} disabled options={[]} />
                </div>
              )}
              <RadioGroup name="color" label={t("settings.fields.color")} size="large" labelProps={{ size: "large" }}>
                {colors.map((color) => (
                  <RadioGroup.Button key={color} value={color}>
                    <div className={cn("color").toClassName()} style={{ "--background": color }} />
                  </RadioGroup.Button>
                ))}
              </RadioGroup>

              <RadioGroup label={t("settings.fields.sampling")} labelProps={{ size: "large" }} name="sampling" simple>
                {samplings.map(({ value, label, description }) => (
                  <RadioGroup.Button
                    key={value}
                    value={`${value} sampling`}
                    label={`${label} sampling`}
                    description={description}
                  />
                ))}
              </RadioGroup>
            </Form.Row>

            <Form.Actions>
              <Form.Indicator>
                <span case="success">{t("settings.saved")}</span>
              </Form.Indicator>
              <Button type="submit" className="w-[150px]" aria-label={t("settings.save")}>
                {t("settings.save")}
              </Button>
            </Form.Actions>
          </Form>
        </div>
      </div>
    </div>
  );
};

GeneralSettings.menuItem = "通用";
GeneralSettings.path = "/";
GeneralSettings.exact = true;
