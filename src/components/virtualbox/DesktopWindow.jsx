import { useState, useRef, useCallback } from "react";
import { X, Minus, Square } from "lucide-react";
import AppContent from "@/components/virtualbox/AppContent";

export default function DesktopWindow({ win, vmOS, onClose, onMinimize, onFocus, onMove }) {
  const [size, setSize] = useState({ w: 600, h: 420 });
  const [maximized, setMaximized] = useState(false);
  const dragOffset = useRef(null);
  const winRef = useRef(null);

  const isWindows = vmOS === "Windows";

  const onMouseDown = useCallback((e) => {
    if (maximized) return;
    e.preventDefault();
    onFocus();
    dragOffset.current = { dx: e.clientX - win.x, dy: e.clientY - win.y };
    const onMove_ = (e2) => {
      onMove(win.id, e2.clientX - dragOffset.current.dx, e2.clientY - dragOffset.current.dy);
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove_);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove_);
    window.addEventListener("mouseup", onUp);
  }, [win.x, win.y, win.id, maximized, onFocus, onMove]);

  const style = maximized
    ? { position: "absolute", inset: 0, zIndex: win.zIndex }
    : { position: "absolute", left: win.x, top: win.y, width: size.w, height: size.h, zIndex: win.zIndex };

  return (
    <div
      ref={winRef}
      style={style}
      className="flex flex-col rounded-lg overflow-hidden shadow-2xl border border-white/10"
      onClick={onFocus}
    >
      {/* Title bar */}
      <div
        className={`flex items-center px-3 py-2 cursor-move flex-shrink-0 ${
          isWindows ? "bg-[#1f1f1f]" : "bg-[#3b3b3b]"
        }`}
        onMouseDown={onMouseDown}
      >
        <span className="mr-2">{win.icon}</span>
        <span className="text-white text-xs font-medium flex-1 truncate">{win.title}</span>
        <div className="flex items-center gap-1">
          <WinBtn icon={<Minus className="w-3 h-3" />} onClick={onMinimize} color="hover:bg-yellow-500" />
          <WinBtn icon={<Square className="w-3 h-3" />} onClick={() => setMaximized(!maximized)} color="hover:bg-green-500" />
          <WinBtn icon={<X className="w-3 h-3" />} onClick={onClose} color="hover:bg-red-500" />
        </div>
      </div>

      {/* App content */}
      <div className="flex-1 bg-white overflow-auto">
        <AppContent appId={win.appId} vmName={win.title} />
      </div>
    </div>
  );
}

function WinBtn({ icon, onClick, color }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`w-5 h-5 rounded-full flex items-center justify-center text-gray-300 bg-white/10 ${color} transition-colors`}
    >
      {icon}
    </button>
  );
}