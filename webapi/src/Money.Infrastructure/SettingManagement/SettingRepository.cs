using Microsoft.EntityFrameworkCore;
using Money.Domain.Repositories.EntityFrameworkCore;
using Money.EntityFrameworkCore;

namespace Money.SettingManagement;

public class SettingRepository : EfCoreRepository<MoneyDbContext, Setting, Guid>, ISettingRepository
{
    public SettingRepository(IDbContextProvider<MoneyDbContext> dbContextProvider) : base(dbContextProvider)
    {
    }

    public async Task<Setting?> FindAsync(
        string name,
        string? providerName,
        string? providerKey,
        CancellationToken cancellationToken = default)
    {
        return await (await GetDbSetAsync())
            .OrderBy(x => x.Id)
            .FirstOrDefaultAsync(s => s.Name == name && s.ProviderName == providerName && s.ProviderKey == providerKey,
                cancellationToken);
    }

    public virtual async Task<List<Setting>> GetListAsync(
        string? providerName,
        string? providerKey,
        CancellationToken cancellationToken = default)
    {
        return await (await GetDbSetAsync())
            .Where(
                s => s.ProviderName == providerName && s.ProviderKey == providerKey
            ).ToListAsync(cancellationToken);
    }

    public virtual async Task<List<Setting>> GetListAsync(
        string[] names,
        string? providerName,
        string? providerKey,
        CancellationToken cancellationToken = default)
    {
        return await (await GetDbSetAsync())
            .Where(
                s => names.Contains(s.Name) && s.ProviderName == providerName && s.ProviderKey == providerKey
            ).ToListAsync(cancellationToken);
    }
}
