import React, { useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import { useServices } from "../api/useServices";

export default function AdminPage() {
  const [allClients, setAllClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const { admin } = useServices();

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      try {
        const allClientsData = await admin.getAllClients();
        if (mounted) {
          setAllClients(allClientsData || []);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [admin]);

  function handleChange(id, field, value) {
    setAllClients((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, [field]: value, _edited: true }
          : c
      )
    );
  }

  async function handleSave(client) {
    try {
      setSavingId(client.id);

      await admin.updateMetrics(client.id, {
        organicTraffic: client.organicTraffic,
        visibilityIndex:client.visibilityIndex,
      });

      setAllClients((prev) =>
        prev.map((c) =>
          c.id === client.id ? { ...c, _edited: false } : c
        )
      );
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-app font-sans text-app-foreground flex">
      <div className="flex-1 flex flex-col p-8">
        <Topbar />

        <h1 className="text-2xl font-bold mb-6">Clients</h1>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="rounded-2xl bg-app-third border border-white/10 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-4 px-6 py-4 bg-white/5 text-sm font-semibold">
              <div>Client Name</div>
              <div>Organic Traffic</div>
              <div>Visibility Index</div>
              <div className="text-right">Action</div>
            </div>

            {/* Rows */}
            {allClients.map((client) => (
              <div
                key={client.id}
                className="grid grid-cols-4 items-center px-6 py-4 border-t border-white/5 hover:bg-white/5 transition"
              >
                {/* Name */}
                <div>{client.name}</div>

                {/* Organic Traffic */}
                <div>
                  <input
                    type="number"
                    value={client.organicTraffic ?? ""}
                    onChange={(e) =>
                      handleChange(client.id, "organicTraffic", e.target.value)
                    }
                    className="bg-app px-3 py-1 rounded-lg border border-white/10 focus:outline-none focus:border-brand w-40"
                  />
                </div>

                {/* Visibility Index */}
                <div>
                  <input
                    type="number"
                    value={client.visibilityIndex ?? ""}
                    onChange={(e) =>
                      handleChange(client.id, "visibilityIndex", e.target.value)
                    }
                    className="bg-app px-3 py-1 rounded-lg border border-white/10 focus:outline-none focus:border-brand w-40"
                  />
                </div>

                {/* Save button */}
                <div className="flex justify-end">
                  <button
                    disabled={!client._edited || savingId === client.id}
                    onClick={() => handleSave(client)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition
                      ${
                        client._edited
                          ? "bg-green-700 text-white hover:opacity-90"
                          : "bg-white/10 text-white/40 cursor-not-allowed"
                      }`}
                  >
                    {savingId === client.id ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            ))}

            {allClients.length === 0 && (
              <div className="p-6 text-center text-white/60">
                No clients found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
