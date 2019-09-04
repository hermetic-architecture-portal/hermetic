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
      c2: Joi.string(),
      c3: Joi.string().pk(),
    }),
  }),
});

describe('sortKeys', () => {
  it('sorts key fields to the top', () => {
    const sorter = sortKeys(schema);
    expect(sorter('a2', 'a1')).toBe(-1);
    expect(sorter('a1', 'a2')).toBe(1);
    expect(sorter('a2', 'a3')).toBe(-1);
    expect(sorter('a3', 'a2')).toBe(1);
    expect(sorter('a1', 'a3')).toBe(-1);
    expect(sorter('a3', 'a1')).toBe(1);
    expect(sorter('c3', 'c1')).toBe(-1);
    expect(sorter('c1', 'c3')).toBe(1);
    expect(sorter('c3', 'c2')).toBe(-1);
    expect(sorter('c2', 'c3')).toBe(1);
    expect(sorter('c1', 'c2')).toBe(-1);
    expect(sorter('c2', 'c1')).toBe(1);
  });
});
