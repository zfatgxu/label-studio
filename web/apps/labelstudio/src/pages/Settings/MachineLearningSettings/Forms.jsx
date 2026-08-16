import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@humansignal/ui";
import { ErrorWrapper } from "../../../components/Error/Error";
import { InlineError } from "../../../components/Error/InlineError";
import { Form, Input, Select, TextArea, Toggle } from "../../../components/Form";
import "./MachineLearningSettings.scss";

const CustomBackendForm = ({ action, backend, project, onSubmit }) => {
  const { t } = useTranslation();
  const [selectedAuthMethod, setAuthMethod] = useState("NONE");
  const [, setMLError] = useState();

  return (
    <Form
      action={action}
      formData={{ ...(backend ?? {}) }}
      params={{ pk: backend?.id }}
      onSubmit={async (response) => {
        if (!response.error_message) {
          onSubmit(response);
        }
      }}
    >
      <Input type="hidden" name="project" value={project.id} />

      <Form.Row columnCount={1}>
        <Input
          name="title"
          label={t("settings.ml.form.name")}
          placeholder={t("settings.ml.form.namePlaceholder")}
          required
        />
      </Form.Row>

      <Form.Row columnCount={1}>
        <Input name="url" label={t("settings.ml.form.backendUrl")} required />
      </Form.Row>

      <Form.Row columnCount={2}>
        <Select
          name="auth_method"
          label={t("settings.ml.form.authMethod")}
          options={[
            { label: t("settings.ml.form.authNone"), value: "NONE" },
            { label: t("settings.ml.form.authBasic"), value: "BASIC_AUTH" },
          ]}
          value={selectedAuthMethod}
          onChange={setAuthMethod}
        />
      </Form.Row>

      {(backend?.auth_method === "BASIC_AUTH" || selectedAuthMethod === "BASIC_AUTH") && (
        <Form.Row columnCount={2}>
          <Input name="basic_auth_user" label={t("settings.ml.form.basicAuthUser")} />
          {backend?.basic_auth_pass_is_set ? (
            <Input
              name="basic_auth_pass"
              label={t("settings.ml.form.basicAuthPass")}
              type="password"
              placeholder="********"
            />
          ) : (
            <Input name="basic_auth_pass" label={t("settings.ml.form.basicAuthPass")} type="password" />
          )}
        </Form.Row>
      )}

      <Form.Row columnCount={1}>
        <TextArea name="extra_params" label={t("settings.ml.form.extraParams")} style={{ minHeight: 120 }} />
      </Form.Row>

      <Form.Row columnCount={1}>
        <Toggle
          name="is_interactive"
          label={t("settings.ml.form.interactivePreannotations")}
          description={t("settings.ml.form.interactivePreannotationsDesc")}
        />
      </Form.Row>

      <Form.Actions>
        <Button
          type="submit"
          look="primary"
          onClick={() => setMLError(null)}
          aria-label={t("settings.ml.form.saveFormAria")}
        >
          {t("settings.ml.form.validateAndSave")}
        </Button>
      </Form.Actions>

      <Form.ResponseParser>
        {(response) => (
          <>
            {response.error_message && (
              <ErrorWrapper
                error={{
                  response: {
                    detail: backend ? t("settings.ml.form.errorSave") : t("settings.ml.form.errorAdd"),
                    exc_info: response.error_message,
                  },
                }}
              />
            )}
          </>
        )}
      </Form.ResponseParser>

      <InlineError />
    </Form>
  );
};

export { CustomBackendForm };
