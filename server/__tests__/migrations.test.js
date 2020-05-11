import clone from 'clone-deep';
import linkVendorsToTechnologies from '../bin_src/migrations/linkVendorsToTechnologies';

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

describe('linkVendorsToTechnologies', () => {
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
