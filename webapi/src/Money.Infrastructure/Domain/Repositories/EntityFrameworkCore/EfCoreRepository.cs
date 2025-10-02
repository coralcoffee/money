using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using Money.Domain.Entities;
using Money.EntityFrameworkCore;

namespace Money.Domain.Repositories.EntityFrameworkCore;

public class EfCoreRepository<TDbContext, TEntity> :
    IEfCoreRepository<TEntity>
    where TDbContext : DbContext
    where TEntity : class, IEntity
{
    private readonly IDbContextProvider<TDbContext> _dbContextProvider;

    public EfCoreRepository(IDbContextProvider<TDbContext> dbContextProvider)
    {
        _dbContextProvider = dbContextProvider;
    }

    public async Task<DbContext> GetDbContextAsync()
    {
        return (await _dbContextProvider.GetDbContextAsync() as DbContext)!;
    }

    public async Task<DbSet<TEntity>> GetDbSetAsync()
    {
        return (await GetDbContextAsync()).Set<TEntity>();
    }
}

public class EfCoreRepository<TDbContext, TEntity, TKey> : EfCoreRepository<TDbContext, TEntity>,
    IEfCoreRepository<TEntity, TKey>,
    IBasicRepository<TEntity, TKey>
    where TDbContext : DbContext
    where TEntity : class, IEntity<TKey>
{
    public EfCoreRepository(IDbContextProvider<TDbContext> dbContextProvider) : base(dbContextProvider)
    {
    }

    public async Task<TEntity> InsertAsync([NotNull] TEntity entity, bool autoSave = false, CancellationToken cancellationToken = default)
    {
        var dbContext = await GetDbContextAsync();

        var savedEntity = (await dbContext.Set<TEntity>().AddAsync(entity, cancellationToken)).Entity;

        if (autoSave)
        {
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        return savedEntity;
    }

    public async Task<TEntity> UpdateAsync([NotNull] TEntity entity, bool autoSave = false, CancellationToken cancellationToken = default)
    {
        var dbContext = await GetDbContextAsync();

        if (dbContext.Set<TEntity>().Local.All(e => e != entity))
        {
            dbContext.Set<TEntity>().Attach(entity);
            dbContext.Update(entity);
        }

        if (autoSave)
        {
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        return entity;
    }
}