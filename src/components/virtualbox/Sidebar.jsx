const stateColors = {
  "Running": "bg-green-500",
  "Powered Off": "bg-gray-500",
  "Saved": "bg-yellow-500",
  "Paused": "bg-orange-500",
};

export default function Sidebar({ vms, selectedVM, onSelect }) {
  return (
    <div className="w-64 bg-[#2d2d2d] border-r border-[#1a1a1a] overflow-y-auto flex-shrink-0">
      <div className="px-3 py-2 text-xs text-gray-400 uppercase tracking-wider font-semibold border-b border-[#1a1a1a]">
        Virtual Machines
      </div>
      {vms.length === 0 && (
        <div className="p-4 text-xs text-gray-500 text-center">No VMs yet. Create one!</div>
      )}
      {vms.map((vm) => (
        <div
          key={vm.id}
          onClick={() => onSelect(vm)}
          className={`flex items-center gap-3 px-3 py-3 cursor-pointer border-b border-[#1a1a1a] hover:bg-[#4a4a4a] transition-colors ${
            selectedVM?.id === vm.id ? "bg-[#0078d4] hover:bg-[#0078d4]" : ""
          }`}
        >
          <span className="text-2xl">{vm.osIcon}</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{vm.name}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${stateColors[vm.state] || "bg-gray-500"}`} />
              <span className="text-xs text-gray-400 truncate">{vm.state}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}