# TwistsAndTurns

TwistsAndTurns is a personal finance web application built with Angular and ASP.NET Core. Track income and expenses, bank accounts, recurring payments, savings goals and payslips in one place.

## Technology

- **Frontend:** Angular 20, TypeScript and Chart.js
- **Backend:** ASP.NET Core (.NET 10), Entity Framework Core and ASP.NET Core Identity
- **Database:** Microsoft SQL Server (the development connection targets a local SQL Server Express instance)

## Getting started (Windows PowerShell)

### Prerequisites

Install Node.js, the .NET 10 SDK and SQL Server Express (or another compatible SQL Server instance). The backend uses Windows integrated authentication in the checked-in development connection string. Update the connection string for your own environment without committing credentials.

Clone the repository, then navigate to its folder:

```powershell
git clone https://github.com/Garden19/TwistsAndTurns.git
Set-Location .\TwistsAndTurns
```

If you have not already installed the Entity Framework Core CLI:

```powershell
dotnet tool install --global dotnet-ef --version "10.*"
```

Apply the existing database migrations:

```powershell
dotnet ef database update --project .\backend\TwistsAndTurns.Api\TwistsAndTurns.Api.csproj
```

Run the API in the first terminal:

```powershell
dotnet run --project .\backend\TwistsAndTurns.Api\TwistsAndTurns.Api.csproj --launch-profile http
```

The development API listens on **http://localhost:5200**.

In a separate PowerShell terminal, from the repository root:

```powershell
Set-Location .\frontend
npm ci
npm start
```

Open **http://localhost:4200** to use the Angular application.

## Main features

- **Finance:** Add, edit and categorise income and expenses, associate bank accounts, and mark payments as paid.
- **Recurring items:** Generate entries for selected dates and stop future occurrences.
- **Savings:** Create savings goals, record contributions, edit and archive goals.
- **Payslips:** Manually enter pay and deductions, filter by UK tax year, and edit or archive existing records.
- **CSV export:** In Finance → Transactions, select **Export all CSV** to download the signed-in user's transaction history. It includes records from all months, including skipped recurring entries flagged as skipped.
- **Account security:** Cookie-based authentication, a 15-minute lockout after five failed sign-in attempts, and session checks before opening the finance screen.

## Checks

GitHub Actions runs an Angular production build and a .NET Release build for changes pushed to `master`. A successful build does not guarantee runtime behaviour or database connectivity.

## Security and deployment notes

- Financial records and database backups must not be committed to the repository.
- Keep database passwords, signing material and other secrets outside tracked source files.
- The development setup permits local HTTP; deploy behind HTTPS and review cookie, CORS, CSRF and authentication settings before public use.
- Plan secure backups, database access controls, privacy documentation, monitoring and integration tests before handling live financial data at scale.
