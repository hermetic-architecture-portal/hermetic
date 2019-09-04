import React from 'react'; // eslint-disable-line no-unused-vars

const extensionFields = ({ entity }) => {
  if (!(entity && entity.extensionFields)) {
    return null;
  }
  const fieldValues = Object.getOwnPropertyNames(entity.extensionFields)
    .map(displayName => <div key={displayName} className="Data-row">
      <div>{displayName}</div>
      <div>{entity.extensionFields[displayName]}</div>
    </div>);
  return <div>
    {fieldValues}
  </div>;
};

export default extensionFields;
