import { Monitor, Cpu, HardDrive, Network, Terminal } from "lucide-react";

const stateColors = {
  "Running": "text-green-400",
  "Powered Off": "text-gray-400",
  "Saved": "text-yellow-400",
  "Paused": "text-orange-400",
};

export default function VMDetails({ vm, consoleLogs }) {
  if (!vm) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#3c3c3c] text-gray-500">
        <div className="text-center">
          <div className="text-5xl mb-3">📦</div>
          <div className="text-sm">Select or create a virtual machine</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#3c3c3c] overflow-hidden">
      {/* VM Header */}
      <div className="flex items-center gap-3 px-6 py-4 bg-[#2d2d2d] border-b border-[#1a1a1a]">
        <span className="text-4xl">{vm.osIcon}</span>
        <div>
          <h1 className="text-lg font-semibold">{vm.name}</h1>
          <span className={`text-sm font-medium ${stateColors[vm.state] || "text-gray-400"}`}>
            ● {vm.state}
          </span>
        </div>
      </div>

      {/* Screen Preview */}
      <div className="mx-6 mt-4 rounded-lg overflow-hidden border-2 border-[#1a1a1a] bg-black relative" style={{ height: 200 }}>
        {vm.state === "Running" ? (
          <div className="w-full h-full flex items-center justify-center bg-[#0d1117]">
            <div className="text-center">
              <div className="text-green-400 font-mono text-sm mb-2">
                {vm.os === "Windows" ? "Windows Loading..." : `${vm.name} ~$`}
              </div>
              <div className="flex gap-1 justify-center">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <div className="text-gray-500 text-xs mt-2 font-mono">VM is running</div>
            </div>
          </div>
        ) : vm.state === "Saved" ? (
          <div className="w-full h-full flex items-center justify-center bg-[#1a1a2e]">
            <div className="text-yellow-400 text-sm font-mono">[ Saved State ]</div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <div className="text-gray-600 text-sm font-mono">[ Powered Off ]</div>
          </div>
        )}
        <div className="absolute bottom-2 right-2 text-xs text-gray-600 font-mono">
          {vm.name}
        </div>
      </div>

      {/* Specs Grid */}
      <div className="grid grid-cols-2 gap-3 mx-6 mt-4">
        <SpecCard icon={<Monitor className="w-4 h-4 text-blue-400" />} label="General" items={[
          { k: "Guest OS", v: vm.description },
          { k: "Type", v: vm.os },
        ]} />
        <SpecCard icon={<Cpu className="w-4 h-4 text-purple-400" />} label="System" items={[
          { k: "RAM", v: `${vm.ram} MB (${(vm.ram / 1024).toFixed(1)} GB)` },
          { k: "CPUs", v: `${vm.cpus} Core${vm.cpus > 1 ? "s" : ""}` },
        ]} />
        <SpecCard icon={<HardDrive className="w-4 h-4 text-green-400" />} label="Storage" items={[
          { k: "Disk Size", v: `${vm.storage} GB (VDI)` },
          { k: "Type", v: "Dynamically allocated" },
        ]} />
        <SpecCard icon={<Network className="w-4 h-4 text-orange-400" />} label="Network" items={[
          { k: "Adapter 1", v: vm.network },
          { k: "Status", v: vm.state === "Running" ? "Connected" : "Disconnected" },
        ]} />
      </div>

      {/* Console Log */}
      <div className="mx-6 mt-4 mb-4 flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-2 mb-1 text-xs text-gray-400">
          <Terminal className="w-3 h-3" />
          <span>Activity Log</span>
        </div>
        <div className="flex-1 bg-black rounded border border-[#1a1a1a] p-2 overflow-y-auto font-mono text-xs text-green-400 min-h-[60px] max-h-[100px]">
          {consoleLogs.length === 0 ? (
            <span className="text-gray-600">No activity yet...</span>
          ) : (
            consoleLogs.map((line, i) => <div key={i}>{line}</div>)
          )}
        </div>
      </div>
    </div>
  );
}

function SpecCard({ icon, label, items }) {
  return (
    <div className="bg-[#2d2d2d] rounded-lg p-3 border border-[#1a1a1a]">
      <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-gray-300">
        {icon} {label}
      </div>
      {items.map(({ k, v }) => (
        <div key={k} className="flex justify-between text-xs mt-1">
          <span className="text-gray-500">{k}:</span>
          <span className="text-gray-200 text-right ml-2 truncate max-w-[140px]" title={v}>{v}</span>
        </div>
      ))}
    </div>
  );
}