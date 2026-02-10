# Phase 1 Structural Corrections Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Correct foundational workspace/build/packaging/backend policy mismatches so desktop can reliably package and run with API artifacts.

**Architecture:** Keep root as orchestrator, keep webapi/webui/desktop boundaries unchanged, and fix only contract-level wiring in config/build files. Implement one issue at a time with verification immediately after each change.

**Tech Stack:** pnpm/npm scripts, Electron Builder, ASP.NET Core (.NET 9), PowerShell verification

---

### Task 1: Fix backend CORS policy mismatch

**Files:**
- Modify: `webapi/src/Money.HttpApi.Host/MoneyHttpApiHostModuleStartup.cs`

**Step 1: Write failing test (reproduction)**
- Run: `dotnet run --project webapi/src/Money.HttpApi.Host/Money.HttpApi.Host.csproj` and hit one API route.
- Expected before fix: runtime failure due to missing CORS policy name (`AllowFrontend` not registered).

**Step 2: Verify failing behavior**
- Capture runtime error evidence from server output.

**Step 3: Write minimal implementation**
- Change `app.UseCors("AllowFrontend")` to `app.UseCors("DevCorsPolicy")`.

**Step 4: Verify pass**
- Re-run host startup and request route.
- Expected: no CORS-policy-not-found exception.

### Task 2: Align pnpm workspace with actual package folders

**Files:**
- Modify: `pnpm-workspace.yaml`

**Step 1: Write failing test (reproduction)**
- Run: `pnpm -r list --depth -1`.
- Expected before fix: workspace warning/error around missing `desktop/package.json`.

**Step 2: Write minimal implementation**
- Remove `desktop` from workspace package list.

**Step 3: Verify pass**
- Re-run: `pnpm -r list --depth -1`.
- Expected: workspace resolves cleanly.

### Task 3: Include WebAPI output in packaging input

**Files:**
- Modify: `electron-builder.yml`

**Step 1: Write failing test (reproduction)**
- Inspect builder config for explicit exclusion of `dist/webapi/**/*`.

**Step 2: Write minimal implementation**
- Remove exclusion rule so published webapi files can be bundled.

**Step 3: Verify pass**
- Re-check config and run a packaging dry build path command if available.

### Task 4: Ensure root build pipeline includes webapi publish

**Files:**
- Modify: `package.json`

**Step 1: Write failing test (reproduction)**
- Inspect `build` script and verify `build:webapi` is missing.

**Step 2: Write minimal implementation**
- Add `npm run build:webapi` into `build` chain.

**Step 3: Verify pass**
- Run `npm run build` (or targeted chain) and verify `dist/webapi` output exists.

### Task 5: End-to-end verification for Phase 1

**Files:**
- No additional code files

**Step 1: Run verification commands**
- `dotnet build webapi/Money.sln`
- `npm run build:webui`
- `npm run build:main`
- `npm run build:preload`
- `npm run build:webapi`

**Step 2: Validate artifacts and configs**
- Confirm files under `dist/webui`, `dist/desktop`, `dist/webapi`.
- Confirm `electron-builder.yml` includes webapi by omission of exclusion.

**Step 3: Prepare handoff**
- Summarize exact changes and evidence from command outputs.