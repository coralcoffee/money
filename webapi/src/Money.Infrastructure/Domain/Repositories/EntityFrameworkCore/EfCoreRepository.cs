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

    public Task<DbContext> GetDbContextAsync()
    {
        throw new NotImplementedException();
    }

    public Task<DbSet<TEntity>> GetDbSetAsync()
    {
        throw new NotImplementedException();
    }
}
public class EfCoreRepository<TDbContext, TEntity, TKey> : EfCoreRepository<TDbContext, TEntity>,
    IEfCoreRepository<TEntity, TKey>
    where TDbContext : DbContext
    where TEntity : class, IEntity<TKey>
{
    public EfCoreRepository(IDbContextProvider<TDbContext> dbContextProvider) : base(dbContextProvider)
    {
    }
}