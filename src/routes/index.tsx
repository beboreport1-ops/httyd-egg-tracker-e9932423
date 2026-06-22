import { createFileRoute } from "@tanstack/react-router";
import {
  Check,
  Clock3,
  Compass,
  Flame,
  Map as MapIcon,
  RefreshCcw,
  RotateCcw,
  Search,
  Shield,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

type EggStatus = "ready" | "cooldown" | "none";

type Island = {
  id: string;
  name: string;
  egg: string;
  region: string;
  status: EggStatus;
  detail: string;
  cooldown?: string;
  x: number;
  y: number;
};

const ISLANDS: Island[] = [
  {
    id: "odins-respite",
    name: "Odin's Respite",
    egg: "Stormcutter Egg",
    region: "Northern clouds",
    status: "cooldown",
    detail: "High cliffs and scattered ruins above the main archipelago.",
    cooldown: "42m",
    x: 50,
    y: 9,
  },
  {
    id: "crown-island",
    name: "Crown Island",
    egg: "Deadly Nadder Egg",
    region: "Northwest chain",
    status: "ready",
    detail: "Rocky royal outcrop with quick shoreline checks.",
    x: 32,
    y: 19,
  },
  {
    id: "wild-island",
    name: "Wild Island",
    egg: "Monstrous Nightmare Egg",
    region: "Eastern cliffs",
    status: "cooldown",
    detail: "Steep paths, bright lava vents, and nested ledges.",
    cooldown: "18m",
    x: 64,
    y: 25,
  },
  {
    id: "flaming-forest",
    name: "Flaming Forest",
    egg: "Gronckle Egg",
    region: "Central island",
    status: "ready",
    detail: "The central woodland is the fastest repeated route.",
    x: 50,
    y: 34,
  },
  {
    id: "standing-stones",
    name: "Standing Stones",
    egg: "Hideous Zippleback Egg",
    region: "Western channel",
    status: "none",
    detail: "Quiet stones with no tracked egg in the current rotation.",
    x: 29,
    y: 43,
  },
  {
    id: "twin-flame-island",
    name: "Twin Flame Island",
    egg: "Twin Flame Egg",
    region: "Far east",
    status: "ready",
    detail: "Purple flame island with short, visible spawn paths.",
    x: 73,
    y: 40,
  },
  {
    id: "spiral-island",
    name: "Spiral Island",
    egg: "Spiral Egg",
    region: "Eastern spiral",
    status: "cooldown",
    detail: "Independent global timer; check at the top and half of each hour.",
    cooldown: "global",
    x: 60,
    y: 47,
  },
  {
    id: "the-graveyard",
    name: "The Graveyard",
    egg: "Boneknapper Egg",
    region: "Central south",
    status: "ready",
    detail: "Ship bones and narrow ledges make this a compact check.",
    x: 45,
    y: 54,
  },
  {
    id: "breakneck-bog",
    name: "Breakneck Bog",
    egg: "Mudraker Egg",
    region: "Eastern marsh",
    status: "cooldown",
    detail: "Wetlands route with two common nest corners.",
    cooldown: "1h 12m",
    x: 80,
    y: 58,
  },
  {
    id: "the-cove",
    name: "The Cove",
    egg: "Terrible Terror Egg",
    region: "Southwest bay",
    status: "ready",
    detail: "Low shoreline loop with easy visibility from the beach.",
    x: 24,
    y: 61,
  },
  {
    id: "berserk-island",
    name: "Berserk Island",
    egg: "Rumblehorn Egg",
    region: "West ruins",
    status: "cooldown",
    detail: "Large ruins and cliffs; best checked after Cove.",
    cooldown: "55m",
    x: 33,
    y: 58,
  },
  {
    id: "rascal-shores",
    name: "Rascal Shores",
    egg: "Sand Wraith Egg",
    region: "Southeast shore",
    status: "ready",
    detail: "Beachline spawns with fast pickup paths.",
    x: 64,
    y: 66,
  },
  {
    id: "whispering-dunes",
    name: "Whispering Dunes",
    egg: "Skrill Egg",
    region: "Far southeast",
    status: "none",
    detail: "No current egg callout, but useful as a route marker.",
    x: 83,
    y: 72,
  },
  {
    id: "gronckle-island",
    name: "Gronckle Island",
    egg: "Gronckle Iron Egg",
    region: "Lower center",
    status: "cooldown",
    detail: "Small island between route clusters.",
    cooldown: "27m",
    x: 49,
    y: 76,
  },
  {
    id: "ancient-retreat",
    name: "Ancient Retreat",
    egg: "Light Fury Egg",
    region: "Lower east",
    status: "ready",
    detail: "Rare route stop near the southern islands.",
    x: 62,
    y: 80,
  },
  {
    id: "featherhide-island",
    name: "Featherhide Island",
    egg: "Featherhide Egg",
    region: "Far southeast",
    status: "cooldown",
    detail: "Tall crags with nests tucked near the ridge.",
    cooldown: "2h 04m",
    x: 75,
    y: 86,
  },
  {
    id: "dragonroot-island",
    name: "Dragonroot Island",
    egg: "Thunderdrum Egg",
    region: "Far southwest",
    status: "ready",
    detail: "Outer island with a reliable cliffside sweep.",
    x: 16,
    y: 82,
  },
  {
    id: "sheep-island",
    name: "Sheep Island",
    egg: "Sheep Defender Egg",
    region: "Southern waters",
    status: "none",
    detail: "Route landmark with no active tracked egg.",
    x: 38,
    y: 88,
  },
  {
    id: "isle-of-hollows",
    name: "Isle of Hollows",
    egg: "Night Light Egg",
    region: "Southern hollow",
    status: "cooldown",
    detail: "Cave checks and lower beach loops.",
    cooldown: "36m",
    x: 53,
    y: 93,
  },
  {
    id: "isle-of-ice",
    name: "Isle of Ice",
    egg: "Snow Wraith Egg",
    region: "Southern edge",
    status: "ready",
    detail: "Cold southern stop with quick visual confirmation.",
    x: 35,
    y: 96,
  },
];

const STORAGE_KEY = "httyd-egg-tracker-collected";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HTTYD Egg Tracker" },
      {
        name: "description",
        content: "Track How to Train Your Dragon Roblox eggs, islands, map pins, and spiral timers.",
      },
      { property: "og:title", content: "HTTYD Egg Tracker" },
      {
        property: "og:description",
        content: "Track How to Train Your Dragon Roblox eggs, islands, map pins, and spiral timers.",
      },
    ],
  }),
  component: EggTracker,
});

function EggTracker() {
  const [activeTab, setActiveTab] = useState<"islands" | "map" | "spiral">("islands");
  const [query, setQuery] = useState("");
  const [collected, setCollected] = useState<Record<string, boolean>>({});
  const [selectedIsland, setSelectedIsland] = useState<Island | null>(null);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setCollected(JSON.parse(saved) as Record<string, boolean>);
    }
    setNow(new Date());
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(collected));
  }, [collected]);

  const filteredIslands = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return ISLANDS;

    return ISLANDS.filter((island) =>
      [island.name, island.egg, island.region, island.status].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [query]);

  const collectedCount = ISLANDS.filter((island) => collected[island.id]).length;

  function toggleCollected(islandId: string) {
    setCollected((current) => ({ ...current, [islandId]: !current[islandId] }));
  }

  function markAllCollected() {
    setCollected(Object.fromEntries(ISLANDS.map((island) => [island.id, true])));
  }

  function resetAll() {
    setCollected({});
  }

  function refreshTimer() {
    setNow(new Date());
  }

  return (
    <main className="tracker-shell">
      <div className="ember-field" aria-hidden="true" />

      <section className="tracker-panel" aria-labelledby="tracker-title">
        <header className="tracker-hero">
          <div className="dragon-mark" aria-hidden="true">
            <Flame size={34} />
          </div>
          <div>
            <h1 id="tracker-title">HTTYD Egg Tracker</h1>
            <p>How to Train Your Dragon — Roblox</p>
          </div>
        </header>

        <div className="wing-divider" aria-hidden="true" />

        <div className="auth-bar">
          <button type="button" className="stone-button secondary" onClick={refreshTimer}>
            Refresh
          </button>
          <button type="button" className="stone-button discord">
            <Shield size={20} aria-hidden="true" />
            Login with Discord
          </button>
        </div>

        <nav className="tab-list" aria-label="Egg tracker sections">
          <button
            type="button"
            className={activeTab === "islands" ? "tab active" : "tab"}
            onClick={() => setActiveTab("islands")}
          >
            <Compass size={20} aria-hidden="true" />
            Islands
          </button>
          <button
            type="button"
            className={activeTab === "map" ? "tab active" : "tab"}
            onClick={() => setActiveTab("map")}
          >
            <MapIcon size={20} aria-hidden="true" />
            Map
          </button>
          <button
            type="button"
            className={activeTab === "spiral" ? "tab active" : "tab"}
            onClick={() => setActiveTab("spiral")}
          >
            <Sparkles size={20} aria-hidden="true" />
            Spiral
          </button>
        </nav>

        {activeTab === "islands" && (
          <section className="islands-view" aria-label="Island egg list">
            <div className="action-grid">
              <button type="button" className="stone-button primary" onClick={markAllCollected}>
                <Check size={20} aria-hidden="true" />
                Collected all
              </button>
              <button type="button" className="stone-button secondary" onClick={resetAll}>
                <RotateCcw size={18} aria-hidden="true" />
                Reset all
              </button>
            </div>

            <label className="search-box">
              <Search size={22} aria-hidden="true" />
              <span className="sr-only">Search island or egg</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search island or egg..."
              />
            </label>

            <div className="progress-rune" aria-label={`${collectedCount} of ${ISLANDS.length} eggs collected`}>
              <span>{collectedCount}</span>
              <div>
                <strong>{ISLANDS.length}</strong>
                <small>eggs tracked</small>
              </div>
            </div>

            <div className="island-grid">
              {filteredIslands.map((island) => (
                <IslandCard
                  key={island.id}
                  island={island}
                  isCollected={Boolean(collected[island.id])}
                  onToggle={() => toggleCollected(island.id)}
                  onDetails={() => setSelectedIsland(island)}
                />
              ))}
            </div>
          </section>
        )}

        {activeTab === "map" && (
          <section className="map-view" aria-label="Egg map">
            <p className="map-hint">Tap an island to mark as collected</p>
            <div className="map-board">
              <div className="map-cloud cloud-one" />
              <div className="map-cloud cloud-two" />
              <div className="map-cloud cloud-three" />
              <svg className="route-rings" viewBox="0 0 100 100" aria-hidden="true">
                <ellipse cx="49" cy="51" rx="31" ry="37" />
                <ellipse cx="55" cy="55" rx="19" ry="24" />
                <path d="M18 82 C30 70, 42 68, 51 76 S72 88, 86 73" />
              </svg>
              {ISLANDS.map((island) => (
                <button
                  key={island.id}
                  type="button"
                  className={`map-pin ${island.status} ${collected[island.id] ? "collected" : ""}`}
                  style={{ left: `${island.x}%`, top: `${island.y}%` } as CSSProperties}
                  onClick={() => toggleCollected(island.id)}
                  title={island.name}
                >
                  <span />
                  <small>{island.name}</small>
                </button>
              ))}
            </div>
            <div className="map-legend" aria-label="Map legend">
              <span><i className="legend-dot not-collected" />Not collected</span>
              <span><i className="legend-dot collected" />Collected</span>
              <span><i className="legend-dot ready" />Ready</span>
              <span><i className="legend-dot spiral" />Spiral</span>
              <span><i className="legend-dot none" />No eggs</span>
            </div>
          </section>
        )}

        {activeTab === "spiral" && <SpiralView now={now} onRefresh={refreshTimer} />}
      </section>

      {selectedIsland && (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelectedIsland(null)}>
          <section
            className="dragon-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="island-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="modal-close" onClick={() => setSelectedIsland(null)}>
              <X size={18} aria-hidden="true" />
              <span className="sr-only">Close</span>
            </button>
            <p className="modal-kicker">{selectedIsland.region}</p>
            <h2 id="island-modal-title">{selectedIsland.name}</h2>
            <p>{selectedIsland.detail}</p>
            <dl>
              <div>
                <dt>Egg</dt>
                <dd>{selectedIsland.egg}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{statusLabel(selectedIsland)}</dd>
              </div>
            </dl>
          </section>
        </div>
      )}
    </main>
  );
}

function IslandCard({
  island,
  isCollected,
  onToggle,
  onDetails,
}: {
  island: Island;
  isCollected: boolean;
  onToggle: () => void;
  onDetails: () => void;
}) {
  return (
    <article className={`island-card ${island.status} ${isCollected ? "collected" : ""}`}>
      <button type="button" className="card-main" onClick={onDetails}>
        <span className="status-orb" aria-hidden="true" />
        <span>
          <strong>{island.name}</strong>
          <small>{island.egg}</small>
        </span>
      </button>
      <div className="card-footer">
        <span>{statusLabel(island)}</span>
        <button type="button" className="collect-toggle" onClick={onToggle} aria-pressed={isCollected}>
          {isCollected ? "Collected" : "Mark"}
        </button>
      </div>
    </article>
  );
}

function SpiralView({ now, onRefresh }: { now: Date | null; onRefresh: () => void }) {
  const checkTime = now ? getNextCheckTime(now) : "--:--";

  return (
    <section className="spiral-view" aria-label="Spiral egg tracker">
      <div className="spiral-rules">
        <h2>How Spiral Egg works:</h2>
        <p>
          Every hour it re-rolls. <strong>1/100 chance</strong> to spawn, <strong>99/100</strong> to
          disappear. Timer is <strong>global</strong> — check every <strong>30 mins</strong>.
        </p>
        <p>
          <strong>3 independent colors</strong> (Yellow, Blue, Red) — each on their own timer.
          Once spawned you have <strong>60 minutes</strong> to pick it up. After pickup:{" "}
          <strong>6-hour personal cooldown</strong> for that color only.
        </p>
      </div>

      <div className="check-panel">
        <Clock3 size={22} aria-hidden="true" />
        <span>Next recommended check in</span>
        <strong>{checkTime}</strong>
        <small>Checks every :00 and :30</small>
        <button type="button" className="mini-refresh" onClick={onRefresh}>
          <RefreshCcw size={16} aria-hidden="true" />
          Update
        </button>
      </div>
    </section>
  );
}

function statusLabel(island: Island) {
  if (island.status === "ready") return "Ready";
  if (island.status === "none") return "No eggs";
  return island.cooldown ? `Cooldown ${island.cooldown}` : "Cooldown";
}

function getNextCheckTime(date: Date) {
  const next = new Date(date);
  const minutes = next.getMinutes();

  if (minutes < 30) {
    next.setMinutes(30, 0, 0);
  } else {
    next.setHours(next.getHours() + 1, 0, 0, 0);
  }

  return next.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
