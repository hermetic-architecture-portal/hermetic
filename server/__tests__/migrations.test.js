import clone from 'clone-deep';
import linkVendorsToTechnologies from '../bin_src/migrations/linkVendorsToTechnologies';
import listBasedCategories from '../bin_src/migrations/listBasedCategories';

describe('linkVendorsToTechnologies', () => {
  const data = {
    vendors: [
      { vendorId: 'redhat', name: 'Red Hat' },
      { vendorId: 'canonical', name: 'Canonical' },
    ],
    technologies: [
      { technologyId: 'ubuntu', name: 'Ubuntu' },
      { technologyId: 'rhel', name: 'Red Hat Enterprise Linux' },
      { technologyId: 'ubuntuserver', name: 'Canonical Ubuntu Server', vendorId: 'canonical' },
    ],
  };

  const testData = clone(data);
  linkVendorsToTechnologies(testData);
  it('links technologies to vendors on name match', () => {
    expect(testData.technologies[1].name).toEqual('Enterprise Linux');
    expect(testData.technologies[1].vendorId).toEqual('redhat');
  });
  it('does nothing on no match', () => {
    expect(testData.technologies[0].name).toEqual('Ubuntu');
    expect(testData.technologies[0].vendorId).toBeFalsy();
  });
  it('does nothing on name match where vendor id is already set', () => {
    expect(testData.technologies[2].name).toEqual('Canonical Ubuntu Server');
    expect(testData.technologies[2].vendorId).toEqual('canonical');
  });
});

describe('listBasedCategories', () => {
  const data = {
    technologies: [
      { technologyId: '1', category: 'a' },
      { technologyId: '2', category: 'A' },
      { technologyId: '3', category: 'B' },
      { technologyId: '4' },
      { technologyId: '5', category: '' },
    ],
  };

  const testData = clone(data);
  listBasedCategories(testData);
  it('removes old category field', () => {
    testData.technologies.forEach(t => expect(typeof t.category).toEqual('undefined'));
  });
  it('sets new category field', () => {
    expect(testData.technologies[0].technologyCategoryId).toEqual('a');
    expect(testData.technologies[1].technologyCategoryId).toEqual('a');
    expect(testData.technologies[2].technologyCategoryId).toEqual('b');
    expect(typeof testData.technologies[3].technologyCategoryId).toEqual('undefined');
    expect(typeof testData.technologies[4].technologyCategoryId).toEqual('undefined');
  });
  it('creates the technologyCategories list', () => {
    expect(testData.technologyCategories).toMatchObject([
      { technologyCategoryId: 'a', name: 'a' },
      { technologyCategoryId: 'b', name: 'B' },
    ]);
  });
});
