import VanillaJoi from 'joi';
import clone from 'clone-deep';
import buildCRUDRoutes from '../src/editor/buildCRUDRoutes';

const pkStringExtension = joi => ({
  name: 'string',
  base: joi.string(),
  // eslint-disable-next-line no-unused-vars
  rules: [
    {
      name: 'pk',
      params: {},
      // eslint-disable-next-line no-unused-vars
      validate: (params, value, state, prefs) => value,
    },
  ],
});

const Joi = VanillaJoi
  .extend(pkStringExtension);

const modelSchema = Joi.object({
  modelId: Joi.string().pk(),
  name: Joi.string().meta({ displayName: true }),
  sharedWith: Joi.array().optional()
    .items(Joi.object({
      makeId: Joi.string().pk(),
    })),
});

const makeSchema = Joi.object({
  makeId: Joi.string().pk(),
  name: Joi.string().meta({ displayName: true }),
  models: Joi.array().optional().items(modelSchema),
  baseCountry: Joi.string(),
  stringArray: Joi.array().optional().items(Joi.string()),
});

const schema = Joi.object({
  makes: Joi.array().items(makeSchema),
});

const data = {
  makes: [
    {
      makeId: 'mazda',
      name: 'Mazda',
      baseCountry: 'Japan',
      models: [
        { modelId: '323', name: '323' },
      ],
    },
    {
      makeId: 'ford',
      name: 'Ford',
      baseCountry: 'USA',
      models: [
        { modelId: 'sierra', name: 'Sierra' },
        { modelId: 'laser', name: 'Laser', sharedWith: [{ makeId: 'mazda' }] },
        { modelId: 'prefect', name: 'Prefect' },
      ],
    },
  ],
};

const getData = async () => clone(data);

const setData = jest.fn();

describe('buildCRUDRoutes', () => {
  it('returns an array', () => {
    const routes = buildCRUDRoutes(schema, '/api', getData, setData);
    expect(routes).toBeInstanceOf(Array);
  });
  it('has a route that returns a single item', () => {
    const routes = buildCRUDRoutes(schema, '/api', getData, setData);
    const route = routes.find(r => (r.method === 'GET')
      && (r.path === '/api/makes/{makeId}'));
    expect(route).toBeTruthy();
    expect(route.options).toBeTruthy();
    expect(route.options.validate).toBeTruthy();
    expect(route.options.validate.params).toBeTruthy();
    expect(route.options.validate.params.makeId).toBeTruthy();
    expect(route.options.validate.params.makeId.describe).toBeTruthy();
    const param = route.options.validate.params.makeId.describe();
    expect(param.type).toBe('string');
    expect(route.handler).toBeTruthy();
  });
  describe('single item handler', () => {
    const routes = buildCRUDRoutes(schema, '/api', getData, setData);
    const route = routes.find(r => (r.method === 'GET')
      && (r.path === '/api/makes/{makeId}'));
    it('returns a match', async () => {
      const request = {
        params: {
          makeId: 'ford',
        },
      };
      const result = await route.handler(request);
      const expected = clone(data.makes[1]);
      delete expected.models;
      expect(result).toEqual(expected);
    });
    it('returns Boom.notFound if no match', async () => {
      const request = {
        params: {
          makeId: 'subaru',
        },
      };
      const result = await route.handler(request);
      expect(result).toBeTruthy();
      expect(result.isBoom).toBeTruthy();
      expect(result.output.statusCode).toBe(404);
    });
  });
  describe('single item handler with multipart PK', () => {
    const multiPartSchema = Joi.object({
      items: Joi.array().items({
        key1: Joi.string().pk(),
        key2: Joi.string().optional().pk(),
      }),
    });
    const multiPartData = {
      items: [
        { key1: 'A', key2: 'B' },
        { key1: 'B' },
        { key1: 'B', key2: 'A' },
      ],
    };
    const routes = buildCRUDRoutes(
      multiPartSchema,
      '/api',
      async () => clone(multiPartData),
    );
    const route = routes.find(r => (r.method === 'GET')
      && (r.path === '/api/items/{key1}/{key2}'));
    it('has a matching route', () => {
      expect(route).toBeTruthy();
    });
    it('returns a match when both keys are set', async () => {
      const request = {
        params: {
          key1: 'B',
          key2: 'A',
        },
      };
      const result = await route.handler(request);
      expect(result).toEqual(multiPartData.items[2]);
    });
    it('returns a match when only one key is set', async () => {
      const request = {
        params: {
          key1: 'B',
          key2: 'null',
        },
      };
      const result = await route.handler(request);
      expect(result).toEqual(multiPartData.items[1]);
    });
  });
  it('has a route that returns a collection', () => {
    const routes = buildCRUDRoutes(schema, '/api', getData, setData);
    const route = routes.find(r => (r.method === 'GET')
      && (r.path === '/api/makes'));
    expect(route).toBeTruthy();
    expect(route.options).toBeTruthy();
    expect(route.options.validate).toBeTruthy();
    expect(route.options.validate.query).toBeTruthy();
    expect(route.options.validate.query.page).toBeTruthy();
    expect(route.options.validate.query.filter).toBeTruthy();
    expect(route.handler).toBeTruthy();
  });
  describe('collection handler', () => {
    const routes = buildCRUDRoutes(schema, '/api', getData, setData, 1);
    const route = routes.find(r => (r.method === 'GET')
      && (r.path === '/api/makes'));
    it('returns first page', async () => {
      const request = {
        query: {
        },
      };
      const result = await route.handler(request);
      expect(result).toMatchObject({
        count: 2,
        page: 1,
        totalPages: 2,
      });
      expect(result.items).toHaveLength(1);
      // makes[1] not [0] because sorted on name
      expect(result.items[0]).toEqual({ makeId: 'ford', name: 'Ford' });
      // should only return core fields
      expect(result.items[0].baseCountry).toBeFalsy();
    });
    it('returns second page', async () => {
      const request = {
        query: {
          page: 2,
        },
      };
      const result = await route.handler(request);
      expect(result).toMatchObject({
        count: 2,
        page: 2,
        totalPages: 2,
      });
      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toEqual({ makeId: 'mazda', name: 'Mazda' });
    });
    it('filters', async () => {
      const request = {
        query: {
          page: 1,
          filter: 'maz',
        },
      };
      const result = await route.handler(request);
      expect(result).toMatchObject({
        count: 1,
        page: 1,
        totalPages: 1,
      });
      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toEqual({ makeId: 'mazda', name: 'Mazda' });
    });
    it('returns full entities in summary when flagged', async () => {
      const fullSummarySchema = Joi.object({
        makes: Joi.array().items(makeSchema.meta({ fullEntityInSummary: true })),
      });
      const fullSummaryRoutes = buildCRUDRoutes(fullSummarySchema, '/api', getData, setData, 1);
      const fullSummaryRoute = fullSummaryRoutes.find(r => (r.method === 'GET')
        && (r.path === '/api/makes'));
      const request = {
        query: {
        },
      };
      const result = await fullSummaryRoute.handler(request);
      expect(result).toMatchObject({
        count: 2,
        page: 1,
        totalPages: 2,
      });
      expect(result.items).toHaveLength(1);
      // should include the baseCountry field as well as the core fields
      expect(result.items[0]).toEqual({ makeId: 'ford', name: 'Ford', baseCountry: 'USA' });
    });
  });
  it('has a route for updating a single item', () => {
    const routes = buildCRUDRoutes(schema, '/api', getData, setData);
    const route = routes.find(r => (r.method === 'PUT')
      && (r.path === '/api/makes/{makeId}'));
    expect(route).toBeTruthy();
    expect(route.options).toBeTruthy();
    expect(route.options.validate).toBeTruthy();
    expect(route.options.validate.params).toBeTruthy();
    expect(route.options.validate.params.makeId).toBeTruthy();
    expect(route.options.validate.params.makeId.describe).toBeTruthy();
    const param = route.options.validate.params.makeId.describe();
    expect(param.type).toBe('string');
    expect(route.handler).toBeTruthy();
  });
  describe('update single item handler', () => {
    const routes = buildCRUDRoutes(schema, '/api', getData, setData);
    const route = routes.find(r => (r.method === 'PUT')
      && (r.path === '/api/makes/{makeId}'));
    it('updates the data', async () => {
      const request = {
        params: {
          makeId: 'ford',
        },
        payload: {
          makeId: 'ford',
          name: 'Ford',
          baseCountry: 'Bahamas',
        },
      };
      const expected = clone(data);
      expected.makes[1].baseCountry = request.payload.baseCountry;
      setData.mockClear();
      await route.handler(request);
      expect(setData.mock.calls.length).toBe(1);
      expect(setData.mock.calls[0][0]).toEqual(expected);
    });
    it('ignores child object arrays', async () => {
      const request = {
        params: {
          makeId: 'ford',
        },
        payload: {
          makeId: 'ford',
          name: 'Ford',
          baseCountry: 'Bahamas',
          models: [
            { modelId: 'a' },
          ],
          stringArray: [
            'a', 'b',
          ],
        },
      };
      const expected = clone(data);
      expected.makes[1] = clone(request.payload);
      expected.makes[1].models = clone(data.makes[1].models);
      setData.mockClear();
      await route.handler(request);
      expect(setData.mock.calls.length).toBe(1);
      expect(setData.mock.calls[0][0]).toEqual(expected);
    });
    it('returns Boom.notFound if no match', async () => {
      const request = {
        params: {
          makeId: 'subaru',
        },
      };
      const result = await route.handler(request);
      expect(result).toBeTruthy();
      expect(result.isBoom).toBeTruthy();
      expect(result.output.statusCode).toBe(404);
    });
  });
  it('has a route for deleting a single item', () => {
    const routes = buildCRUDRoutes(schema, '/api', getData, setData);
    const route = routes.find(r => (r.method === 'DELETE')
      && (r.path === '/api/makes/{makeId}'));
    expect(route).toBeTruthy();
    expect(route.options).toBeTruthy();
    expect(route.options.validate).toBeTruthy();
    expect(route.options.validate.params).toBeTruthy();
    expect(route.options.validate.params.makeId).toBeTruthy();
    expect(route.options.validate.params.makeId.describe).toBeTruthy();
    const param = route.options.validate.params.makeId.describe();
    expect(param.type).toBe('string');
    expect(route.handler).toBeTruthy();
  });
  describe('delete single item handler', () => {
    const routes = buildCRUDRoutes(schema, '/api', getData, setData);
    const route = routes.find(r => (r.method === 'DELETE')
      && (r.path === '/api/makes/{makeId}'));
    it('updates the data', async () => {
      const request = {
        params: {
          makeId: 'ford',
        },
      };
      const expected = clone(data);
      expected.makes = expected.makes.filter(m => m.makeId !== 'ford');
      setData.mockClear();
      await route.handler(request);
      expect(setData.mock.calls.length).toBe(1);
      expect(setData.mock.calls[0][0]).toEqual(expected);
    });
    it('returns Boom.notFound if no match', async () => {
      const request = {
        params: {
          makeId: 'subaru',
        },
      };
      const result = await route.handler(request);
      expect(result).toBeTruthy();
      expect(result.isBoom).toBeTruthy();
      expect(result.output.statusCode).toBe(404);
    });
  });
  it('has a route for adding a single item', () => {
    const routes = buildCRUDRoutes(schema, '/api', getData, setData);
    const route = routes.find(r => (r.method === 'POST')
      && (r.path === '/api/makes'));
    expect(route).toBeTruthy();
    expect(route.handler).toBeTruthy();
  });
  describe('add single item handler', () => {
    it('updates the data', async () => {
      const routes = buildCRUDRoutes(schema, '/api', getData, setData);
      const route = routes.find(r => (r.method === 'POST')
        && (r.path === '/api/makes'));
      const request = {
        payload: {
          makeId: 'kia',
          name: 'Kia',
          baseCountry: 'Korea',
        },
      };
      const expected = clone(data);
      expected.makes.push(request.payload);
      expected.makes[2].models = [];
      setData.mockClear();
      await route.handler(request);
      expect(setData.mock.calls.length).toBe(1);
      expect(setData.mock.calls[0][0]).toEqual(expected);
    });
    it('ignores child object arrays', async () => {
      const routes = buildCRUDRoutes(schema, '/api', getData, setData);
      const route = routes.find(r => (r.method === 'POST')
        && (r.path === '/api/makes'));
      const request = {
        payload: {
          makeId: 'kia',
          name: 'Kia',
          baseCountry: 'Korea',
          stringArray: ['a'],
          models: [{ modelId: 'sorento' }],
        },
      };
      const expected = clone(data);
      expected.makes.push(clone(request.payload));
      expected.makes[2].models = [];
      setData.mockClear();
      await route.handler(request);
      expect(setData.mock.calls.length).toBe(1);
      expect(setData.mock.calls[0][0]).toEqual(expected);
    });
    it('adds a new parent array when needed', async () => {
      const getEmptyData = () => ({});
      const routes = buildCRUDRoutes(schema, '/api', getEmptyData, setData);
      const route = routes.find(r => (r.method === 'POST')
        && (r.path === '/api/makes'));
      const request = {
        payload: {
          makeId: 'kia',
          name: 'Kia',
          baseCountry: 'Korea',
        },
      };
      const expected = {
        makes: [{
          makeId: 'kia',
          name: 'Kia',
          baseCountry: 'Korea',
          models: [],
        }],
      };
      setData.mockClear();
      await route.handler(request);
      expect(setData.mock.calls.length).toBe(1);
      expect(setData.mock.calls[0][0]).toEqual(expected);
    });
  });
  it('has a route that returns children of a single item', () => {
    const routes = buildCRUDRoutes(schema, '/api', getData, setData);
    const route = routes.find(r => (r.method === 'GET')
      && (r.path === '/api/makes/{makeId}/models'));
    expect(route).toBeTruthy();
    expect(route.options).toBeTruthy();
    expect(route.options.validate).toBeTruthy();
    expect(route.options.validate.params).toBeTruthy();
    expect(route.options.validate.params.makeId).toBeTruthy();
    expect(route.options.validate.params.makeId.describe).toBeTruthy();
    const param = route.options.validate.params.makeId.describe();
    expect(param.type).toBe('string');
    expect(route.handler).toBeTruthy();
  });
  describe('children of item handler', () => {
    const routes = buildCRUDRoutes(schema, '/api', getData, setData, 1);
    const route = routes.find(r => (r.method === 'GET')
      && (r.path === '/api/makes/{makeId}/models'));
    it('returns empty page if no match on parent', async () => {
      const request = {
        params: {
          makeId: 'subaru',
        },
        query: {},
      };
      const result = await route.handler(request);
      expect(result).toBeTruthy();
      expect(result.items).toHaveLength(0);
    });
    it('returns children', async () => {
      const request = {
        params: {
          makeId: 'ford',
        },
        query: {},
      };
      const result = await route.handler(request);
      expect(result).toMatchObject({
        count: 3,
        page: 1,
        totalPages: 3,
      });
      expect(result.items).toHaveLength(1);
      // [1] not [0] because sorted on name
      expect(result.items[0]).toEqual({ modelId: 'laser', name: 'Laser' });
    });
  });
  describe('child of item handler', () => {
    const routes = buildCRUDRoutes(schema, '/api', getData, setData, 1);
    const route = routes.find(r => (r.method === 'GET')
      && (r.path === '/api/makes/{makeId}/models/{modelId}'));
    expect(route).toBeTruthy();
    it('returns child', async () => {
      const request = {
        params: {
          makeId: 'ford',
          modelId: 'laser',
        },
        query: {},
      };
      const result = await route.handler(request);
      expect(result).toMatchObject({ modelId: 'laser', name: 'Laser' });
    });
  });
  describe('grandchild of item handler', () => {
    const routes = buildCRUDRoutes(schema, '/api', getData, setData, 1);
    const route = routes.find(r => (r.method === 'GET')
      && (r.path === '/api/makes/{makeId}/models/{modelId}/sharedWith/{sharedWith_makeId}'));
    expect(route).toBeTruthy();
    expect(route.options.validate).toBeTruthy();
    expect(route.options.validate.params).toBeTruthy();
    expect(route.options.validate.params.makeId).toBeTruthy();
    expect(route.options.validate.params.modelId).toBeTruthy();
    expect(route.options.validate.params.sharedWith_makeId).toBeTruthy();
    it('returns grandchild', async () => {
      const request = {
        params: {
          makeId: 'ford',
          modelId: 'laser',
          sharedWith_makeId: 'mazda',
        },
        query: {},
      };
      const result = await route.handler(request);
      expect(result).toMatchObject({ makeId: 'mazda' });
    });
  });
});
