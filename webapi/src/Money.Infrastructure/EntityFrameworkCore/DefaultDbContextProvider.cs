using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Money.EntityFrameworkCore;

public class DefaultDbContextProvider<TDbContext>(IServiceProvider serviceProvider) : IDbContextProvider<TDbContext>
    where TDbContext : DbContext
{
    public IServiceProvider ServiceProvider { get; } = serviceProvider;

    private TDbContext? _dbContext;

    public TDbContext GetDbContext()
    {
        if (_dbContext == null)
        {
            _dbContext = ServiceProvider.GetRequiredService<TDbContext>();
        }
        return _dbContext;
    }

    public Task<TDbContext> GetDbContextAsync()
    {
        // TODO : Implement UOW
        return Task.FromResult(GetDbContext());
    }
}
