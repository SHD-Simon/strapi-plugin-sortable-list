import type { Core } from '@strapi/strapi';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.customFields.register({
    name: 'sortable-list',
    plugin: 'strapi-plugin-sortable-list',
    type: 'json',
    inputSize: {
      default: 6,
      isResizable: true,
    },
  });
};

export default register;
