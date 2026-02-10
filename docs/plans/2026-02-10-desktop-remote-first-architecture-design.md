# Money Desktop Architecture Design (Remote-First API with Optional Local Fallback)

Date: 2026-02-10
Status: Validated with user

## Goals
- Use ASP.NET Core as backend Web API.
- Use React + TypeScript + Vite (current project uses Rsbuild for UI build; migration to Vite can be planned separately).
- Use Electron desktop app to host UI and coordinate API connectivity.
- Prefer remote API first, with optional local API fallback.
- Fix structural inconsistencies in current repository.

## Current Structural Problems
- Workspace inconsistency: `pnpm-workspace.yaml` lists `desktop`, but `desktop/package.json` does not exist.
- Mixed package manager reality (`npm` scripts + workspace structure + nested lockfiles) causing drift.
- Electron does not currently launch or supervise ASP.NET API process.
- Packaging excludes `dist/webapi` in `electron-builder.yml`, so local API cannot ship inside desktop package.
- Root `build` pipeline omits `build:webapi`.
- Backend CORS policy mismatch: registers `DevCorsPolicy` but calls `UseCors("AllowFrontend")`.
- README does not match actual monorepo structure.

## Target Architecture

### Runtime Modes
- `remote` (default): Desktop points UI to configured remote API endpoint.
- `local`: Desktop launches local ASP.NET API and uses loopback URL.
- `auto` (recommended optional): Try remote health first, then fallback to local when enabled.

### Responsibilities
- `webapi`: domain, persistence, HTTP endpoints, health endpoint, CORS by configuration.
- `webui`: single API client contract; receives resolved API base URL at runtime.
- `desktop`: mode resolution, health checks, process lifecycle management for local API, config bridge to renderer.

## Data Flow
1. Electron starts and loads persisted app settings.
2. Electron resolves mode (`remote`/`local`/`auto`) and target base URL.
3. For local mode, Electron launches API process and waits until health endpoint responds.
4. Electron injects resolved API base URL into renderer (preload API).
5. WebUI uses one base URL for all requests (`/api/...`) without caring about API location.

## Configuration Contract
Use a single runtime contract in desktop settings:
- `api.mode`: `remote | local | auto`
- `api.remoteBaseUrl`: string
- `api.local.enabled`: boolean
- `api.local.port`: number (fixed) or port range strategy
- `api.healthPath`: string (e.g. `/health`)
- `api.startupTimeoutMs`, `api.healthRetryCount`

Renderer should consume resolved values via preload bridge, not direct env assumptions.

## Failure Handling
- Remote unreachable in `remote` mode: show retry/settings UI state.
- Remote unreachable in `auto` mode: start local API if enabled; switch to local base URL.
- Local process crash: capture logs, show local backend error, offer remote fallback.
- Port conflict: try next available port within bounded range (e.g. `5073-5085`).
- Startup timeout: fail fast with diagnostics and mode-specific recovery options.

## Security and Reliability
- Keep `contextIsolation: true`, `nodeIntegration: false`, preload minimal.
- Limit local API to loopback interface.
- Avoid exposing process spawn controls to renderer.
- Add structured logs for mode decisions and API process lifecycle.

## Repository and Build Structure
Recommended repository organization:
- Root: orchestration scripts, electron-builder, workspace config.
- `desktop/`: Electron main + preload only.
- `webui/`: React app source and build config.
- `webapi/`: .NET solution and projects.
- `dist/desktop`, `dist/webui`, `dist/webapi`: production artifacts.

## Concrete Fix Plan
1. Standardize package management on pnpm at root.
2. Fix workspace declarations to match actual package folders.
3. Add desktop runtime config + mode resolver.
4. Add local API process manager in Electron main process.
5. Add API health endpoint in ASP.NET host.
6. Fix CORS policy registration/use mismatch.
7. Include `dist/webapi` in electron packaging files.
8. Ensure root build includes webui, desktop, and webapi outputs.
9. Update README with real architecture and dev/prod startup flow.

## Testing Strategy
- Unit tests (desktop):
  - mode resolution (`remote`/`local`/`auto`)
  - fallback decisions
  - port selection behavior
- Integration tests (desktop+api):
  - local API startup and health wait logic
  - process restart/exit handling
- API tests (webapi):
  - `/health` response and startup readiness
  - CORS behavior by configured origin/mode
- UI tests (webui):
  - boot behavior on connection states (connected/fallback/error)
- Packaging smoke tests:
  - verify packaged app includes `webui` and `webapi`
  - verify local mode works offline

## Incremental Rollout
Phase 1:
- Structural corrections (workspace, build, CORS mismatch, packaging include rules).

Phase 2:
- Desktop runtime config + remote-first connection path.

Phase 3:
- Optional local API launch and fallback behavior.

Phase 4:
- Hardening (logging, retries, UX states, installer verification).

## Notes on Vite
Current UI uses Rsbuild. If strict Vite adoption is required, plan a separate migration track:
- Replace Rsbuild config with Vite config.
- Update scripts/build outputs to keep `dist/webui` contract unchanged.
- Keep Electron and API integration contract stable during migration.