using Microsoft.EntityFrameworkCore;
using Money.SettingManagement;

namespace Money.EntityFrameworkCore;

public class MoneyDbContext(DbContextOptions<MoneyDbContext> options) : DbContext(options)
{
    public DbSet<Setting> Settings => Set<Setting>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
    }
}
