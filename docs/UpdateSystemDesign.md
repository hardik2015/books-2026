# Software Update System Design Document

## Overview
This document describes the software update system for the Books-2026 application. The system uses Electron's auto-updater to provide automatic update functionality for desktop installations.

## Components

### 1. AutoUpdater Configuration
**File:** `main/registerAutoUpdaterListeners.ts`

#### Configuration Settings
- `autoUpdater.autoDownload = false`: Disables automatic download of updates
- `autoUpdater.allowPrerelease = true`: Allows prerelease versions to be downloaded
- `autoUpdater.autoInstallOnAppQuit = true`: Automatically installs updates when the app quits

#### Event Handlers

##### `error` event
- **Purpose**: Handles errors during the update process
- **Process**:
  - Sets `checkedForUpdate` flag to prevent repeated checks
  - Ignores network errors to avoid unnecessary error reporting
  - Emits main process error for other types of errors

##### `update-available` event
- **Purpose**: Handles when an update is available for download
- **Process**:
  - Gets current and next version information
  - Checks if current version is beta and next version is beta
  - Shows dialog for beta updates to non-beta users (Yes/No)
  - Downloads update if user confirms or if not a beta transition
  - Calls `autoUpdater.downloadUpdate()` to start download

##### `update-downloaded` event
- **Purpose**: Handles when an update has been downloaded
- **Process**:
  - Shows dialog asking user to restart to install update
  - Calls `autoUpdater.quitAndInstall()` if user confirms

### 2. Update Check Handler
**File:** `main/registerIpcMainActionListeners.ts`

#### IPC Action: `CHECK_FOR_UPDATES`
- **Purpose**: Initiates the update check process
- **Process**:
  - Checks if in development mode or already checked for update
  - Calls `autoUpdater.checkForUpdates()` to check for updates
  - Handles network errors gracefully
  - Emits main process error for non-network errors

### 3. Renderer Interface
**File:** `main/preload.ts`

#### `checkForUpdates()` Method
- **Purpose**: Exposes update check functionality to the renderer process
- **Process**: Invokes the `CHECK_FOR_UPDATES` IPC action

### 4. Build Configuration
**File:** `electron-builder-config.mjs`

#### Publishing Configuration
- Updates are published to GitHub (`publish: ['github']`)
- Different configurations for Mac, Windows, and Linux platforms
- Artifact naming includes version information

## Update Flow

```
Application Startup
        ↓
Check if development mode or already checked
        ↓
Call autoUpdater.checkForUpdates()
        ↓
If update available → Show update-available dialog
        ↓
If user confirms → Download update
        ↓
When download complete → Show update-downloaded dialog
        ↓
If user confirms → Install update on quit
```

## Security Features

### 1. Update Verification
- Electron-updater verifies update integrity
- GitHub publishing ensures authenticity
- Code signing for Windows and macOS builds

### 2. Prerelease Handling
- Beta versions are treated differently
- Users are prompted before downloading beta updates
- Prevents accidental downgrade from stable to beta

### 3. Network Error Handling
- Network errors are handled gracefully
- Prevents error spamming during connectivity issues

## Configuration Options

### 1. Update Behavior
- Manual download initiation (autoDownload = false)
- Automatic installation on quit (autoInstallOnAppQuit = true)
- Prerelease support (allowPrerelease = true)

### 2. User Experience
- Dialog-based confirmation for beta updates
- Dialog-based restart confirmation for installed updates
- Cross-platform compatibility

## Files Summary

| File | Purpose |
|------|---------|
| `main/registerAutoUpdaterListeners.ts` | Core update logic and event handlers |
| `main/registerIpcMainActionListeners.ts` | IPC handler for update checks |
| `main/preload.ts` | Renderer interface for update functionality |
| `electron-builder-config.mjs` | Build configuration with update publishing settings |

## Maintenance Notes

### 1. Update Server Configuration
- Currently configured to use GitHub releases
- Can be changed by modifying the publish configuration
- Supports different channels (stable, beta)

### 2. Error Handling
- Network errors are suppressed to avoid false positives
- Other errors are reported through the error handling system
- Development mode skips update checks

### 3. Version Management
- Uses semantic versioning
- Beta versions are identified by "beta" in version string
- Prerelease versions are allowed by configuration

### 4. Platform Support
- Works on Windows, macOS, and Linux
- Platform-specific build configurations
- Different installer types for each platform

## Testing Considerations

- Mock the autoUpdater in unit tests
- Test both stable and beta update flows
- Verify error handling for network issues
- Test cross-platform compatibility
- Validate update integrity verification