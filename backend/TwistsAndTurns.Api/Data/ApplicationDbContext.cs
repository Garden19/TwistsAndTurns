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

    public DbSet<RecurringFinanceItem> RecurringFinanceItems { get; set; } = null!;

    public DbSet<SavingsGoal> SavingsGoals { get; set; } = null!;

    protected override void OnModelCreating(
            ModelBuilder builder
        )
        {
            base.OnModelCreating(builder);

            builder.Entity<FinanceEntry>()
                .Property(entry => entry.Amount)
                .HasPrecision(18, 2);

            builder.Entity<RecurringFinanceItem>()
                .Property(item => item.Amount)
                .HasPrecision(18, 2);

            builder.Entity<FinanceEntry>()
                .HasOne(entry => entry.RecurringFinanceItem)
                .WithMany()
                .HasForeignKey(entry => entry.RecurringFinanceItemId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<FinanceEntry>()
                .HasIndex(
                    entry => new
                    {
                        entry.RecurringFinanceItemId,
                        entry.EntryDate
                    }
                )
                .IsUnique()
                .HasFilter("[RecurringFinanceItemId] IS NOT NULL");

            builder.Entity<SavingsGoal>()
                .Property(goal => goal.TargetAmount)
                .HasPrecision(18, 2);

            builder.Entity<SavingsGoal>()
                .Property(goal => goal.CurrentAmount)
                .HasPrecision(18, 2);
        }
}