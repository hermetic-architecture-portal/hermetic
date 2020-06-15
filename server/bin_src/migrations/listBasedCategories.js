/* This migration takes the values from the free-text 'technology.category'
field and converts it into an ID based field linked to the technologyCategories list */

/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
const listBasedCategories = (data) => {
  console.log('Migration: listBasedCategories');
  const technologiesToChange = data && data.technologies
    && !data.technologyCategories
    && data.technologies
      .filter(t => typeof t.category !== 'undefined');
  if (technologiesToChange && technologiesToChange.length) {
    console.log('Migration required');
    data.technologyCategories = [];
    technologiesToChange.forEach((t) => {
      if (t.category) {
        let category = data.technologyCategories
          .find(c => c.technologyCategoryId.toLowerCase().trim()
            === t.category.toLowerCase().trim());
        if (!category) {
          category = {
            technologyCategoryId: t.category.toLowerCase().trim(),
            name: t.category,
          };
          data.technologyCategories.push(category);
        }
        t.technologyCategoryId = category.technologyCategoryId;
      }
      delete t.category;
    });
  }
};
export default listBasedCategories;
