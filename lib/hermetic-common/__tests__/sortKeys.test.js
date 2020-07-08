import VanillaJoi from 'joi';
import { pkExtension } from 'joi-key-extensions';
import sortKeys from '../src/sortKeys';

const Joi = VanillaJoi.extend(pkExtension.string);

const schema = Joi.object({
  a: Joi.array().items(Joi.object({
    a1: Joi.string(),
    a2: Joi.string().pk(),
    a3: Joi.number(),
  })),
  b: Joi.object({
    c: Joi.object({
      c1: Joi.number(),
      name: Joi.string(),
      c2: Joi.string(),
      c3: Joi.string().pk(),
    }),
  }),
});

describe('sortKeys', () => {
  it('sorts "name" to the top, then key fields then alpha order', () => {
    const sorter = sortKeys(schema);
    const source = ['a3', 'c2', 'c3', 'b', 'a', 'a2', 'c', 'name', 'c1', 'a1'];
    const actual = source.sort(sorter);
    const expected = ['name', 'a2', 'c3', 'a', 'a1', 'a3', 'b', 'c', 'c1', 'c2'];
    expect(actual).toMatchObject(expected);
  });
});
