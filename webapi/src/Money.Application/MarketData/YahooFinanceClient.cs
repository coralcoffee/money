using System;
using System.Globalization;
using System.Net.Http;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace Money.MarketData;

public class YahooFinanceClient : IMarketDataClient
{
    private readonly IHttpClientFactory _httpClientFactory;

    public YahooFinanceClient(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    public async Task<DailyQuoteResult> GetDailyQuoteAsync(string symbol, DateOnly date, CancellationToken cancellationToken = default)
    {
        var client = _httpClientFactory.CreateClient("yahoo-finance");
        var url = $"https://query1.finance.yahoo.com/v8/finance/chart/{Uri.EscapeDataString(symbol)}?range=5d&interval=1d";
        var raw = await client.GetStringAsync(url, cancellationToken);
        using var json = JsonDocument.Parse(raw);

        var result = json.RootElement
            .GetProperty("chart")
            .GetProperty("result")[0];

        var currency = result.GetProperty("meta").TryGetProperty("currency", out var c) ? c.GetString() ?? "USD" : "USD";
        var closes = result.GetProperty("indicators").GetProperty("quote")[0].GetProperty("close");
        decimal close = 0;
        for (var i = closes.GetArrayLength() - 1; i >= 0; i--)
        {
            if (closes[i].ValueKind == JsonValueKind.Number && closes[i].TryGetDecimal(out var parsed))
            {
                close = parsed;
                break;
            }
        }

        if (close <= 0)
        {
            throw new InvalidOperationException($"No valid close value returned by Yahoo for {symbol}.");
        }

        return new DailyQuoteResult(symbol.ToUpperInvariant(), date, currency.ToUpperInvariant(), close);
    }

    public async Task<FundamentalResult> GetFundamentalsAsync(string symbol, CancellationToken cancellationToken = default)
    {
        var client = _httpClientFactory.CreateClient("yahoo-finance");
        var url = $"https://query1.finance.yahoo.com/v10/finance/quoteSummary/{Uri.EscapeDataString(symbol)}?modules=defaultKeyStatistics,financialData";
        var raw = await client.GetStringAsync(url, cancellationToken);
        using var json = JsonDocument.Parse(raw);

        var result = json.RootElement
            .GetProperty("quoteSummary")
            .GetProperty("result")[0];

        var marketCap = TryReadRawNumber(result, "defaultKeyStatistics", "marketCap");
        var trailingPe = TryReadRawNumber(result, "defaultKeyStatistics", "trailingPE");

        return new FundamentalResult(symbol.ToUpperInvariant(), DateOnly.FromDateTime(DateTime.UtcNow), marketCap, trailingPe);
    }

    private static decimal? TryReadRawNumber(JsonElement root, string moduleName, string fieldName)
    {
        if (!root.TryGetProperty(moduleName, out var module))
        {
            return null;
        }

        if (!module.TryGetProperty(fieldName, out var field))
        {
            return null;
        }

        if (field.TryGetProperty("raw", out var raw))
        {
            if (raw.ValueKind == JsonValueKind.Number && raw.TryGetDecimal(out var value))
            {
                return value;
            }

            if (raw.ValueKind == JsonValueKind.String &&
                decimal.TryParse(raw.GetString(), NumberStyles.Any, CultureInfo.InvariantCulture, out var parsed))
            {
                return parsed;
            }
        }

        return null;
    }
}
