import cache from '../src/cache';

describe('cache', () => {
  it('Loads sample data', async () => {
    const data = await cache('../sample-data');
    expect(data).toHaveProperty('capabilities');
    expect(data).toHaveProperty('technologies');
  });
});
