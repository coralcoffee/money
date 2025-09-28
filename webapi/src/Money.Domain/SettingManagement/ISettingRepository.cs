namespace Money.SettingManagement;

public interface ISettingRepository
{
    Task<Setting?> FindAsync(string name, string providerName, string providerKey, CancellationToken cancellationToken = default);
    Task<List<Setting>> GetListAsync(string providerName, string providerKey, CancellationToken cancellationToken = default);
    Task<List<Setting>> GetListAsync(string[] names, string providerName, string providerKey, CancellationToken cancellationToken = default);
    
    Task<Setting> InsertAsync(Setting entity, bool autoSave = false, CancellationToken cancellationToken = default);
    
    Task UpdateAsync(Setting setting, CancellationToken cancellationToken = default);
    Task RemoveAsync(Guid id, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(string name, string providerName, string providerKey, CancellationToken cancellationToken = default);
}
