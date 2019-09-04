/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
const normaliseComponents = (data) => {
  console.log('Migration: normaliseComponents');
  const componentsToChange = data.components && data.components
    .filter(c => c.interfaces && c.interfaces
      .some(i => i.interfaceId.startsWith(`${c.componentId}.`)));
  if (componentsToChange && componentsToChange.length) {
    console.log('Migration required');
    componentsToChange.forEach((c) => {
      c.interfaces
        .filter(i => i.interfaceId.startsWith(`${c.componentId}.`))
        .forEach((i) => {
          const oldInterfaceId = i.interfaceId;
          const newInterfaceId = i.interfaceId.replace(`${c.componentId}.`, '');
          i.interfaceId = newInterfaceId;
          (data.componentConnections || [])
            .filter(cc => cc.toInterfaceId === oldInterfaceId)
            .forEach((cc) => {
              cc.toInterfaceId = newInterfaceId;
            });
        });
    });
  }
};
export default normaliseComponents;
