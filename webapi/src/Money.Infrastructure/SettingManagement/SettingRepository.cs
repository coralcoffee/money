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
        string providerName,
        string providerKey,
        CancellationToken cancellationToken = default)
    {
        return await (await GetDbSetAsync())
            .OrderBy(x => x.Id)
            .FirstOrDefaultAsync(s => s.Name == name && s.ProviderName == providerName && s.ProviderKey == providerKey,
                cancellationToken);
    }

    public virtual async Task<List<Setting>> GetListAsync(
        string providerName,
        string providerKey,
        CancellationToken cancellationToken = default)
    {
        return await (await GetDbSetAsync())
            .Where(
                s => s.ProviderName == providerName && s.ProviderKey == providerKey
            ).ToListAsync(cancellationToken);
    }

    public virtual async Task<List<Setting>> GetListAsync(
        string[] names,
        string providerName,
        string providerKey,
        CancellationToken cancellationToken = default)
    {
        return await (await GetDbSetAsync())
            .Where(
                s => names.Contains(s.Name) && s.ProviderName == providerName && s.ProviderKey == providerKey
            ).ToListAsync(cancellationToken);
    }

    public async Task<Setting> InsertAsync(Setting setting, bool autoSave = false, CancellationToken cancellationToken = default)
    {
        var dbContext = await GetDbContextAsync();
        await dbContext.Set<Setting>().AddAsync(setting, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return setting;
    }

    public async Task UpdateAsync(Setting setting, CancellationToken cancellationToken = default)
    {
        var dbContext = await GetDbContextAsync();
        dbContext.Set<Setting>().Update(setting);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var dbContext = await GetDbContextAsync();
        var entity = await dbContext.Set<Setting>().FindAsync(new object[] { id }, cancellationToken);
        if (entity != null)
        {
            dbContext.Set<Setting>().Remove(entity);
            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task<bool> ExistsAsync(string name, string providerName, string providerKey, CancellationToken cancellationToken = default)
    {
        return await (await GetDbSetAsync())
            .AnyAsync(s => s.Name == name && s.ProviderName == providerName && s.ProviderKey == providerKey, cancellationToken);
    }
}
