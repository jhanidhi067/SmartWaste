/* SmartWaste — Interactive Dashboard */

const zones = [
  { id: "ZW-001", name: "Central Market", area: "Central", waste: 82, status: "Collection Due", type: "Mixed Waste" },
  { id: "ZW-002", name: "Green Park", area: "North", waste: 35, status: "Collected", type: "Organic" },
  { id: "ZW-003", name: "Lake View", area: "South", waste: 67, status: "Collection Due", type: "Recyclable" },
  { id: "ZW-004", name: "City Hospital", area: "Central", waste: 91, status: "Urgent", type: "Mixed Waste" },
  { id: "ZW-005", name: "Tech Park", area: "East", waste: 24, status: "Collected", type: "Recyclable" },
  { id: "ZW-006", name: "River Road", area: "West", waste: 58, status: "Collection Due", type: "Organic" },
  { id: "ZW-007", name: "University Campus", area: "North", waste: 43, status: "Collected", type: "Organic" },
  { id: "ZW-008", name: "Bus Terminal", area: "East", waste: 88, status: "Urgent", type: "Mixed Waste" }
];

function getStatus(zone) {
  if (zone.status === "Collected") return "green";
  if (zone.status === "Urgent" || zone.waste >= 85) return "red";
  return "orange";
}

function renderZones() {
  const table = document.getElementById("zoneTable");
  if (!table) return;

  const search = (document.getElementById("zoneSearch")?.value || "").toLowerCase();
  const status = document.getElementById("statusFilter")?.value || "All";
  const area = document.getElementById("areaFilter")?.value || "All";

  const filtered = zones.filter(zone => {
    const matchesSearch =
      zone.name.toLowerCase().includes(search) ||
      zone.id.toLowerCase().includes(search) ||
      zone.type.toLowerCase().includes(search);

    const matchesStatus = status === "All" || zone.status === status;
    const matchesArea = area === "All" || zone.area === area;

    return matchesSearch && matchesStatus && matchesArea;
  });

  table.innerHTML = filtered.map(zone => `
    <tr>
      <td><strong>${zone.id}</strong></td>
      <td>${zone.name}</td>
      <td>${zone.area}</td>
      <td>
        <strong>${zone.waste}%</strong>
        <div class="progress">
          <div style="width:${zone.waste}%"></div>
        </div>
      </td>
      <td><span class="pill pill-${getStatus(zone)}">${zone.status}</span></td>
      <td>${zone.type}</td>
      <td>
        <button class="btn zone-action" data-id="${zone.id}"
          style="background:#e7f6ed;color:#0c6041;padding:7px 10px">
          Details
        </button>
      </td>
    </tr>
  `).join("");

  const count = document.getElementById("zoneCount");
  if (count) count.textContent = `${filtered.length} zones shown`;

  if (!filtered.length) {
    table.innerHTML = '<tr><td colspan="7">No matching zones found.</td></tr>';
  }
}

function showToast(message) {
  let toast = document.getElementById("toastMessage");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toastMessage";
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.remove("hidden");

  clearTimeout(window.smartWasteToastTimer);
  window.smartWasteToastTimer = setTimeout(() => {
    toast.classList.add("hidden");
  }, 3000);
}

function showZoneDetails(id) {
  const zone = zones.find(item => item.id === id);
  if (!zone) return;

  showToast(
    `${zone.name} | ${zone.waste}% capacity | ${zone.status} | ${zone.type}`
  );
}

function updateClock() {
  const clock = document.getElementById("liveClock");
  if (!clock) return;

  clock.textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderZones();
  updateClock();
  setInterval(updateClock, 1000);

  document.getElementById("zoneSearch")?.addEventListener("input", renderZones);
  document.getElementById("statusFilter")?.addEventListener("change", renderZones);
  document.getElementById("areaFilter")?.addEventListener("change", renderZones);

  document.getElementById("zoneTable")?.addEventListener("click", event => {
    const button = event.target.closest(".zone-action");
    if (button) showZoneDetails(button.dataset.id);
  });

  document.getElementById("refreshButton")?.addEventListener("click", () => {
    renderZones();
    updateClock();
    showToast("Demo dashboard refreshed successfully.");
  });

  document.getElementById("exportButton")?.addEventListener("click", () => {
    const csvRows = [
      ["Zone ID", "Zone Name", "Area", "Waste Level (%)", "Status", "Waste Type"],
      ...zones.map(zone => [
        zone.id, zone.name, zone.area, zone.waste, zone.status, zone.type
      ])
    ];

    const csv = csvRows.map(row =>
      row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")
    ).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "smartwaste-zone-report.csv";
    link.click();
    URL.revokeObjectURL(url);

    showToast("Zone report exported.");
  });

  document.getElementById("scheduleButton")?.addEventListener("click", () => {
    showToast("Demo only: connect a backend to schedule real collections.");
  });

  document.querySelectorAll(".nav-link[data-section]").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();

      document.querySelectorAll(".nav-link").forEach(item =>
        item.classList.remove("active")
      );
      link.classList.add("active");

      const section = document.getElementById(link.dataset.section);
      section?.scrollIntoView({ behavior: "smooth", block: "start" });

      if (link.dataset.section === "overview") {
        showToast("Showing dashboard overview.");
      } else if (link.dataset.section === "zones") {
        showToast("Explore and filter waste collection zones.");
      } else if (link.dataset.section === "reports") {
        showToast("Use Export Report to download the sample data.");
      }
    });
  });
});
