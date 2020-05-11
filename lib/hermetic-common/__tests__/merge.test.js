import merge from '../src/merge';

describe('merge', () => {
  it('merges datasets with no intersecting members', () => {
    const a = {
      technologies: [{ technologyId: 'a', name: 'A' }],
    };
    const b = {
      capabilities: [{ capabilityId: 'b', name: 'B' }],
    };
    const c = merge([a, b]);
    expect(c).toBeTruthy();
    expect(c.technologies).toHaveLength(1);
    expect(c.technologies[0]).toMatchObject(a.technologies[0]);
    expect(c.capabilities).toHaveLength(1);
    expect(c.capabilities[0]).toMatchObject(b.capabilities[0]);
  });
  it('merges arrays with distinct members', () => {
    const a = {
      technologies: [{ technologyId: 'a', name: 'A' }],
    };
    const b = {
      technologies: [{ technologyId: 'b', name: 'B' }],
    };
    const c = merge([a, b]);
    expect(c).toBeTruthy();
    expect(c.technologies).toHaveLength(2);
    expect(c.technologies[0]).toMatchObject(a.technologies[0]);
    expect(c.technologies[1]).toMatchObject(b.technologies[0]);
  });
  it('merges matching elements of arrays', () => {
    const a = {
      technologies: [{ technologyId: 'a', name: 'A' }],
    };
    const b = {
      technologies: [
        { technologyId: 'b', name: 'B' }, { technologyId: 'a', category: 'something' },
      ],
    };
    const c = merge([a, b]);
    expect(c).toBeTruthy();
    expect(c.technologies).toHaveLength(2);
    expect(c.technologies[0]).toMatchObject({
      technologyId: 'a',
      name: 'A',
      category: 'something',
    });
    expect(c.technologies[1]).toMatchObject(b.technologies[0]);
  });
});
