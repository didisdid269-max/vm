import { useState } from "react";
import CreateVMDialog from "@/components/virtualbox/CreateVMDialog";
import { Play, Plus, Trash2 } from "lucide-react";

export default function VMManager({ vms, onStart, onCreate, onDelete }) {
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState(vms[0] || null);

  const vm = selected || vms[0];

  return (
    <div className="flex flex-col h-screen bg-[#3c3c3c] text-white select-none overflow-hidden font-sans">
      {/* Title bar */}
      <div className="flex items-center gap-2 bg-[#2d2d2d] px-4 py-2 border-b border-[#1a1a1a] text-sm">
        <span className="text-lg">📦</span>
        <span className="font-semibold text-gray-200">Oracle VM VirtualBox Manager</span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 bg-[#4a4a4a] px-3 py-2 border-b border-[#2a2a2a]">
        <ToolBtn icon={<Plus className="w-4 h-4" />} label="New VM" onClick={() => setShowCreate(true)} />
        <div className="w-px h-7 bg-[#2a2a2a]" />
        <ToolBtn
          icon={<Play className="w-4 h-4 text-green-400" />}
          label="Start"
          onClick={() => vm && onStart(vm)}
          disabled={!vm}
          highlight
        />
        <ToolBtn
          icon={<Trash2 className="w-4 h-4 text-red-400" />}
          label="Delete"
          onClick={() => { if (vm) { onDelete(vm.id); setSelected(null); } }}
          disabled={!vm}
        />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-[#2d2d2d] border-r border-[#1a1a1a] overflow-y-auto flex-shrink-0">
          <div className="px-3 py-2 text-xs text-gray-400 uppercase tracking-wider font-semibold border-b border-[#1a1a1a]">
            Virtual Machines ({vms.length})
          </div>
          {vms.length === 0 && (
            <div className="p-6 text-xs text-gray-500 text-center">
              <div className="text-3xl mb-2">📦</div>
              No VMs yet. Create one!
            </div>
          )}
          {vms.map((v) => (
            <div
              key={v.id}
              onClick={() => setSelected(v)}
              className={`flex items-center gap-3 px-3 py-3 cursor-pointer border-b border-[#1a1a1a] hover:bg-[#4a4a4a] transition-colors ${selected?.id === v.id ? "bg-[#0078d4]" : ""}`}
            >
              <span className="text-2xl">{v.osIcon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{v.name}</div>
                <div className="text-xs text-gray-400 truncate">{v.os} · {v.ram >= 1024 ? `${v.ram/1024}GB` : `${v.ram}MB`} RAM</div>
              </div>
            </div>
          ))}
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col items-center justify-center bg-[#3c3c3c] p-8">
          {vm ? (
            <div className="max-w-lg w-full">
              <div className="text-center mb-8">
                <div className="text-7xl mb-3">{vm.osIcon}</div>
                <h1 className="text-2xl font-bold mb-1">{vm.name}</h1>
                <p className="text-gray-400 text-sm">{vm.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-8">
                <Stat label="RAM" value={vm.ram >= 1024 ? `${vm.ram/1024} GB` : `${vm.ram} MB`} />
                <Stat label="CPUs" value={`${vm.cpus} Core${vm.cpus > 1 ? "s" : ""}`} />
                <Stat label="Storage" value={`${vm.storage} GB`} />
              </div>

              <button
                onClick={() => onStart(vm)}
                className="w-full py-4 bg-green-600 hover:bg-green-500 text-white text-lg font-semibold rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg"
              >
                <Play className="w-6 h-6 fill-white" />
                Start Virtual Machine
              </button>
              <p className="text-center text-xs text-gray-500 mt-3">Click Start to launch the desktop environment</p>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <div className="text-5xl mb-3">📦</div>
              <div>Select or create a virtual machine</div>
            </div>
          )}
        </div>
      </div>

      {showCreate && (
        <CreateVMDialog
          onClose={() => setShowCreate(false)}
          onCreate={(vm) => { onCreate(vm); setShowCreate(false); }}
        />
      )}
    </div>
  );
}

function ToolBtn({ icon, label, onClick, disabled, highlight }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
        disabled ? "text-gray-600 cursor-not-allowed" :
        highlight ? "bg-green-700 hover:bg-green-600 text-white cursor-pointer" :
        "text-gray-200 hover:bg-[#5a5a5a] cursor-pointer"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-[#2d2d2d] rounded-lg p-3 text-center border border-[#1a1a1a]">
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}