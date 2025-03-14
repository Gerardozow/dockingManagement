// Actualización automática
function updateDocks() {
  fetch("api/get_docks.php")
    .then((res) => res.json())
    .then((docks) => {
      let container = document.getElementById("docks-container");
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
                  dock.type.charAt(0).toUpperCase() + dock.type.slice(1)
                }</small>
              </div>
              <div class="card-body">
                <p class="card-text"><strong>Estado:</strong> ${
                  dock.status.charAt(0).toUpperCase() + dock.status.slice(1)
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
    });
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

// Lógica del modal de edición
function openEditModal(dockId) {
  fetch(`api/get_dock.php?id=${dockId}`)
    .then((res) => res.json())
    .then((dock) => {
      // Llenar formulario
      document.getElementById("editClientName").value = dock.client_name || "";
      document.getElementById("editStatus").value = dock.status;
      document.getElementById("editDetails").value = dock.details || "";

      // Mostrar modal
      new bootstrap.Modal(document.getElementById("editModal")).show();
    });
}

// Guardar cambios
document.getElementById("saveChanges").addEventListener("click", () => {
  const data = {
    client_name: document.getElementById("editClientName").value,
    status: document.getElementById("editStatus").value,
    details: document.getElementById("editDetails").value,
  };

  fetch(`api/update_dock.php?id=${dockId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(() => {
    updateDocks();
    bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
  });
});
