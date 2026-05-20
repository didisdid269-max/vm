import { useState, useEffect, useRef } from "react";
import { X, Minus, Square, Monitor, Wifi, Battery, Volume2, Search } from "lucide-react";
import DesktopWindow from "@/components/virtualbox/DesktopWindow";

const DESKTOP_ICONS = [
  { id: "files", label: "Files", icon: "📁" },
  { id: "browser", label: "Browser", icon: "🌐" },
  { id: "terminal", label: "Terminal", icon: "🖥️" },
  { id: "settings", label: "Settings", icon: "⚙️" },
  { id: "notepad", label: "Notepad", icon: "📝" },
  { id: "calculator", label: "Calculator", icon: "🧮" },
];

export default function DesktopOS({ vm, onExit }) {
  const [time, setTime] = useState(new Date());
  const [windows, setWindows] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const openApp = (appId) => {
    const already = windows.find(w => w.appId === appId);
    if (already) {
      setWindows(prev => prev.map(w => w.id === already.id ? { ...w, minimized: false, zIndex: Date.now() } : w));
      return;
    }
    const id = nextId;
    setNextId(id + 1);
    setWindows(prev => [...prev, {
      id,
      appId,
      title: DESKTOP_ICONS.find(d => d.id === appId)?.label || appId,
      icon: DESKTOP_ICONS.find(d => d.id === appId)?.icon || "📄",
      minimized: false,
      zIndex: Date.now(),
      x: 60 + (id % 6) * 30,
      y: 40 + (id % 4) * 30,
    }]);
  };

  const closeWindow = (id) => setWindows(prev => prev.filter(w => w.id !== id));
  const minimizeWindow = (id) => setWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: true } : w));
  const focusWindow = (id) => setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: Date.now(), minimized: false } : w));

  const isWindows = vm.os === "Windows";
  const isMacOS = vm.os === "macOS";
  const isAndroid = vm.os === "Android";

  const bgStyle =
    isWindows ? "bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500" :
    isMacOS   ? "bg-gradient-to-br from-pink-900 via-purple-700 to-indigo-600" :
    isAndroid ? "bg-gradient-to-br from-green-900 via-teal-700 to-cyan-600" :
                "bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900";

  // Android: show phone-like layout
  if (isAndroid) {
    return (
      <div className={`fixed inset-0 ${bgStyle} flex flex-col overflow-hidden select-none`}>
        {/* Status bar */}
        <div className="relative z-50 flex items-center justify-between bg-black/50 px-4 py-1 text-white text-xs">
          <span className="font-semibold">{vm.osIcon} {vm.name}</span>
          <div className="flex items-center gap-2">
            <Wifi className="w-3 h-3" />
            <Battery className="w-3 h-3" />
            <span>{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
        </div>
        {/* App grid */}
        <div className="flex-1 p-6 grid grid-cols-4 gap-4 content-start overflow-y-auto">
          {DESKTOP_ICONS.map(app => (
            <div key={app.id} onDoubleClick={() => openApp(app.id)} className="flex flex-col items-center gap-1 cursor-pointer group">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-lg">{app.icon}</div>
              <span className="text-white text-xs font-medium drop-shadow">{app.label}</span>
            </div>
          ))}
        </div>
        {/* Nav bar */}
        <div className="relative z-50 flex items-center justify-around bg-black/50 backdrop-blur px-4 py-3 border-t border-white/10">
          <button onClick={() => setWindows([])} className="text-white text-xl">◀</button>
          <button className="w-5 h-5 rounded-full border-2 border-white" />
          <button className="w-5 h-5 rounded border border-white" />
          <button onClick={() => setShowExitConfirm(true)} className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-white text-xs">Exit VM</button>
        </div>
        {/* Open windows (slide up) */}
        {windows.filter(w => !w.minimized).map(win => (
          <DesktopWindow key={win.id} win={win} vmOS={vm.os}
            onClose={() => closeWindow(win.id)} onMinimize={() => minimizeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            onMove={(id, x, y) => setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w))}
          />
        ))}
        {showExitConfirm && <ExitConfirm onCancel={() => setShowExitConfirm(false)} onExit={onExit} />}
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 ${bgStyle} flex flex-col overflow-hidden select-none`}>
      {/* Wallpaper pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }}
      />

      {/* macOS menu bar */}
      {isMacOS && (
        <div className="relative z-50 flex items-center justify-between bg-black/30 backdrop-blur-md px-4 py-1 text-white text-sm">
          <div className="flex items-center gap-4">
            <span className="font-bold">🍎</span>
            {["Finder", "File", "Edit", "View", "Go", "Window", "Help"].map(m => (
              <span key={m} className="text-xs hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer">{m}</span>
            ))}
          </div>
          <div className="flex items-center gap-3 text-xs">
            <Wifi className="w-3 h-3" />
            <Volume2 className="w-3 h-3" />
            <Battery className="w-3 h-3" />
            <span>{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            <button onClick={() => setShowExitConfirm(true)} className="bg-red-600 hover:bg-red-500 px-2 py-0.5 rounded text-xs">⏻ Exit VM</button>
          </div>
        </div>
      )}

      {/* Linux top bar */}
      {!isWindows && !isMacOS && (
        <div className="relative z-50 flex items-center justify-between bg-black/40 backdrop-blur-sm px-4 py-1 text-white text-sm">
          <div className="flex items-center gap-4">
            <span className="font-bold text-sm">{vm.osIcon} {vm.name}</span>
            {["Applications", "Places", "System"].map(m => (
              <span key={m} className="text-xs hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer">{m}</span>
            ))}
          </div>
          <div className="flex items-center gap-3 text-xs">
            <Wifi className="w-3 h-3" />
            <Volume2 className="w-3 h-3" />
            <Battery className="w-3 h-3" />
            <span>{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            <button onClick={() => setShowExitConfirm(true)} className="bg-red-600 hover:bg-red-500 px-2 py-0.5 rounded text-xs">⏻ Exit VM</button>
          </div>
        </div>
      )}

      {/* Desktop area */}
      <div className="relative flex-1 overflow-hidden">
        {/* Desktop icons */}
        <div className="absolute top-4 left-4 flex flex-col gap-4">
          {DESKTOP_ICONS.map((app) => (
            <div
              key={app.id}
              onDoubleClick={() => openApp(app.id)}
              className="flex flex-col items-center gap-1 cursor-pointer group w-16"
            >
              <div className="text-3xl group-hover:scale-110 transition-transform drop-shadow-lg">{app.icon}</div>
              <span className="text-white text-xs text-center drop-shadow font-medium bg-black/30 px-1 rounded">{app.label}</span>
            </div>
          ))}
        </div>

        {/* Windows */}
        {windows.filter(w => !w.minimized).map(win => (
          <DesktopWindow
            key={win.id}
            win={win}
            vmOS={vm.os}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            onMove={(id, x, y) => setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w))}
          />
        ))}
      </div>

      {/* macOS Dock */}
      {isMacOS && (
        <div className="relative z-50 flex items-center justify-center pb-2">
          <div className="flex items-end gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-xl">
            {DESKTOP_ICONS.map(app => (
              <button key={app.id} onClick={() => openApp(app.id)}
                className="text-3xl hover:scale-125 transition-transform cursor-pointer" title={app.label}>
                {app.icon}
              </button>
            ))}
            <div className="w-px h-8 bg-white/30 mx-1" />
            <button onClick={() => setShowExitConfirm(true)} className="text-2xl hover:scale-125 transition-transform" title="Shut Down">⏻</button>
          </div>
        </div>
      )}

      {/* Windows Taskbar */}
      {isWindows && (
        <div className="relative z-50 flex items-center bg-black/60 backdrop-blur-sm px-2 py-1 gap-2 border-t border-white/10">
          <button className="flex items-center justify-center w-8 h-8 hover:bg-white/10 rounded">
            <span className="text-lg">🪟</span>
          </button>
          <div className="flex items-center bg-white/10 rounded px-2 py-1 gap-1 flex-1 max-w-xs">
            <Search className="w-3 h-3 text-gray-300" />
            <span className="text-xs text-gray-300">Search</span>
          </div>
          <div className="flex gap-1">
            {DESKTOP_ICONS.map(app => (
              <button key={app.id} onClick={() => openApp(app.id)} className="text-lg hover:bg-white/10 px-2 py-1 rounded" title={app.label}>
                {app.icon}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2 text-white text-xs px-2">
            <Wifi className="w-3 h-3" />
            <Volume2 className="w-3 h-3" />
            <Battery className="w-3 h-3" />
            <div className="text-center">
              <div>{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
              <div>{time.toLocaleDateString([], { month: "short", day: "numeric" })}</div>
            </div>
            <button onClick={() => setShowExitConfirm(true)} className="bg-red-600 hover:bg-red-500 px-2 py-0.5 rounded text-xs ml-1">Exit</button>
          </div>
        </div>
      )}

      {showExitConfirm && <ExitConfirm onCancel={() => setShowExitConfirm(false)} onExit={onExit} />}
    </div>
  );
}

function ExitConfirm({ onCancel, onExit }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]">
      <div className="bg-[#2d2d2d] border border-[#555] rounded-xl p-6 text-white text-center shadow-2xl">
        <div className="text-3xl mb-2">⏻</div>
        <h2 className="font-bold mb-1">Shut down virtual machine?</h2>
        <p className="text-gray-400 text-sm mb-5">You will return to the VM Manager.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onCancel} className="px-4 py-2 border border-[#555] rounded-lg hover:bg-white/10 text-sm">Cancel</button>
          <button onClick={onExit} className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-semibold">Shut Down</button>
        </div>
      </div>
    </div>
  );
}