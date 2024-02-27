import { prefixPluginTranslations } from "@strapi/helper-plugin";
import pluginPkg from "../../package.json";
import pluginId from "./pluginId";
import PluginIcon from "./components/PluginIcon";
import getTrad from "./utils/getTrad";

const name = pluginPkg.strapi.name;

export default {
  register(app) {
    app.customFields.register({
      name: "sortable-list",
      pluginId,
      type: "json",
      intlLabel: {
        id: getTrad("plugin.label"),
        defaultMessage: "Sortable List",
      },
      intlDescription: {
        id: getTrad("plugin.description"),
        defaultMessage: "Add multiple values to a sortable list",
      },
      icon: PluginIcon,
      components: {
        Input: async () =>
          import(
            /* webpackChunkName: "input-component" */ "./components/SortableList"
          ),
      },
      options: {
        advanced: [
          {
            intlLabel: {
              id: getTrad("options.advanced.regex"),
              defaultMessage: "RegExp pattern",
            },
            name: "options.inputRegex",
            type: "text",
            description: {
              id: getTrad("options.advanced.regex.description"),
              defaultMessage: "The text of the regular expression",
            },
          },
          {
            sectionTitle: {
              id: "global.settings",
              defaultMessage: "Settings",
            },
            items: [
              {
                name: "required",
                type: "checkbox",
                intlLabel: {
                  id: getTrad("options.advanced.requiredField"),
                  defaultMessage: "Required field",
                },
                description: {
                  id: getTrad("options.advanced.requiredField.description"),
                  defaultMessage:
                    "You won't be able to create an entry if this field is empty",
                },
              },
              {
                name: "private",
                type: "checkbox",
                intlLabel: {
                  id: getTrad("options.advanced.privateField"),
                  defaultMessage: "Private field",
                },
                description: {
                  id: getTrad("options.advanced.privateField.description"),
                  defaultMessage:
                    "This field will not show up in the API response",
                },
              },
            ],
          },
        ],
      },
    });
  },
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
