using Microsoft.EntityFrameworkCore;

namespace Money.EntityFrameworkCore;

public interface IDbContextProvider<TDbContext>
    where TDbContext : DbContext
{
    TDbContext GetDbContext();

    Task<TDbContext> GetDbContextAsync();
}
