import { useState } from "react";
import VMManager from "@/components/virtualbox/VMManager";
import DesktopOS from "@/components/virtualbox/DesktopOS";

const defaultVMs = [
  { id: 1, name: "Ubuntu 22.04 LTS", os: "Linux", osIcon: "🐧", ram: 4096, cpus: 2, storage: 25, network: "NAT", description: "Ubuntu 22.04 LTS (Jammy Jellyfish)" },
  { id: 2, name: "Windows 11", os: "Windows", osIcon: "🪟", ram: 8192, cpus: 4, storage: 80, network: "Bridged Adapter", description: "Windows 11 Pro 22H2" },
  { id: 3, name: "Kali Linux", os: "Linux", osIcon: "🐉", ram: 2048, cpus: 2, storage: 20, network: "Host-Only Adapter", description: "Kali Linux 2024.1" },
  { id: 4, name: "macOS Ventura", os: "macOS", osIcon: "🍎", ram: 8192, cpus: 4, storage: 60, network: "NAT", description: "macOS Ventura 13.6" },
  { id: 5, name: "Android 14", os: "Android", osIcon: "🤖", ram: 4096, cpus: 4, storage: 32, network: "NAT", description: "Android 14 (API 34) x86_64" },
];

export default function VirtualBox() {
  const [vms, setVMs] = useState(defaultVMs);
  const [runningVM, setRunningVM] = useState(null);
  const [booting, setBooting] = useState(false);

  const handleStart = (vm) => {
    setBooting(vm);
    setTimeout(() => {
      setBooting(false);
      setRunningVM(vm);
    }, 2500);
  };

  const handleCreate = (newVM) => {
    const vm = { ...newVM, id: Date.now() };
    setVMs((prev) => [...prev, vm]);
  };

  const handleDelete = (id) => {
    setVMs((prev) => prev.filter((v) => v.id !== id));
  };

  if (booting) {
    return <BootScreen vm={booting} />;
  }

  if (runningVM) {
    return <DesktopOS vm={runningVM} onExit={() => setRunningVM(null)} />;
  }

  return (
    <VMManager
      vms={vms}
      onStart={handleStart}
      onCreate={handleCreate}
      onDelete={handleDelete}
    />
  );
}

function BootScreen({ vm }) {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center">
      <div className="text-green-400 font-mono text-sm space-y-1 w-96">
        {[
          "BIOS Version 2.0.2 ...",
          "Initializing virtual hardware...",
          "Loading kernel modules...",
          "Starting virtual CPU(s)...",
          "Mounting virtual disk...",
          "Loading operating system...",
        ].map((line, i) => (
          <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}>
            {line}
          </div>
        ))}
        <div className="mt-4 flex gap-1">
          {[0,1,2].map(i => (
            <div key={i} className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: `${i*0.2}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}