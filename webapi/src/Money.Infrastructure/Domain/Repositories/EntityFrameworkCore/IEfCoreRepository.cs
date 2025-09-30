using Microsoft.EntityFrameworkCore;
using Money.Domain.Entities;
using Money.EntityFrameworkCore;

namespace Money.Domain.Repositories.EntityFrameworkCore;

public interface IEfCoreRepository<TEntity>
      where TEntity : class, IEntity
{
    Task<DbContext> GetDbContextAsync();

    Task<DbSet<TEntity>> GetDbSetAsync();
}

public interface IEfCoreRepository<TEntity, TKey> : IEfCoreRepository<TEntity>, IBasicRepository<TEntity, TKey>
    where TEntity : class, IEntity<TKey>
{

}