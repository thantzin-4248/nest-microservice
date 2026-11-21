import { SearchService } from './search.service.js';

describe('SearchService', () => {
  it('searches active products with a literal query and a capped result limit', async () => {
    const results = [{ name: 'Running shoes' }];
    const exec = vi.fn().mockResolvedValue(results);
    const limit = vi.fn().mockReturnValue({ exec });
    const sort = vi.fn().mockReturnValue({ limit });
    const find = vi.fn().mockReturnValue({ sort });
    const service = new SearchService({ find } as never);

    await expect(
      service.query({ q: ' Shoes. ', limit: 500 }),
    ).resolves.toBe(results);

    expect(find).toHaveBeenCalledWith({
      status: 'ACTIVE',
      normalizedText: { $regex: 'shoes\\.' },
    });
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(limit).toHaveBeenCalledWith(100);
  });

  it('returns no results for a blank query without querying the database', async () => {
    const find = vi.fn();
    const service = new SearchService({ find } as never);

    await expect(service.query({ q: '   ' })).resolves.toEqual([]);
    expect(find).not.toHaveBeenCalled();
  });
});
