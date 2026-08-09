using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TwistsAndTurns.Api.Models;

namespace TwistsAndTurns.Api.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options
    ) : base(options)
    {
    }

    public DbSet<FinanceEntry> FinanceEntries { get; set; } = null!;
    public DbSet<BankAccount> BankAccounts { get; set; } = null!;
    public DbSet<RecurringBill> RecurringBills { get; set; } = null!;
    public DbSet<RecurringBillOccurrence> RecurringBillOccurrences { get; set; } = null!;

    protected override void OnModelCreating(
        ModelBuilder builder
    )
    {
        base.OnModelCreating(builder);

        builder.Entity<FinanceEntry>()
            .Property(entry => entry.Amount)
            .HasPrecision(18, 2);

        builder.Entity<RecurringBill>()
            .Property(bill => bill.Amount)
            .HasPrecision(18, 2);

        builder.Entity<RecurringBillOccurrence>()
            .Property(occurrence => occurrence.Amount)
            .HasPrecision(18, 2);

        builder.Entity<RecurringBillOccurrence>()
            .HasIndex(
                occurrence => new
                {
                    occurrence.RecurringBillId,
                    occurrence.DueDate
                }
            )
            .IsUnique();
    }
}