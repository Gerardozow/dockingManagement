document.addEventListener("DOMContentLoaded", () => {
  let currentDockId = null;
  const userRole = "<?= getUserRole() ?>";

  function updateDocks() {
    fetch("api/get_docks.php")
      .then((res) => res.json())
      .then((docks) => {
        const container = document.getElementById("docks-container");
        container.innerHTML = docks
          .map(
            (dock) => `
                  <div class="col">
                      <div class="card h-100 shadow-sm border-${getStatusColor(
                        dock.status
                      )}">
                          <div class="card-header py-2 bg-${getStatusColor(
                            dock.status
                          )} text-white">
                              <div class="d-flex justify-content-between">
                                  <div class="fw-bold">
                                      ${dock.name}
                                  </div>
                                  <small>${dock.type.toUpperCase()}</small>
                              </div>
                          </div>
                          <div class="card-body">
                              <ul class="list-unstyled mb-0">
                                  <li><strong>Estado:</strong> ${
                                    dock.status.charAt(0).toUpperCase() +
                                    dock.status.slice(1)
                                  }</li>
                                  <li><strong>Cliente:</strong> ${
                                    dock.client_name || "N/A"
                                  }</li>
                                  <li><small>Inicio: ${
                                    dock.start_time
                                      ? new Date(
                                          dock.start_time
                                        ).toLocaleTimeString()
                                      : "--:--"
                                  }</small></li>
                              </ul>
                          </div>
                          <div class="card-footer bg-transparent py-2">
                              <button class="btn btn-outline-primary btn-sm w-100" 
                                      onclick="openEditModal(${dock.id})">
                                  <i class="bi bi-pencil"></i> Editar
                              </button>
                          </div>
                      </div>
                  </div>
              `
          )
          .join("");
      });
  }

  window.openEditModal = function (dockId) {
    currentDockId = dockId;
    fetch(`api/get_dock.php?id=${dockId}`)
      .then((res) => res.json())
      .then((dock) => {
        if (userRole === "admin") {
          document.getElementById("editDockName").value = dock.name;
        }
        document.getElementById("editClientName").value =
          dock.client_name || "";
        document.getElementById("editStatus").value = dock.status;
        document.getElementById("editDetails").value = dock.details || "";
        new bootstrap.Modal(document.getElementById("editModal")).show();
      });
  };

  document.getElementById("saveChanges").addEventListener("click", () => {
    if (
      userRole === "admin" &&
      !document.getElementById("editDockName").value
    ) {
      showToast("El nombre del dock es requerido", "warning");
      return;
    }

    const data = {
      client_name: document.getElementById("editClientName").value,
      status: document.getElementById("editStatus").value,
      details: document.getElementById("editDetails").value,
    };

    if (userRole === "admin") {
      data.name = document.getElementById("editDockName").value;
    }

    fetch(`api/update_dock.php?id=${currentDockId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(() => {
        showToast("Cambios guardados exitosamente!");
        updateDocks();
        bootstrap.Modal.getInstance(
          document.getElementById("editModal")
        ).hide();
      })
      .catch(() => showToast("Error al guardar", "danger"));
  });

  // Resto del código...
});
