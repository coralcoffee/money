# Investment Ledger V1 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a production-ready investment tracking application with multi-account, multi-currency activity ledger, FIFO profit/loss analytics in CAD, and daily Yahoo market data ingestion.

**Architecture:** Keep the current ABP layered monolith and replace sample `Book` bounded context with investment contexts (`Accounts`, `Activities`, `Holdings`, `Analytics`, `MarketData`). Use immutable activities as source of truth, materialized read models for holdings/analytics, and a hosted background worker for daily close/fundamental snapshots.

**Tech Stack:** .NET 10 + ABP + EF Core + PostgreSQL, React 19 + Vite + Redux Toolkit, Electron shell runtime, xUnit tests.

---

### Task 1: Replace Book Domain With Account Core

**Files:**
- Delete: `webapi/src/Money.Domain/Books/Book.cs`
- Delete: `webapi/src/Money.Application/Books/BookAppService.cs`
- Delete: `webapi/src/Money.Application.Contracts/Books/IBookAppService.cs`
- Delete: `webapi/src/Money.Application.Contracts/Books/CreateUpdateBookDto.cs`
- Delete: `webapi/src/Money.Application.Contracts/Books/BookDto .cs`
- Create: `webapi/src/Money.Domain/Accounts/Account.cs`
- Create: `webapi/src/Money.Domain.Shared/Accounts/AccountType.cs`
- Create: `webapi/src/Money.Domain.Shared/Accounts/OwnerType.cs`
- Create: `webapi/src/Money.Application.Contracts/Accounts/AccountDto.cs`
- Create: `webapi/src/Money.Application.Contracts/Accounts/CreateAccountDto.cs`
- Create: `webapi/src/Money.Application.Contracts/Accounts/IAccountAppService.cs`
- Create: `webapi/src/Money.Application/Accounts/AccountAppService.cs`
- Modify: `webapi/src/Money.Application/MoneyApplicationMappers.cs`
- Test: `webapi/test/Money.Domain.Tests/Accounts/AccountTests.cs`
- Test: `webapi/test/Money.Application.Tests/Accounts/AccountAppServiceTests.cs`

**Step 1: Write the failing domain test**

```csharp
[Fact]
public void Should_Create_Account_With_Required_Fields()
{
    var account = new Account(Guid.NewGuid(), "Questrade Margin", AccountType.NonRegistered, OwnerType.Personal, "123456", "Questrade");
    account.AccountType.ShouldBe(AccountType.NonRegistered);
}
```

**Step 2: Run test to verify it fails**

Run: `dotnet test webapi/test/Money.Domain.Tests/Money.Domain.Tests.csproj --filter AccountTests`
Expected: FAIL with missing `Account` type.

**Step 3: Write minimal implementation**

```csharp
public class Account : AuditedAggregateRoot<Guid>
{
    public string Name { get; private set; }
    public AccountType AccountType { get; private set; }
    public OwnerType OwnerType { get; private set; }
    public string AccountNumber { get; private set; }
    public string BrokerOrInstitution { get; private set; }
}
```

**Step 4: Run tests to verify pass**

Run: `dotnet test webapi/test/Money.Domain.Tests/Money.Domain.Tests.csproj --filter AccountTests`
Expected: PASS.

**Step 5: Commit**

```bash
git add webapi/src/Money.Domain webapi/src/Money.Domain.Shared webapi/src/Money.Application webapi/src/Money.Application.Contracts webapi/test/Money.Domain.Tests webapi/test/Money.Application.Tests
git commit -m "feat: replace sample book module with account core"
```

### Task 2: Add Multi-Currency Cash Ledger Activities

**Files:**
- Create: `webapi/src/Money.Domain.Shared/Activities/ActivityType.cs`
- Create: `webapi/src/Money.Domain/Activities/Activity.cs`
- Create: `webapi/src/Money.Application.Contracts/Activities/ActivityDto.cs`
- Create: `webapi/src/Money.Application.Contracts/Activities/CreateActivityDto.cs`
- Create: `webapi/src/Money.Application.Contracts/Activities/IActivityAppService.cs`
- Create: `webapi/src/Money.Application/Activities/ActivityAppService.cs`
- Test: `webapi/test/Money.Domain.Tests/Activities/ActivityValidationTests.cs`
- Test: `webapi/test/Money.Application.Tests/Activities/ActivityAppServiceTests.cs`

**Step 1: Write failing validation tests for activity types**

```csharp
[Fact]
public void Buy_Must_Require_Instrument_Quantity_And_Price() { }

[Fact]
public void Deposit_Must_Not_Allow_Quantity() { }
```

**Step 2: Run tests to verify fail**

Run: `dotnet test webapi/test/Money.Domain.Tests/Money.Domain.Tests.csproj --filter ActivityValidationTests`
Expected: FAIL.

**Step 3: Implement activity aggregate + validation**

```csharp
public class Activity : AuditedAggregateRoot<Guid>
{
    public Guid AccountId { get; private set; }
    public ActivityType Type { get; private set; }
    public string Currency { get; private set; }
    public decimal Amount { get; private set; }
    public decimal? Quantity { get; private set; }
    public decimal? Price { get; private set; }
}
```

**Step 4: Run tests to verify pass**

Run: `dotnet test webapi/test/Money.Domain.Tests/Money.Domain.Tests.csproj --filter ActivityValidationTests`
Expected: PASS.

**Step 5: Commit**

```bash
git add webapi/src/Money.Domain webapi/src/Money.Domain.Shared webapi/src/Money.Application webapi/src/Money.Application.Contracts webapi/test/Money.Domain.Tests webapi/test/Money.Application.Tests
git commit -m "feat: add immutable multi-currency activity ledger"
```

### Task 3: Implement FIFO Lots and Realized PnL Engine

**Files:**
- Create: `webapi/src/Money.Domain/Positions/PositionLot.cs`
- Create: `webapi/src/Money.Domain/Positions/FifoMatcher.cs`
- Create: `webapi/src/Money.Application/Analytics/PnlCalculator.cs`
- Test: `webapi/test/Money.Domain.Tests/Positions/FifoMatcherTests.cs`
- Test: `webapi/test/Money.Application.Tests/Analytics/PnlCalculatorTests.cs`

**Step 1: Write failing FIFO tests**

```csharp
[Fact]
public void Should_Close_Sell_Against_Oldest_Open_Lots_First() { }

[Fact]
public void Should_Throw_When_Sell_Exceeds_Open_Quantity() { }
```

**Step 2: Run tests to verify fail**

Run: `dotnet test webapi/test/Money.Domain.Tests/Money.Domain.Tests.csproj --filter FifoMatcherTests`
Expected: FAIL.

**Step 3: Implement minimal FIFO matcher + CAD realized PnL output**

```csharp
public sealed class FifoMatcher
{
    public MatchResult MatchSell(List<PositionLot> openLots, decimal sellQty, decimal sellPriceCad, decimal feeCad) { }
}
```

**Step 4: Run tests to verify pass**

Run: `dotnet test webapi/test/Money.Domain.Tests/Money.Domain.Tests.csproj --filter FifoMatcherTests`
Expected: PASS.

**Step 5: Commit**

```bash
git add webapi/src/Money.Domain webapi/src/Money.Application webapi/test/Money.Domain.Tests webapi/test/Money.Application.Tests
git commit -m "feat: add fifo lot matching and realized pnl calculation"
```

### Task 4: Persist Entities In EF Core and Generate Migration

**Files:**
- Modify: `webapi/src/Money.EntityFrameworkCore/EntityFrameworkCore/MoneyDbContext.cs`
- Create: `webapi/src/Money.EntityFrameworkCore/EntityFrameworkCore/Configurations/AccountConfiguration.cs`
- Create: `webapi/src/Money.EntityFrameworkCore/EntityFrameworkCore/Configurations/ActivityConfiguration.cs`
- Create: `webapi/src/Money.EntityFrameworkCore/EntityFrameworkCore/Configurations/PositionLotConfiguration.cs`
- Create: `webapi/src/Money.EntityFrameworkCore/Migrations/<timestamp>_InvestmentLedgerV1.cs`
- Test: `webapi/test/Money.EntityFrameworkCore.Tests/EntityFrameworkCore/Investments/InvestmentRepositoryTests.cs`

**Step 1: Write failing integration test for account/activity persistence**

```csharp
[Fact]
public async Task Should_Persist_Account_And_Activity() { }
```

**Step 2: Run test to verify fail**

Run: `dotnet test webapi/test/Money.EntityFrameworkCore.Tests/Money.EntityFrameworkCore.Tests.csproj --filter InvestmentRepositoryTests`
Expected: FAIL because tables/entities are not mapped.

**Step 3: Implement DbSet/configuration and create migration**

Run: `dotnet ef migrations add InvestmentLedgerV1 --project webapi/src/Money.EntityFrameworkCore/Money.EntityFrameworkCore.csproj --startup-project webapi/src/Money.HttpApi.Host/Money.HttpApi.Host.csproj`

**Step 4: Run integration test to verify pass**

Run: `dotnet test webapi/test/Money.EntityFrameworkCore.Tests/Money.EntityFrameworkCore.Tests.csproj --filter InvestmentRepositoryTests`
Expected: PASS.

**Step 5: Commit**

```bash
git add webapi/src/Money.EntityFrameworkCore webapi/test/Money.EntityFrameworkCore.Tests
git commit -m "feat: persist investment ledger entities and migration"
```

### Task 5: Build Analytics Query Endpoints (CAD-Normalized)

**Files:**
- Create: `webapi/src/Money.Application.Contracts/Analytics/PortfolioSummaryDto.cs`
- Create: `webapi/src/Money.Application.Contracts/Analytics/PerformanceDto.cs`
- Create: `webapi/src/Money.Application.Contracts/Analytics/IAnalyticsAppService.cs`
- Create: `webapi/src/Money.Application/Analytics/AnalyticsAppService.cs`
- Create: `webapi/src/Money.HttpApi/Controllers/AnalyticsController.cs`
- Test: `webapi/test/Money.Application.Tests/Analytics/AnalyticsAppServiceTests.cs`

**Step 1: Write failing app-service tests for summary math**

```csharp
[Fact]
public async Task Should_Return_TotalInvested_TotalValue_TotalProfitLoss_In_Cad() { }

[Fact]
public async Task Should_Return_Win_Loss_Rate_From_Closed_Trades() { }
```

**Step 2: Run test to verify fail**

Run: `dotnet test webapi/test/Money.Application.Tests/Money.Application.Tests.csproj --filter AnalyticsAppServiceTests`
Expected: FAIL.

**Step 3: Implement analytics app service and endpoint**

```csharp
public async Task<PortfolioSummaryDto> GetSummaryAsync() { }
```

**Step 4: Run tests to verify pass**

Run: `dotnet test webapi/test/Money.Application.Tests/Money.Application.Tests.csproj --filter AnalyticsAppServiceTests`
Expected: PASS.

**Step 5: Commit**

```bash
git add webapi/src/Money.Application.Contracts webapi/src/Money.Application webapi/src/Money.HttpApi webapi/test/Money.Application.Tests
git commit -m "feat: expose cad-normalized portfolio analytics endpoints"
```

### Task 6: Add Yahoo Market Data Ingestion

**Files:**
- Create: `webapi/src/Money.Domain/MarketData/DailyMarketPrice.cs`
- Create: `webapi/src/Money.Domain/MarketData/InstrumentFundamentalSnapshot.cs`
- Create: `webapi/src/Money.Application/MarketData/YahooFinanceClient.cs`
- Create: `webapi/src/Money.Application/MarketData/MarketDataRefreshJob.cs`
- Create: `webapi/src/Money.Application.Contracts/MarketData/MarketDataStatusDto.cs`
- Create: `webapi/src/Money.HttpApi/Controllers/MarketDataController.cs`
- Modify: `webapi/src/Money.HttpApi.Host/MoneyHttpApiHostModule.cs`
- Test: `webapi/test/Money.Application.Tests/MarketData/MarketDataRefreshJobTests.cs`

**Step 1: Write failing tests for parsing and refresh persistence**

```csharp
[Fact]
public async Task Should_Save_Daily_Close_For_Tracked_Symbols() { }
```

**Step 2: Run tests to verify fail**

Run: `dotnet test webapi/test/Money.Application.Tests/Money.Application.Tests.csproj --filter MarketDataRefreshJobTests`
Expected: FAIL.

**Step 3: Implement Yahoo adapter + scheduled refresh job**

```csharp
public class YahooFinanceClient : IMarketDataClient
{
    public Task<DailyQuote> GetDailyQuoteAsync(string symbol, DateOnly date) { }
}
```

**Step 4: Run tests to verify pass**

Run: `dotnet test webapi/test/Money.Application.Tests/Money.Application.Tests.csproj --filter MarketDataRefreshJobTests`
Expected: PASS.

**Step 5: Commit**

```bash
git add webapi/src/Money.Domain webapi/src/Money.Application webapi/src/Money.Application.Contracts webapi/src/Money.HttpApi webapi/src/Money.HttpApi.Host webapi/test/Money.Application.Tests
git commit -m "feat: add daily yahoo market data and fundamentals refresh"
```

### Task 7: Implement React Investment Screens

**Files:**
- Create: `webui/src/pages/accounts/AccountsPage.tsx`
- Create: `webui/src/pages/activities/ActivitiesPage.tsx`
- Create: `webui/src/pages/holdings/HoldingsPage.tsx`
- Create: `webui/src/pages/analytics/AnalyticsPage.tsx`
- Create: `webui/src/features/accounts/AccountForm.tsx`
- Create: `webui/src/features/activities/ActivityForm.tsx`
- Create: `webui/src/features/analytics/SummaryCards.tsx`
- Modify: `webui/src/routes/index.tsx`
- Modify: `webui/src/layouts/AppLayout/SidebarNav.tsx`
- Test: `webui/src/features/activities/__tests__/ActivityForm.test.tsx`

**Step 1: Write failing UI/form validation tests**

```ts
it('requires quantity and price for Buy activity', async () => {});
```

**Step 2: Run tests to verify fail**

Run: `npm run lint:webui`
Expected: FAIL until new components and validation wiring exist.

**Step 3: Implement pages + forms with API integration**

```tsx
<Route path="analytics" element={<AnalyticsPage />} />
```

**Step 4: Run checks to verify pass**

Run: `npm run lint:webui`
Expected: PASS.

**Step 5: Commit**

```bash
git add webui/src
git commit -m "feat: add accounts activities holdings and analytics ui"
```

### Task 8: Wire Runtime Configuration and Security Hardening

**Files:**
- Modify: `desktop/main.ts`
- Modify: `webui/src/runtime/apiRuntime.ts`
- Modify: `webapi/src/Money.HttpApi.Host/appsettings.Development.json`
- Create: `webapi/src/Money.Domain/Accounts/AccountNumberProtector.cs`
- Test: `webapi/test/Money.Domain.Tests/Accounts/AccountNumberProtectionTests.cs`

**Step 1: Write failing test for account number protection/masking**

```csharp
[Fact]
public void Should_Mask_Account_Number_In_Read_Models() { }
```

**Step 2: Run test to verify fail**

Run: `dotnet test webapi/test/Money.Domain.Tests/Money.Domain.Tests.csproj --filter AccountNumberProtectionTests`
Expected: FAIL.

**Step 3: Implement encryption-at-rest + masked DTO projection**

```csharp
public static string Mask(string accountNumber) => $"****{accountNumber[^4..]}";
```

**Step 4: Run tests to verify pass**

Run: `dotnet test webapi/test/Money.Domain.Tests/Money.Domain.Tests.csproj --filter AccountNumberProtectionTests`
Expected: PASS.

**Step 5: Commit**

```bash
git add desktop/main.ts webui/src/runtime/apiRuntime.ts webapi/src/Money.Domain webapi/src/Money.HttpApi.Host webapi/test/Money.Domain.Tests
git commit -m "feat: harden runtime config and protect sensitive account numbers"
```

### Task 9: End-to-End Verification and Documentation

**Files:**
- Create: `docs/investment-ledger-v1.md`
- Modify: `README.md`

**Step 1: Run backend tests**

Run: `dotnet test webapi/Money.slnx`
Expected: PASS.

**Step 2: Run frontend quality checks**

Run: `npm run lint:webui && npm run type-check`
Expected: PASS.

**Step 3: Run integrated local smoke test**

Run: `npm run start`
Expected: Electron app loads, can create account, log activity, and view analytics.

**Step 4: Document setup and operations**

Add runbook sections: env vars, Yahoo limits, market refresh behavior, troubleshooting.

**Step 5: Commit**

```bash
git add docs/investment-ledger-v1.md README.md
git commit -m "docs: add investment ledger v1 setup and operations guide"
```

### Task 10: Final Quality Gate (@verification-before-completion)

**Files:**
- Modify: none (verification only)

**Step 1: Verify clean git status**

Run: `git status --short`
Expected: no unexpected uncommitted implementation files.

**Step 2: Verify critical scenarios manually**

Run through: deposit CAD, buy USD stock, sell partial lot, check FIFO realized P/L and CAD totals.
Expected: totals and win/loss update correctly.

**Step 3: Capture evidence in PR notes**

Include command outputs, screenshots, and known limitations.

**Step 4: Tag residual risks**

Document Yahoo provider volatility and fallback strategy.

**Step 5: Commit (if any note files changed)**

```bash
git add .
git commit -m "chore: record final verification evidence"
```
