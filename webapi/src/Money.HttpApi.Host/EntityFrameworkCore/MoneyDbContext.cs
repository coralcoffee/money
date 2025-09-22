using Microsoft.EntityFrameworkCore;

namespace Money.EntityFrameworkCore;

public class MoneyDbContext(DbContextOptions<MoneyDbContext> options) : DbContext(options)
{
    public DbSet<TodoItem> Todos => Set<TodoItem>();
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TodoItem>(e =>
        {
            e.Property(x => x.Title).HasMaxLength(200).IsRequired();
            e.HasIndex(x => x.IsDone);
        });
    }
}
