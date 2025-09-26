using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using Money.SettingManagement;

namespace Money.EntityFrameworkCore;

public class MoneyDbContext(DbContextOptions<MoneyDbContext> options) : DbContext(options)
{
    public DbSet<Setting> Settings => Set<Setting>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        ConfigureSettingManagement(modelBuilder);
    }

    private void ConfigureSettingManagement(
       [NotNull] ModelBuilder builder)
    {
        Check.NotNull(builder, nameof(builder));

        builder.Entity<Setting>(b =>
        {
            b.ToTable(SettingManagementDbProperties.DbTablePrefix + "Settings");

            b.Property(x => x.Name).HasMaxLength(SettingConsts.MaxNameLength).IsRequired();
            b.Property(x => x.Value).HasMaxLength(SettingConsts.MaxValueLengthValue).IsRequired();
            b.Property(x => x.ProviderName).HasMaxLength(SettingConsts.MaxProviderNameLength);
            b.Property(x => x.ProviderKey).HasMaxLength(SettingConsts.MaxProviderKeyLength);
            b.HasIndex(x => new { x.Name, x.ProviderName, x.ProviderKey }).IsUnique(true);
        });
    }
}
