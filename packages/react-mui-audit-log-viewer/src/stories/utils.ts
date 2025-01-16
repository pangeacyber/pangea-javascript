/**
 * Provided optional storybook environment variables for testing AuditLogViewer dynamically retrieving a configured Audit schema directly from Pangea.
 *
 * The AuditLogViewer will default columns to the standard Audit schema, but if you configuration is using custom fields or using a template other than the default standard,
 * then you will want to update the schema used by the component. This can be achieved by either passing in your schema through the `schema` prop,
 * or by providing client-safe settings to allow the component to fetch your custom Audit schema.
 *
 * The `config` prop is an important prop to the AuditLogViewer, by providing the component with your Pangea project: domain; client_token; and audit config id; it allows the component
 *  to directly hit the `/v1/schema` endpoint, a READ-ONLY endpoint that returns your Audit configuration specific schema. The AuditLogViewer will default columns to the standard
 *  Audit schema, but if you configuration is using custom fields or using a template other than the default standard, then you will want to update the schema used by the component.
 *
 * Note: The project Client Token is a Pangea service token, with very limited access for what endpoints it can leverage, since the expectation is this token will be embed into your application
 *  client. It is copyable from the Secure Audit Log service overview dashboard.
 *
 */

const DOMAIN: string = import.meta.env.STORYBOOK_SERVICE_DOMAIN ?? "";
const PROJECT_CLIENT_TOKEN: string =
  import.meta.env.STORYBOOK_CLIENT_TOKEN ?? "";
const AUDIT_CONFIG_ID: string = import.meta.env.STORYBOOK_CONFIG_ID ?? "";

export const getConfigProps = () =>
  !!DOMAIN && !!PROJECT_CLIENT_TOKEN && !!AUDIT_CONFIG_ID
    ? {
        config: {
          domain: DOMAIN,
          clientToken: PROJECT_CLIENT_TOKEN,
          configId: AUDIT_CONFIG_ID,
        },
      }
    : {};
