import { Plus, Play, Square, Pause, RotateCcw, Trash2, Settings } from "lucide-react";

export default function Toolbar({ vm, onNew, onStart, onStop, onPause, onReset, onDelete }) {
  const isRunning = vm?.state === "Running";
  const hasSomething = !!vm;

  const btn = (icon, label, action, disabled) => (
    <button
      key={label}
      onClick={action}
      disabled={disabled}
      title={label}
      className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded text-xs transition-colors ${
        disabled
          ? "text-gray-600 cursor-not-allowed"
          : "text-gray-200 hover:bg-[#5a5a5a] cursor-pointer"
      }`}
    >
      <span className="w-5 h-5">{icon}</span>
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex items-center gap-1 bg-[#4a4a4a] px-2 py-1 border-b border-[#2a2a2a]">
      {btn(<Plus className="w-5 h-5" />, "New", onNew, false)}
      <div className="w-px h-8 bg-[#2a2a2a] mx-1" />
      {btn(<Settings className="w-5 h-5" />, "Settings", () => {}, !hasSomething)}
      <div className="w-px h-8 bg-[#2a2a2a] mx-1" />
      {btn(<Play className="w-5 h-5 text-green-400" />, "Start", onStart, !hasSomething || isRunning)}
      {btn(<Pause className="w-5 h-5 text-yellow-400" />, "Pause", onPause, !isRunning)}
      {btn(<Square className="w-5 h-5 text-red-400" />, "Stop", onStop, !isRunning)}
      {btn(<RotateCcw className="w-5 h-5" />, "Reset", onReset, !hasSomething)}
      <div className="w-px h-8 bg-[#2a2a2a] mx-1" />
      {btn(<Trash2 className="w-5 h-5 text-red-400" />, "Delete", onDelete, !hasSomething)}
    </div>
  );
}