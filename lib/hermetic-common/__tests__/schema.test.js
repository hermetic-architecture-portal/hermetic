import Joi from 'joi';
import schema from '../src/schema';

const getBaseData = () => ({
  networkNodes: [
    {
      nodeId: 'a',
      isAbstractNode: false,
      environmentId: 'e1',
      locationId: 'l1',
    },
  ],
  deploymentEnvironments: [
    { environmentId: 'e1', name: 'env one' },
  ],
  networkLocations: [
    { locationId: 'l1', name: 'loc one' },
  ],
});

describe('schema', () => {
  describe('networkNodeSchema', () => {
    it('accepts good data', () => {
      const data = getBaseData();
      const result = Joi.validate(data, schema,
        { context: { data, schema } });
      expect(result.error).toBeFalsy();
    });

    it('requires locationId when isAbstractNode', () => {
      const data = getBaseData();
      data.networkNodes[0].isAbstractNode = true;
      delete data.networkNodes[0].locationId;
      const result = Joi.validate(data, schema,
        { context: { data, schema } });
      expect(result.error).toBeTruthy();
      expect(result.error.details).toHaveLength(1);
      expect(result.error.details[0]).toMatchObject({
        type: 'any.required',
        context: {
          key: 'locationId',
        },
      });
    });

    it('does not require locationId when not isAbstractNode', () => {
      const data = getBaseData();
      data.networkNodes[0].isAbstractNode = false;
      delete data.networkNodes[0].locationId;
      const result = Joi.validate(data, schema,
        { context: { data, schema } });
      expect(result.error).toBeFalsy();
    });

    it('permits locationId when not isAbstractNode', () => {
      const data = getBaseData();
      data.networkNodes[0].isAbstractNode = false;
      data.networkNodes[0].locationId = 'l1';
      const result = Joi.validate(data, schema,
        { context: { data, schema } });
      expect(result.error).toBeFalsy();
    });

    it('rejects bad locationId', () => {
      const data = getBaseData();
      data.networkNodes[0].isAbstractNode = true;
      data.networkNodes[0].locationId = 'nowhere';
      const result = Joi.validate(data, schema,
        { context: { data, schema } });
      expect(result.error).toBeTruthy();
      expect(result.error.details).toHaveLength(1);
      expect(result.error.details[0]).toMatchObject({
        type: 'string.fkNotFound',
        context: {
          key: 'locationId',
        },
      });
    });

    it('prohibits environmentId when isAbstractNode', () => {
      const data = getBaseData();
      data.networkNodes[0].isAbstractNode = true;
      data.networkNodes[0].locationId = 'l1';
      const result = Joi.validate(data, schema,
        { context: { data, schema } });
      expect(result.error).toBeTruthy();
      expect(result.error.details).toHaveLength(1);
      expect(result.error.details[0]).toMatchObject({
        type: 'any.unknown',
        context: {
          key: 'environmentId',
        },
      });
    });

    it('requires environmentId when not isAbstractNode', () => {
      const data = getBaseData();
      data.networkNodes[0].isAbstractNode = false;
      delete data.networkNodes[0].environmentId;
      const result = Joi.validate(data, schema,
        { context: { data, schema } });
      expect(result.error).toBeTruthy();
      expect(result.error.details).toHaveLength(1);
      expect(result.error.details[0]).toMatchObject({
        type: 'any.required',
        context: {
          key: 'environmentId',
        },
      });
    });
  });
  describe('componentConnectionSchema', () => {
    // reproducing a bug...
    const data = {
      components: [
        {
          componentId: 'cA',
        },
        {
          componentId: 'cB',
          interfaces: [
            { interfaceId: 'iB' },
          ],
        },
      ],
      componentConnections: [
        {
          fromComponentId: 'cA',
          toComponentId: 'cB',
          toInterfaceId: 'iB',
        },
      ],
    };
    // eslint-disable-next-line no-underscore-dangle
    const partSchema = schema._inner.children.find(c => c.key === 'componentConnections')
      .schema._inner.items[0];
    const result = Joi.validate(data.componentConnections[0], partSchema,
      { context: { data, schema } });
    expect(result.error).toBeFalsy();
  });
});
