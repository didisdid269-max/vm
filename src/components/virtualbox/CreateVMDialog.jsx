import { useState } from "react";
import { X } from "lucide-react";

const OS_OPTIONS = [
  { label: "Ubuntu 22.04 LTS", os: "Linux", icon: "🐧", desc: "Ubuntu 22.04 LTS (Jammy Jellyfish)" },
  { label: "Ubuntu 20.04 LTS", os: "Linux", icon: "🐧", desc: "Ubuntu 20.04 LTS (Focal Fossa)" },
  { label: "Debian 12", os: "Linux", icon: "🌀", desc: "Debian GNU/Linux 12 (Bookworm)" },
  { label: "Kali Linux", os: "Linux", icon: "🐉", desc: "Kali Linux 2024.1" },
  { label: "Fedora 40", os: "Linux", icon: "🎩", desc: "Fedora Linux 40" },
  { label: "Windows 11", os: "Windows", icon: "🪟", desc: "Windows 11 Pro 22H2" },
  { label: "Windows 10", os: "Windows", icon: "🪟", desc: "Windows 10 Pro 22H2" },
  { label: "macOS Ventura", os: "macOS", icon: "🍎", desc: "macOS Ventura 13" },
  { label: "FreeBSD 14", os: "BSD", icon: "😈", desc: "FreeBSD 14.0-RELEASE" },
];

export default function CreateVMDialog({ onClose, onCreate }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    osOption: OS_OPTIONS[0],
    ram: 2048,
    cpus: 2,
    storage: 20,
    network: "NAT",
    state: "Powered Off",
  });

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleCreate = () => {
    onCreate({
      name: form.name || form.osOption.label,
      os: form.osOption.os,
      osIcon: form.osOption.icon,
      description: form.osOption.desc,
      ram: form.ram,
      cpus: form.cpus,
      storage: form.storage,
      network: form.network,
      state: "Powered Off",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#3c3c3c] border border-[#1a1a1a] rounded-lg w-[500px] max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#2d2d2d] border-b border-[#1a1a1a]">
          <div className="flex items-center gap-2">
            <span className="text-lg">📦</span>
            <span className="font-semibold text-sm">Create Virtual Machine</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="flex px-5 py-2 gap-2 text-xs border-b border-[#1a1a1a] bg-[#333]">
          {["Name & OS", "Hardware", "Storage"].map((s, i) => (
            <span
              key={s}
              className={`px-2 py-1 rounded ${step === i + 1 ? "bg-[#0078d4] text-white" : "text-gray-500"}`}
            >
              {i + 1}. {s}
            </span>
          ))}
        </div>

        <div className="p-5 space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">VM Name</label>
                <input
                  className="w-full bg-[#2d2d2d] border border-[#555] rounded px-3 py-2 text-sm text-white outline-none focus:border-[#0078d4]"
                  placeholder="e.g. My Ubuntu VM"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Guest Operating System</label>
                <div className="grid grid-cols-1 gap-1.5 max-h-52 overflow-y-auto">
                  {OS_OPTIONS.map((opt) => (
                    <div
                      key={opt.label}
                      onClick={() => set("osOption", opt)}
                      className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer border transition-colors ${
                        form.osOption.label === opt.label
                          ? "border-[#0078d4] bg-[#0078d4]/20"
                          : "border-[#555] hover:bg-[#4a4a4a]"
                      }`}
                    >
                      <span className="text-xl">{opt.icon}</span>
                      <div>
                        <div className="text-sm">{opt.label}</div>
                        <div className="text-xs text-gray-400">{opt.os}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <SliderField label="Base Memory (RAM)" min={512} max={16384} step={512} value={form.ram} onChange={(v) => set("ram", v)} unit="MB" display={`${form.ram} MB (${(form.ram / 1024).toFixed(1)} GB)`} />
              <SliderField label="Processors (CPUs)" min={1} max={8} step={1} value={form.cpus} onChange={(v) => set("cpus", v)} unit="" display={`${form.cpus} CPU${form.cpus > 1 ? "s" : ""}`} />
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Network</label>
                <select
                  className="w-full bg-[#2d2d2d] border border-[#555] rounded px-3 py-2 text-sm text-white outline-none focus:border-[#0078d4]"
                  value={form.network}
                  onChange={(e) => set("network", e.target.value)}
                >
                  {["NAT", "Bridged Adapter", "Host-Only Adapter", "Internal Network", "Not Attached"].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {step === 3 && (
            <SliderField label="Disk Size" min={8} max={500} step={4} value={form.storage} onChange={(v) => set("storage", v)} unit="GB" display={`${form.storage} GB (VDI, Dynamically allocated)`} />
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between px-5 py-3 bg-[#2d2d2d] border-t border-[#1a1a1a]">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="px-4 py-1.5 text-sm rounded border border-[#555] text-gray-300 hover:bg-[#4a4a4a] transition-colors"
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-4 py-1.5 text-sm rounded bg-[#0078d4] text-white hover:bg-[#0066b2] transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleCreate}
              className="px-4 py-1.5 text-sm rounded bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Create VM
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SliderField({ label, min, max, step, value, onChange, display }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <label className="text-xs text-gray-400">{label}</label>
        <span className="text-xs text-gray-200">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#0078d4]"
      />
      <div className="flex justify-between text-xs text-gray-600 mt-0.5">
        <span>{min}{step === 512 || step === 4 ? (min >= 1024 ? " GB" : " MB") : ""}</span>
        <span>{max}{step === 512 ? " MB" : step === 4 ? " GB" : ""}</span>
      </div>
    </div>
  );
}