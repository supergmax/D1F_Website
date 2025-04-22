import type { Schema, Struct } from '@strapi/strapi';

export interface TestDataCategoryDataTest extends Struct.ComponentSchema {
  collectionName: 'components_test_data_category_data_tests';
  info: {
    displayName: 'data_test';
    icon: 'code';
  };
  attributes: {
    date: Schema.Attribute.Date;
    users: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    users_accounts: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    value: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'test-data-category.data-test': TestDataCategoryDataTest;
    }
  }
}
