"use strict";

module.exports = ({ strapi }) => {
  strapi.customFields.register({
    name: "sortable-list",
    plugin: "strapi-plugin-sortable-list",
    type: "json",
    inputSize: {
      default: 6,
      isResizable: true,
    },
  });
};
