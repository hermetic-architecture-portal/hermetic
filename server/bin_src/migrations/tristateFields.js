/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
const tristateFields = (data) => {
  console.log('Migration: tristateFields');
  const technologiesToChange = data && data.technologies
    .filter(t => (
      (typeof t.hasPrivateData === 'boolean')
      || (typeof t.gdprAssessed === 'boolean')
      || (typeof t.cloudRiskAssessed === 'boolean')
    ));
  if (technologiesToChange && technologiesToChange.length) {
    console.log('Migration required');
    technologiesToChange.forEach((t) => {
      if (typeof t.hasPrivateData === 'boolean') {
        t.hasPrivateData = t.hasPrivateData ? 'Yes' : 'No';
      }
      if (typeof t.gdprAssessed === 'boolean') {
        t.gdprAssessed = t.gdprAssessed ? 'Yes' : 'No';
      }
      if (typeof t.cloudRiskAssessed === 'boolean') {
        t.cloudRiskAssessed = t.cloudRiskAssessed ? 'Yes' : 'No';
      }
    });
  }
};
export default tristateFields;
