import Cocoa
import Foundation

// MARK: - JSON Output Helpers

struct WindowInfo: Codable {
    let pid: Int32
    let appName: String
    let windowTitle: String
    let windowId: Int
    let x: Int
    let y: Int
    let width: Int
    let height: Int
    let isOnScreen: Bool
}

struct AppInfo: Codable {
    let pid: Int32
    let name: String
    let bundleId: String?
    let icon: String? // base64 encoded small icon (optional, for UI)
}

// MARK: - Accessibility Check

func checkAccessibility() -> Bool {
    let options = [kAXTrustedCheckOptionPrompt.takeUnretainedValue() as String: true] as CFDictionary
    return AXIsProcessTrustedWithOptions(options)
}

// MARK: - List All Windows

func listWindows() -> [WindowInfo] {
    let options = CGWindowListOption(arrayLiteral: .optionOnScreenOnly, .excludeDesktopElements)
    guard let windowList = CGWindowListCopyWindowInfo(options, kCGNullWindowID) as? [[String: Any]] else {
        return []
    }

    var results: [WindowInfo] = []

    for window in windowList {
        guard let pid = window[kCGWindowOwnerPID as String] as? Int32,
              let appName = window[kCGWindowOwnerName as String] as? String,
              let windowId = window[kCGWindowNumber as String] as? Int,
              let bounds = window[kCGWindowBounds as String] as? [String: Any],
              let x = bounds["X"] as? Int,
              let y = bounds["Y"] as? Int,
              let w = bounds["Width"] as? Int,
              let h = bounds["Height"] as? Int,
              let layer = window[kCGWindowLayer as String] as? Int,
              layer == 0 // normal windows only
        else { continue }

        // Skip tiny windows (menu extras, status items)
        guard w > 50 && h > 50 else { continue }

        let title = window[kCGWindowName as String] as? String ?? ""
        let isOnScreen = window[kCGWindowIsOnscreen as String] as? Bool ?? true

        results.append(WindowInfo(
            pid: pid,
            appName: appName,
            windowTitle: title,
            windowId: windowId,
            x: x, y: y,
            width: w, height: h,
            isOnScreen: isOnScreen
        ))
    }

    return results
}

// MARK: - List Running Apps

func listApps() -> [AppInfo] {
    let workspace = NSWorkspace.shared
    let runningApps = workspace.runningApplications.filter {
        $0.activationPolicy == .regular // only apps that appear in Dock
    }

    return runningApps.map { app in
        AppInfo(
            pid: app.processIdentifier,
            name: app.localizedName ?? "Unknown",
            bundleId: app.bundleIdentifier,
            icon: nil
        )
    }
}

// MARK: - Move & Resize Window

func moveWindow(pid: Int32, windowIndex: Int, x: Int, y: Int, width: Int, height: Int) -> Bool {
    let app = AXUIElementCreateApplication(pid)
    var windowsRef: CFTypeRef?

    let result = AXUIElementCopyAttributeValue(app, kAXWindowsAttribute as CFString, &windowsRef)
    guard result == .success, let windows = windowsRef as? [AXUIElement], windowIndex < windows.count else {
        return false
    }

    let window = windows[windowIndex]

    // Set size first so the window can fit, then position
    var size = CGSize(width: CGFloat(width), height: CGFloat(height))
    if let sizeValue = AXValueCreate(.cgSize, &size) {
        AXUIElementSetAttributeValue(window, kAXSizeAttribute as CFString, sizeValue)
    }

    // Small delay to let macOS process the resize before repositioning
    usleep(50_000) // 50ms

    // Set position
    var point = CGPoint(x: CGFloat(x), y: CGFloat(y))
    if let positionValue = AXValueCreate(.cgPoint, &point) {
        AXUIElementSetAttributeValue(window, kAXPositionAttribute as CFString, positionValue)
    }

    return true
}

// MARK: - Focus App

func focusApp(pid: Int32) -> Bool {
    guard let app = NSRunningApplication(processIdentifier: pid) else {
        return false
    }
    if #available(macOS 14.0, *) {
        app.activate()
        return true
    } else {
        return app.activate(options: [.activateIgnoringOtherApps])
    }
}

// MARK: - Hide App

func hideApp(pid: Int32) -> Bool {
    guard let app = NSRunningApplication(processIdentifier: pid) else {
        return false
    }
    return app.hide()
}

// MARK: - Get Screen Dimensions

func getScreenInfo() -> [String: Any] {
    guard let screen = NSScreen.main else {
        return ["error": "No screen found"]
    }
    let frame = screen.visibleFrame // excludes menu bar and dock
    let fullFrame = screen.frame
    return [
        "x": Int(frame.origin.x),
        "y": Int(fullFrame.height - frame.origin.y - frame.height), // flip Y for CG coords
        "width": Int(frame.width),
        "height": Int(frame.height),
        "fullWidth": Int(fullFrame.width),
        "fullHeight": Int(fullFrame.height),
        "menuBarHeight": Int(fullFrame.height - frame.height - frame.origin.y)
    ]
}

// MARK: - CLI Entry Point

let args = CommandLine.arguments

guard args.count >= 2 else {
    let usage = """
    Usage:
      window-helper list-windows
      window-helper list-apps
      window-helper move <pid> <windowIndex> <x> <y> <width> <height>
      window-helper focus <pid>
      window-helper hide <pid>
      window-helper screen-info
      window-helper check-access
    """
    print(usage)
    exit(1)
}

let command = args[1]
let encoder = JSONEncoder()
encoder.outputFormatting = .prettyPrinted

switch command {
case "list-windows":
    let windows = listWindows()
    if let data = try? encoder.encode(windows), let json = String(data: data, encoding: .utf8) {
        print(json)
    }

case "list-apps":
    let apps = listApps()
    if let data = try? encoder.encode(apps), let json = String(data: data, encoding: .utf8) {
        print(json)
    }

case "move":
    guard args.count >= 8,
          let pid = Int32(args[2]),
          let winIdx = Int(args[3]),
          let x = Int(args[4]),
          let y = Int(args[5]),
          let w = Int(args[6]),
          let h = Int(args[7]) else {
        print("{\"error\": \"Invalid move arguments. Usage: move <pid> <windowIndex> <x> <y> <width> <height>\"}")
        exit(1)
    }
    let success = moveWindow(pid: pid, windowIndex: winIdx, x: x, y: y, width: w, height: h)
    print("{\"success\": \(success)}")

case "focus":
    guard args.count >= 3, let pid = Int32(args[2]) else {
        print("{\"error\": \"Invalid focus arguments\"}")
        exit(1)
    }
    let success = focusApp(pid: pid)
    print("{\"success\": \(success)}")

case "hide":
    guard args.count >= 3, let pid = Int32(args[2]) else {
        print("{\"error\": \"Invalid hide arguments\"}")
        exit(1)
    }
    let success = hideApp(pid: pid)
    print("{\"success\": \(success)}")

case "screen-info":
    let info = getScreenInfo()
    if let data = try? JSONSerialization.data(withJSONObject: info),
       let json = String(data: data, encoding: .utf8) {
        print(json)
    }

case "check-access":
    let trusted = checkAccessibility()
    print("{\"trusted\": \(trusted)}")

default:
    print("{\"error\": \"Unknown command: \(command)\"}")
    exit(1)
}
