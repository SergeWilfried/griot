const baseApiUrl = process.env.API_URL
  ? process.env.API_URL
  : "https://api.mongriot.com";

module.exports = {
  type: "custom",
  test: {
    headers: { Authorization: "Bearer {{bundle.authData.api_key}}" },
    removeMissingValuesFrom: { params: true },
    url: `${baseApiUrl}/api/external/me`,
  },
  connectionLabel: (z, bundle) => {
    const { email } = bundle.inputData;
    return `User: ${email}`;
  },
  fields: [
    {
      computed: false,
      key: "api_key",
      required: false,
      label: "Griot API Key",
      type: "password",
      helpText:
        "Your Griot API Key can be found here https://app.mongriot.com/account",
    },
  ],
  customConfig: {},
};
