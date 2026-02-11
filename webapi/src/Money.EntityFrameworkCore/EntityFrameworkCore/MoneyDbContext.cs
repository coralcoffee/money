using Microsoft.EntityFrameworkCore;
using Money.Accounts;
using Money.Activities;
using Money.MarketData;
using Volo.Abp.AuditLogging.EntityFrameworkCore;
using Volo.Abp.BackgroundJobs.EntityFrameworkCore;
using Volo.Abp.BlobStoring.Database.EntityFrameworkCore;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore.Modeling;
using Volo.Abp.FeatureManagement.EntityFrameworkCore;
using Volo.Abp.Identity;
using Volo.Abp.Identity.EntityFrameworkCore;
using Volo.Abp.PermissionManagement.EntityFrameworkCore;
using Volo.Abp.SettingManagement.EntityFrameworkCore;
using Volo.Abp.OpenIddict.EntityFrameworkCore;
using Volo.Abp.TenantManagement;
using Volo.Abp.TenantManagement.EntityFrameworkCore;

namespace Money.EntityFrameworkCore;

[ReplaceDbContext(typeof(IIdentityDbContext))]
[ReplaceDbContext(typeof(ITenantManagementDbContext))]
[ConnectionStringName("Default")]
public class MoneyDbContext :
    AbpDbContext<MoneyDbContext>,
    ITenantManagementDbContext,
    IIdentityDbContext
{
    /* Add DbSet properties for your Aggregate Roots / Entities here. */

    public DbSet<Account> Accounts { get; set; }

    public DbSet<Activity> Activities { get; set; }

    public DbSet<DailyMarketPrice> DailyMarketPrices { get; set; }

    public DbSet<InstrumentFundamentalSnapshot> InstrumentFundamentalSnapshots { get; set; }

    #region Entities from the modules

    /* Notice: We only implemented IIdentityProDbContext and ISaasDbContext
     * and replaced them for this DbContext. This allows you to perform JOIN
     * queries for the entities of these modules over the repositories easily. You
     * typically don't need that for other modules. But, if you need, you can
     * implement the DbContext interface of the needed module and use ReplaceDbContext
     * attribute just like IIdentityProDbContext and ISaasDbContext.
     *
     * More info: Replacing a DbContext of a module ensures that the related module
     * uses this DbContext on runtime. Otherwise, it will use its own DbContext class.
     */

    // Identity
    public DbSet<IdentityUser> Users { get; set; }
    public DbSet<IdentityRole> Roles { get; set; }
    public DbSet<IdentityClaimType> ClaimTypes { get; set; }
    public DbSet<OrganizationUnit> OrganizationUnits { get; set; }
    public DbSet<IdentitySecurityLog> SecurityLogs { get; set; }
    public DbSet<IdentityLinkUser> LinkUsers { get; set; }
    public DbSet<IdentityUserDelegation> UserDelegations { get; set; }
    public DbSet<IdentitySession> Sessions { get; set; }

    // Tenant Management
    public DbSet<Tenant> Tenants { get; set; }
    public DbSet<TenantConnectionString> TenantConnectionStrings { get; set; }

    #endregion

    public MoneyDbContext(DbContextOptions<MoneyDbContext> options)
        : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        /* Include modules to your migration db context */

        builder.ConfigurePermissionManagement();
        builder.ConfigureSettingManagement();
        builder.ConfigureBackgroundJobs();
        builder.ConfigureAuditLogging();
        builder.ConfigureFeatureManagement();
        builder.ConfigureIdentity();
        builder.ConfigureOpenIddict();
        builder.ConfigureTenantManagement();
        builder.ConfigureBlobStoring();
        
        builder.Entity<Account>(b =>
        {
            b.ToTable(MoneyConsts.DbTablePrefix + "Accounts",
                MoneyConsts.DbSchema);
            b.ConfigureByConvention();
            b.Property(x => x.Name).IsRequired().HasMaxLength(AccountConsts.NameMaxLength);
            b.Property(x => x.AccountNumber).IsRequired().HasMaxLength(AccountConsts.AccountNumberMaxLength);
            b.Property(x => x.BrokerOrInstitution).IsRequired().HasMaxLength(AccountConsts.BrokerOrInstitutionMaxLength);
            b.Property(x => x.AccountType).IsRequired();
            b.Property(x => x.OwnerType).IsRequired();
        });

        builder.Entity<Activity>(b =>
        {
            b.ToTable(MoneyConsts.DbTablePrefix + "Activities",
                MoneyConsts.DbSchema);
            b.ConfigureByConvention();
            b.Property(x => x.AccountId).IsRequired();
            b.Property(x => x.Type).IsRequired();
            b.Property(x => x.TradeDate).IsRequired();
            b.Property(x => x.Currency).IsRequired().HasMaxLength(ActivityConsts.CurrencyMaxLength);
            b.Property(x => x.Amount).IsRequired().HasColumnType("decimal(18,2)");
            b.Property(x => x.Quantity).HasColumnType("decimal(18,6)");
            b.Property(x => x.Price).HasColumnType("decimal(18,6)");
            b.Property(x => x.Fee).HasColumnType("decimal(18,6)");
            b.Property(x => x.FxRateToCad).IsRequired().HasColumnType("decimal(18,8)");
            b.Property(x => x.InstrumentSymbol).HasMaxLength(ActivityConsts.InstrumentSymbolMaxLength);
            b.Property(x => x.Notes).HasMaxLength(ActivityConsts.NotesMaxLength);
            b.HasIndex(x => new { x.AccountId, x.TradeDate });
        });

        builder.Entity<DailyMarketPrice>(b =>
        {
            b.ToTable(MoneyConsts.DbTablePrefix + "DailyMarketPrices", MoneyConsts.DbSchema);
            b.ConfigureByConvention();
            b.Property(x => x.Symbol).IsRequired().HasMaxLength(16);
            b.Property(x => x.Currency).IsRequired().HasMaxLength(3);
            b.Property(x => x.Close).IsRequired().HasColumnType("decimal(18,6)");
            b.HasIndex(x => new { x.Symbol, x.Date }).IsUnique();
        });

        builder.Entity<InstrumentFundamentalSnapshot>(b =>
        {
            b.ToTable(MoneyConsts.DbTablePrefix + "InstrumentFundamentalSnapshots", MoneyConsts.DbSchema);
            b.ConfigureByConvention();
            b.Property(x => x.Symbol).IsRequired().HasMaxLength(16);
            b.Property(x => x.MarketCap).HasColumnType("decimal(20,2)");
            b.Property(x => x.TrailingPe).HasColumnType("decimal(18,6)");
            b.HasIndex(x => new { x.Symbol, x.Date }).IsUnique();
        });
        
        /* Configure your own tables/entities inside here */

        //builder.Entity<YourEntity>(b =>
        //{
        //    b.ToTable(MoneyConsts.DbTablePrefix + "YourEntities", MoneyConsts.DbSchema);
        //    b.ConfigureByConvention(); //auto configure for the base class props
        //    //...
        //});
    }
}
