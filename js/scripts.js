document.addEventListener("DOMContentLoaded", () => {
  let currentDockId = null;
  const userRole = "<?= getUserRole() ?>"; // Rol del usuario desde PHP
  const toastContainer = document.createElement("div");
  document.body.appendChild(toastContainer);

  // Función para actualizar la lista de docks
  function updateDocks() {
    fetch("api/get_docks.php")
      .then((res) => {
        if (!res.ok) throw new Error("Error en la respuesta");
        return res.json();
      })
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
                                  <div class="fw-bold">${dock.name}</div>
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
      })
      .catch((error) => console.error("Error:", error));
  }

  // Función auxiliar para obtener el color del estado
  function getStatusColor(status) {
    const colors = {
      ocupado: "danger",
      disponible: "success",
      cerrado: "secondary",
    };
    return colors[status] || "light";
  }

  // Función para abrir el modal de edición
  window.openEditModal = function (dockId) {
    currentDockId = dockId;
    fetch(`api/get_dock.php?id=${dockId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener dock");
        return res.json();
      })
      .then((dock) => {
        if (userRole === "admin") {
          document.getElementById("editDockName").value = dock.name;
        }
        document.getElementById("editClientName").value =
          dock.client_name || "";
        document.getElementById("editStatus").value = dock.status;
        document.getElementById("editDetails").value = dock.details || "";
        new bootstrap.Modal(document.getElementById("editModal")).show();
      })
      .catch((error) => {
        console.error("Error:", error);
        showToast("Error al cargar el dock", "danger");
      });
  };

  // Evento para guardar cambios
  document.getElementById("saveChanges").addEventListener("click", () => {
    if (
      userRole === "admin" &&
      !document.getElementById("editDockName").value.trim()
    ) {
      showToast("El nombre del dock es obligatorio", "warning");
      return;
    }

    const data = {
      client_name: document.getElementById("editClientName").value.trim(),
      status: document.getElementById("editStatus").value,
      details: document.getElementById("editDetails").value.trim(),
    };

    if (userRole === "admin") {
      data.name = document.getElementById("editDockName").value.trim();
    }

    fetch(`api/update_dock.php?id=${currentDockId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error en la respuesta");
        return response.json();
      })
      .then(() => {
        showToast("Cambios guardados exitosamente!", "success");
        updateDocks();
        bootstrap.Modal.getInstance(
          document.getElementById("editModal")
        ).hide();
      })
      .catch((error) => {
        console.error("Error:", error);
        showToast("Error al guardar los cambios", "danger");
      });
  });

  // Función para mostrar notificaciones
  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast align-items-center text-white bg-${type}`;
    toast.innerHTML = `
          <div class="d-flex">
              <div class="toast-body">${message}</div>
              <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast"></button>
          </div>
      `;
    toastContainer.appendChild(toast);
    new bootstrap.Toast(toast).show();
    setTimeout(() => toast.remove(), 3000);
  }

  // Configuración inicial
  updateDocks(); // Cargar datos iniciales
  setInterval(updateDocks, 3000); // Actualizar cada 3 segundos
});
