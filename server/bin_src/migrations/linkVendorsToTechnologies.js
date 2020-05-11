/* This migration assumes you have an existing set of vendor entities defined
and some technologies which have the vendor name in the technology name.
It will link those technologies to the relevant vendors and remove the vendor name
from the technology name */

/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
const linkVendorToTechnologies = (data) => {
  console.log('Migration: linkVendorToTechnologies');
  const technologiesToChange = data && data.vendors && data.vendors.length
    && data.technologies
      .filter(t => (!t.vendorId) && data.vendors.some(v => t.name.startsWith(`${v.name} `)));
  if (technologiesToChange && technologiesToChange.length) {
    console.log('Migration required');
    technologiesToChange.forEach((t) => {
      const vendor = data.vendors.find(v => t.name.startsWith(`${v.name} `));
      t.vendorId = vendor.vendorId;
      t.name = t.name.substring(vendor.name.length + 1);
    });
  }
};
export default linkVendorToTechnologies;
