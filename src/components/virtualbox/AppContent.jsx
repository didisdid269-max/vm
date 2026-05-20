import { useState, useRef, useEffect } from "react";

export default function AppContent({ appId }) {
  switch (appId) {
    case "terminal": return <Terminal />;
    case "files": return <FilesApp />;
    case "browser": return <BrowserApp />;
    case "notepad": return <NotepadApp />;
    case "calculator": return <CalculatorApp />;
    case "settings": return <SettingsApp />;
    default: return <div className="p-4 text-gray-500 text-sm">App not found.</div>;
  }
}

// --- TERMINAL ---
function Terminal() {
  const [lines, setLines] = useState([
    "Welcome to Virtual Terminal v1.0",
    'Type "help" for available commands.',
    "",
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [lines]);

  const COMMANDS = {
    help: () => ["Available commands: help, ls, pwd, whoami, date, clear, echo <text>, uname"],
    ls: () => ["Documents/", "Downloads/", "Desktop/", "Pictures/", "Music/", "Videos/"],
    pwd: () => ["/home/user"],
    whoami: () => ["user"],
    date: () => [new Date().toString()],
    uname: () => ["Linux vm-host 5.15.0-91-generic #101-Ubuntu SMP x86_64 GNU/Linux"],
    clear: () => null,
  };

  const handleCmd = (e) => {
    if (e.key !== "Enter") return;
    const cmd = input.trim();
    setInput("");
    if (!cmd) { setLines(p => [...p, "$ "]); return; }
    const [base, ...args] = cmd.split(" ");
    const fn = COMMANDS[base];
    if (base === "clear") { setLines([]); return; }
    if (base === "echo") { setLines(p => [...p, `$ ${cmd}`, args.join(" "), ""]); return; }
    const out = fn ? fn() : [`bash: ${base}: command not found`];
    setLines(p => [...p, `$ ${cmd}`, ...out, ""]);
  };

  return (
    <div className="h-full bg-black text-green-400 font-mono text-xs p-3 flex flex-col min-h-[300px]">
      <div className="flex-1 overflow-y-auto whitespace-pre-wrap">
        {lines.map((l, i) => <div key={i}>{l}</div>)}
      </div>
      <div className="flex items-center gap-1 mt-1">
        <span>$</span>
        <input
          autoFocus
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleCmd}
          className="flex-1 bg-transparent outline-none text-green-400 caret-green-400"
          placeholder="type a command..."
        />
      </div>
      <div ref={endRef} />
    </div>
  );
}

// --- FILES ---
function FilesApp() {
  const structure = {
    "Home": ["Documents", "Downloads", "Desktop", "Pictures", "Music", "Videos"],
    "Documents": ["resume.pdf", "notes.txt", "project_report.docx"],
    "Downloads": ["ubuntu-22.04.iso", "setup.exe", "photo.jpg"],
    "Desktop": ["readme.txt", "shortcut.lnk"],
    "Pictures": ["vacation.jpg", "screenshot.png"],
    "Music": ["song1.mp3", "song2.flac"],
    "Videos": ["clip.mp4", "tutorial.mkv"],
  };
  const [folder, setFolder] = useState("Home");
  const [path, setPath] = useState(["Home"]);
  const items = structure[folder] || [];

  const open = (item) => {
    if (structure[item]) { setPath(p => [...p, item]); setFolder(item); }
  };
  const back = () => {
    if (path.length <= 1) return;
    const newPath = path.slice(0, -1);
    setPath(newPath);
    setFolder(newPath[newPath.length - 1]);
  };

  return (
    <div className="h-full flex flex-col min-h-[300px]">
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-gray-100 text-xs">
        <button onClick={back} disabled={path.length <= 1} className="px-2 py-0.5 bg-gray-200 rounded disabled:opacity-40">← Back</button>
        <span className="text-gray-500">{path.join(" / ")}</span>
      </div>
      <div className="flex-1 p-3 grid grid-cols-3 gap-3 content-start overflow-y-auto">
        {items.map(item => {
          const isDir = !!structure[item];
          return (
            <div key={item} onDoubleClick={() => open(item)} className="flex flex-col items-center gap-1 cursor-pointer hover:bg-blue-50 rounded-lg p-2 text-center">
              <span className="text-3xl">{isDir ? "📁" : getFileIcon(item)}</span>
              <span className="text-xs text-gray-700 break-all">{item}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getFileIcon(name) {
  if (name.endsWith(".pdf")) return "📄";
  if (name.endsWith(".txt") || name.endsWith(".docx")) return "📝";
  if (name.endsWith(".jpg") || name.endsWith(".png")) return "🖼️";
  if (name.endsWith(".mp3") || name.endsWith(".flac")) return "🎵";
  if (name.endsWith(".mp4") || name.endsWith(".mkv")) return "🎬";
  if (name.endsWith(".iso") || name.endsWith(".exe")) return "💿";
  return "📄";
}

// --- BROWSER ---
function BrowserApp() {
  const [url, setUrl] = useState("https://wikipedia.org");
  const [input, setInput] = useState("https://wikipedia.org");
  const [loading, setLoading] = useState(false);
  const [iframeUrl, setIframeUrl] = useState("https://wikipedia.org");
  const [history, setHistory] = useState(["https://wikipedia.org"]);
  const [histIdx, setHistIdx] = useState(0);

  const BOOKMARKS = [
    { label: "Wikipedia", url: "https://wikipedia.org" },
    { label: "GitHub", url: "https://github.com" },
    { label: "MDN Docs", url: "https://developer.mozilla.org" },
    { label: "Reddit", url: "https://old.reddit.com" },
    { label: "Hacker News", url: "https://news.ycombinator.com" },
  ];

  const navigate = (target) => {
    let u = (target ?? input).trim();
    if (!u.startsWith("http")) u = "https://" + u;
    setInput(u);
    setLoading(true);
    setIframeUrl(u);
    setUrl(u);
    const newHist = [...history.slice(0, histIdx + 1), u];
    setHistory(newHist);
    setHistIdx(newHist.length - 1);
    setTimeout(() => setLoading(false), 1500);
  };

  const goBack = () => {
    if (histIdx <= 0) return;
    const newIdx = histIdx - 1;
    setHistIdx(newIdx);
    const u = history[newIdx];
    setInput(u); setUrl(u); setIframeUrl(u); setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  const goForward = () => {
    if (histIdx >= history.length - 1) return;
    const newIdx = histIdx + 1;
    setHistIdx(newIdx);
    const u = history[newIdx];
    setInput(u); setUrl(u); setIframeUrl(u); setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="h-full flex flex-col min-h-[380px]" style={{ minHeight: 380 }}>
      {/* Toolbar */}
      <div className="flex items-center gap-1.5 px-2 py-1.5 border-b bg-gray-100 flex-shrink-0">
        <button onClick={goBack} disabled={histIdx <= 0} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs disabled:opacity-40">←</button>
        <button onClick={goForward} disabled={histIdx >= history.length - 1} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs disabled:opacity-40">→</button>
        <button onClick={() => navigate(url)} className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs">↺</button>
        <input
          className="flex-1 border border-gray-300 rounded-full px-3 py-1 text-xs outline-none focus:border-blue-400 bg-white"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && navigate()}
        />
        <button onClick={() => navigate()} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs">Go</button>
      </div>
      {/* Bookmarks bar */}
      <div className="flex items-center gap-1 px-2 py-1 border-b bg-gray-50 flex-shrink-0 overflow-x-auto">
        {BOOKMARKS.map(b => (
          <button key={b.url} onClick={() => navigate(b.url)} className="text-xs px-2 py-0.5 hover:bg-gray-200 rounded whitespace-nowrap text-blue-700">
            🔖 {b.label}
          </button>
        ))}
      </div>
      {/* Frame */}
      <div className="flex-1 relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
            <div className="text-center text-gray-400">
              <div className="text-3xl mb-2 animate-spin">🌐</div>
              <div className="text-sm">Loading {iframeUrl}...</div>
            </div>
          </div>
        )}
        <iframe
          key={iframeUrl}
          src={iframeUrl}
          className="w-full h-full border-none"
          title="browser"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
      </div>
    </div>
  );
}

// --- NOTEPAD ---
function NotepadApp() {
  const [text, setText] = useState("# Welcome to Notepad\n\nStart typing here...\n");
  return (
    <div className="h-full flex flex-col min-h-[300px]">
      <div className="px-3 py-1.5 border-b bg-gray-100 text-xs text-gray-500">
        untitled.txt — {text.length} chars
      </div>
      <textarea
        className="flex-1 p-3 font-mono text-sm outline-none resize-none text-gray-800"
        value={text}
        onChange={e => setText(e.target.value)}
      />
    </div>
  );
}

// --- CALCULATOR ---
function CalculatorApp() {
  const [display, setDisplay] = useState("0");
  const [expr, setExpr] = useState("");

  const press = (val) => {
    if (val === "C") { setDisplay("0"); setExpr(""); return; }
    if (val === "=") {
      try {
        // eslint-disable-next-line no-eval
        const result = Function('"use strict"; return (' + expr + ')')();
        setDisplay(String(result));
        setExpr(String(result));
      } catch { setDisplay("Error"); setExpr(""); }
      return;
    }
    if (val === "⌫") {
      const next = expr.slice(0, -1) || "0";
      setExpr(next === "0" ? "" : next);
      setDisplay(next || "0");
      return;
    }
    const next = (expr === "0" || expr === "") && !isNaN(val) ? val : expr + val;
    setExpr(next);
    setDisplay(next);
  };

  const btns = ["C","⌫","%","/","7","8","9","*","4","5","6","-","1","2","3","+","0",".","=","="];
  const grid = [["C","⌫","%","/"],["7","8","9","*"],["4","5","6","-"],["1","2","3","+"],[" ","0",".","+"]];
  const rows = [["C","⌫","%","÷"],["7","8","9","×"],["4","5","6","−"],["1","2","3","+"],["0",".","=","="]];
  const vals =  [["C","⌫","%","/"],["7","8","9","*"],["4","5","6","-"],["1","2","3","+"],[  "0",".","="]];

  const ROWS = [
    ["C","⌫","%","/"],
    ["7","8","9","*"],
    ["4","5","6","-"],
    ["1","2","3","+"],
    ["0",".",  "="]
  ];

  return (
    <div className="h-full flex flex-col bg-gray-900 min-h-[300px] p-4">
      <div className="bg-black text-white text-right text-2xl font-mono px-4 py-3 rounded-lg mb-3 min-h-[60px] flex items-end justify-end overflow-hidden">
        {display}
      </div>
      <div className="grid gap-2">
        {ROWS.map((row, ri) => (
          <div key={ri} className="grid gap-2" style={{ gridTemplateColumns: ri === 4 ? "2fr 1fr 2fr" : "repeat(4, 1fr)" }}>
            {row.map((btn, bi) => (
              <button
                key={bi}
                onClick={() => press(btn === "÷" ? "/" : btn === "×" ? "*" : btn === "−" ? "-" : btn)}
                className={`py-3 rounded-xl font-semibold text-lg transition-all active:scale-95 ${
                  btn === "=" ? "bg-orange-500 hover:bg-orange-400 text-white" :
                  ["C","⌫","%","÷","×","−","+","/","*","-"].includes(btn) ? "bg-gray-600 hover:bg-gray-500 text-white" :
                  "bg-gray-700 hover:bg-gray-600 text-white"
                }`}
              >
                {btn}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// --- SETTINGS ---
function SettingsApp() {
  const [darkMode, setDarkMode] = useState(false);
  const [volume, setVolume] = useState(70);
  const [brightness, setBrightness] = useState(80);
  const [wifi, setWifi] = useState(true);

  return (
    <div className="h-full overflow-y-auto min-h-[300px]">
      <div className="flex">
        <div className="w-40 border-r bg-gray-50 p-3">
          {["Display","Sound","Network","System","About"].map(s => (
            <div key={s} className="px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-gray-200 text-gray-700">{s}</div>
          ))}
        </div>
        <div className="flex-1 p-5 space-y-5">
          <SettingRow label="Dark Mode" sub="Toggle dark appearance">
            <Toggle value={darkMode} onChange={setDarkMode} />
          </SettingRow>
          <SettingRow label="Volume" sub={`${volume}%`}>
            <input type="range" min={0} max={100} value={volume} onChange={e => setVolume(+e.target.value)} className="w-32 accent-blue-500" />
          </SettingRow>
          <SettingRow label="Brightness" sub={`${brightness}%`}>
            <input type="range" min={20} max={100} value={brightness} onChange={e => setBrightness(+e.target.value)} className="w-32 accent-blue-500" />
          </SettingRow>
          <SettingRow label="Wi-Fi" sub={wifi ? "Connected" : "Disconnected"}>
            <Toggle value={wifi} onChange={setWifi} />
          </SettingRow>
        </div>
      </div>
    </div>
  );
}

function SettingRow({ label, sub, children }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm font-medium text-gray-800">{label}</div>
        <div className="text-xs text-gray-500">{sub}</div>
      </div>
      {children}
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-10 h-6 rounded-full transition-colors ${value ? "bg-blue-500" : "bg-gray-300"} relative`}
    >
      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${value ? "left-5" : "left-1"}`} />
    </button>
  );
}