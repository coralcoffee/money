using JetBrains.Annotations;

namespace Money.Domain.Repositories;

public interface IBasicRepository<TEntity, TKey> where TEntity : class
{
    [NotNull]
    Task<TEntity> InsertAsync([NotNull] TEntity entity, bool autoSave = false, CancellationToken cancellationToken = default);

    [NotNull]
    Task<TEntity> UpdateAsync([NotNull] TEntity entity, bool autoSave = false, CancellationToken cancellationToken = default);
}
