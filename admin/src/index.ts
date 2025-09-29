import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';

export default {
  register(app: any) {
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });
    app.customFields.register({
      name: 'sortable-list',
      pluginId: PLUGIN_ID,
      type: 'json',
      intlLabel: {
        id: `${PLUGIN_ID}.sortable-list.label`,
        defaultMessage: 'Sortable List',
      },
      intlDescription: {
        id: `${PLUGIN_ID}.sortable-list.description`,
        defaultMessage: 'Add multiple values to a sortable list',
      },
      icon: PluginIcon,
      components: {
        Input: async () =>
          import('./components/SortableInput').then((module) => ({
            default: module.default,
          })),
      },
      options: {
        advanced: [
          {
            intlLabel: {
              id: `${PLUGIN_ID}.options.advanced.regex`,
              defaultMessage: 'RegExp pattern',
            },
            name: 'options.inputRegex',
            type: 'text',
            description: {
              id: `${PLUGIN_ID}.options.advanced.regex.description`,
              defaultMessage: 'Provide a regular expression to validate the value against',
            },
          },
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id: `${PLUGIN_ID}.options.advanced.requiredField`,
                  defaultMessage: 'Required field',
                },
                description: {
                  id: `${PLUGIN_ID}.options.advanced.requiredField.description`,
                  defaultMessage: "You won't be able to create an entry if this field is empty",
                },
              },
              {
                name: 'private',
                type: 'checkbox',
                intlLabel: {
                  id: `${PLUGIN_ID}.options.advanced.privateField`,
                  defaultMessage: 'Private field',
                },
                description: {
                  id: `${PLUGIN_ID}.options.advanced.privateField.description`,
                  defaultMessage: 'This field will not show up in the API response',
                },
              },
            ],
          },
        ],
      },
    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);

          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
