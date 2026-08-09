using Microsoft.EntityFrameworkCore;
using TwistsAndTurns.Api.Data;
using TwistsAndTurns.Api.Models;

namespace TwistsAndTurns.Api.Services;

public class RecurringFinanceEntryGenerator
{
    private readonly ApplicationDbContext _dbContext;

    public RecurringFinanceEntryGenerator(
        ApplicationDbContext dbContext
    )
    {
        _dbContext = dbContext;
    }

    public DateTime GetOccurrenceDate(
        RecurringFinanceItem recurringItem,
        int occurrenceNumber
    )
    {
        var interval =
            recurringItem.RecurrenceInterval *
            occurrenceNumber;

        return recurringItem.RecurrenceUnit switch
        {
            RecurrenceUnit.Week =>
                recurringItem.StartDate.AddDays(
                    interval * 7
                ),

            RecurrenceUnit.Month =>
                recurringItem.StartDate.AddMonths(
                    interval
                ),

            RecurrenceUnit.Year =>
                recurringItem.StartDate.AddYears(
                    interval
                ),

            _ => recurringItem.StartDate
        };
    }

    public List<DateTime> GetOccurrenceDates(
        RecurringFinanceItem recurringItem,
        DateTime throughDate
    )
    {
        var occurrenceDates = new List<DateTime>();

        var occurrenceNumber = 0;

        while (true)
        {
            var occurrenceDate = GetOccurrenceDate(
                recurringItem,
                occurrenceNumber
            );

            if (occurrenceDate > throughDate.Date)
            {
                break;
            }

            occurrenceDates.Add(occurrenceDate);

            occurrenceNumber++;
        }

        return occurrenceDates;
    }

    public async Task<List<FinanceEntry>> GenerateMissingEntriesAsync(
        RecurringFinanceItem recurringItem,
        DateTime throughDate
    )
    {
        var occurrenceDates = GetOccurrenceDates(
            recurringItem,
            throughDate
        );

        var existingDates = await _dbContext
            .FinanceEntries
            .Where(
                entry =>
                    entry.RecurringFinanceItemId ==
                    recurringItem.Id
            )
            .Select(
                entry => entry.EntryDate
            )
            .ToListAsync();

        var existingDateSet = existingDates
            .Select(date => date.Date)
            .ToHashSet();

        var missingDates = occurrenceDates
            .Where(
                date =>
                    !existingDateSet.Contains(
                        date.Date
                    )
            )
            .ToList();

        var newEntries = missingDates
            .Select(
                date =>
                    new FinanceEntry
                    {
                        Name = recurringItem.Name,
                        Amount = recurringItem.Amount,
                        EntryType =
                            recurringItem.EntryType,
                        Category =
                            recurringItem.Category,
                        EntryDate = date,
                        UserId =
                            recurringItem.UserId,
                        BankAccountId =
                            recurringItem.BankAccountId,
                        RecurringFinanceItemId =
                            recurringItem.Id
                    }
            )
            .ToList();

        if (newEntries.Count == 0)
        {
            return newEntries;
        }

        _dbContext.FinanceEntries.AddRange(
            newEntries
        );

        await _dbContext.SaveChangesAsync();

        return newEntries;
    }
}