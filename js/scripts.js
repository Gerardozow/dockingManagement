// Actualización automática
function updateDocks() {
  fetch("api/get_docks.php")
    .then((res) => {
      if (!res.ok) throw new Error("Error en la respuesta");
      return res.json();
    })
    .then((docks) => {
      // Verificar si es un array
      if (!Array.isArray(docks)) {
        console.error("La API no devolvió un array:", docks);
        return;
      }

      const container = document.getElementById("docks-container");
      container.innerHTML = docks
        .map(
          (dock) => `
        <div class="col">
          <div class="card h-100 border-${getStatusColor(dock.status)}">
            <div class="card-header bg-${getStatusColor(
              dock.status
            )} text-white">
              <h5 class="card-title mb-0">Dock #${dock.id}</h5>
              <small>${
                dock.type?.charAt(0)?.toUpperCase() + dock.type?.slice(1)
              }</small>
            </div>
            <div class="card-body">
              <p class="card-text"><strong>Estado:</strong> ${
                dock.status?.charAt(0)?.toUpperCase() + dock.status?.slice(1)
              }</p>
              <p class="card-text"><strong>Cliente:</strong> ${
                dock.client_name || "N/A"
              }</p>
            </div>
            <div class="card-footer">
              <button class="btn btn-outline-primary w-100" 
                      onclick="openEditModal(${dock.id})">
                Editar
              </button>
            </div>
          </div>
        </div>
      `
        )
        .join("");
    })
    .catch((error) => console.error("Error:", error));
}

// Actualizar cada 10 segundos
setInterval(updateDocks, 10000);

// Función auxiliar para colores
function getStatusColor(status) {
  const colors = {
    ocupado: "danger",
    disponible: "success",
    cerrado: "secondary",
  };
  return colors[status] || "light";
}

// js/scripts.js
let currentDockId = null; // Variable global para guardar el ID

function openEditModal(dockId) {
  currentDockId = dockId; // Guardar el ID actual

  fetch(`api/get_dock.php?id=${dockId}`)
    .then((res) => {
      if (!res.ok) throw new Error("Error al obtener dock");
      return res.json();
    })
    .then((dock) => {
      if (!dock) throw new Error("Dock no encontrado");

      // Usar operadores de encadenamiento opcional
      document.getElementById("editClientName").value = dock.client_name || "";
      document.getElementById("editStatus").value = dock.status || "disponible";
      document.getElementById("editDetails").value = dock.details || "";

      new bootstrap.Modal(document.getElementById("editModal")).show();
    })
    .catch((error) => console.error("Error:", error));
}

// Modificar el evento de guardar
document.getElementById("saveChanges").addEventListener("click", () => {
  const data = {
    client_name: document.getElementById("editClientName").value,
    status: document.getElementById("editStatus").value,
    details: document.getElementById("editDetails").value,
  };

  fetch(`api/update_dock.php?id=${currentDockId}`, {
    // Usar la variable guardada
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(() => {
    updateDocks();
    bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
  });
});
