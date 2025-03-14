document.addEventListener("DOMContentLoaded", () => {
  let currentDockId = null;
  const userRole = "<?= getUserRole() ?>"; // Rol del usuario desde PHP
  const toastContainer = document.createElement("div");
  toastContainer.id = "toast-container";
  toastContainer.style.position = "fixed";
  toastContainer.style.bottom = "20px";
  toastContainer.style.right = "20px";
  toastContainer.style.zIndex = "9999";
  document.body.appendChild(toastContainer);

  // Función para formatear la hora en el horario de la Ciudad de México
  function formatTime(dateString) {
    if (!dateString) return "--:--";

    const date = new Date(dateString);
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Mexico_City", // Zona horaria de la Ciudad de México
    };

    return new Intl.DateTimeFormat("es-MX", options).format(date);
  }

  // Función para actualizar la lista de docks
  function updateDocks() {
    fetch("api/get_docks.php")
      .then((res) => {
        if (!res.ok) throw new Error("Error en la red");
        return res.json();
      })
      .then((groupedDocks) => {
        const container = document.getElementById("docks-container");
        container.innerHTML = "";

        // Mostrar docks de Recibo
        if (groupedDocks.recepcion.length > 0) {
          container.innerHTML += `
                      <div class="dock-section">
                          <h3>Recibo</h3>
                          <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xxl-6 g-3">
                              ${groupedDocks.recepcion
                                .map((dock) => createDockCard(dock))
                                .join("")}
                          </div>
                      </div>
                  `;
        }

        // Mostrar docks de Embarques
        if (groupedDocks.embarque.length > 0) {
          container.innerHTML += `
                      <div class="dock-section">
                          <h3>Embarques</h3>
                          <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xxl-6 g-3">
                              ${groupedDocks.embarque
                                .map((dock) => createDockCard(dock))
                                .join("")}
                          </div>
                      </div>
                  `;
        }

        // Mostrar docks de Exterior
        if (groupedDocks.exterior.length > 0) {
          container.innerHTML += `
                      <div class="dock-section">
                          <h3>Exterior</h3>
                          <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xxl-6 g-3">
                              ${groupedDocks.exterior
                                .map((dock) => createDockCard(dock))
                                .join("")}
                          </div>
                      </div>
                  `;
        }
      })
      .catch((error) => showToast(`Error: ${error.message}`, "danger"));
  }

  // Función para crear una tarjeta de dock
  function createDockCard(dock) {
    return `
      <div class="col">
          <div class="card h-100 dock-card ${dock.status}">
              <div class="card-header">
                  <div class="d-flex justify-content-between align-items-center">
                      <div class="fw-bold">${dock.name}</div>
                      <small class="text-uppercase">${dock.type}</small>
                  </div>
              </div>
              <div class="card-body">
                  <ul class="list-unstyled mb-0">
                      <li><strong>Estado:</strong> ${capitalizeFirst(
                        dock.status
                      )}</li>
                      <li><strong>Cliente:</strong> ${
                        dock.client_name || "N/A"
                      }</li>
                      <li><small>Inicio: ${formatTime(
                        dock.start_time
                      )}</small></li>
                  </ul>
              </div>
              <div class="card-footer">
                  <button class="btn btn-outline-primary btn-sm w-100" 
                          onclick="openEditModal(${dock.id})">
                      <i class="bi bi-pencil"></i> Editar
                  </button>
              </div>
          </div>
      </div>
  `;
  }

  // Función para abrir el modal de edición
  window.openEditModal = function (dockId) {
    currentDockId = dockId;
    fetch(`api/get_dock.php?id=${dockId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Dock no encontrado");
        return res.json();
      })
      .then((dock) => {
        document.getElementById("editDockName").value = dock.name || "";
        document.getElementById("editClientName").value =
          dock.client_name || "";
        document.getElementById("editStatus").value =
          dock.status || "disponible";
        document.getElementById("editDetails").value = dock.details || "";
        new bootstrap.Modal(document.getElementById("editModal")).show();
      })
      .catch((error) => {
        console.error("Error:", error);
        showToast(error.message, "danger");
      });
  };

  // Evento para guardar cambios
  document.getElementById("saveChanges").addEventListener("click", () => {
    try {
      const data = {
        client_name: document.getElementById("editClientName").value.trim(),
        status: document.getElementById("editStatus").value,
        details: document.getElementById("editDetails").value.trim(),
      };

      fetch(
        `https://gerardozow.me/docking/api/update_dock.php?id=${currentDockId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      )
        .then((response) => {
          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
          return response.json();
        })
        .then((result) => {
          if (result.error) throw new Error(result.error);
          showToast("¡Dock actualizado!", "success");
          updateDocks();
          bootstrap.Modal.getInstance(
            document.getElementById("editModal")
          ).hide();
        })
        .catch((error) => {
          console.error("Error:", error);
          showToast(`Error: ${error.message}`, "danger");
        });
    } catch (error) {
      showToast(error.message, "warning");
    }
  });

  // Funciones auxiliares
  function getStatusColor(status) {
    const colors = {
      ocupado: "danger",
      disponible: "success",
      cerrado: "secondary",
    };
    return colors[status] || "light";
  }

  function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function formatTime(dateString) {
    return dateString ? new Date(dateString).toLocaleTimeString() : "--:--";
  }

  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.innerHTML = `
          <div class="d-flex">
              <div class="toast-body">${message}</div>
              <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
          </div>
      `;
    toastContainer.appendChild(toast);
    new bootstrap.Toast(toast, { autohide: true, delay: 3000 }).show();
    setTimeout(() => toast.remove(), 3500);
  }

  // Inicialización
  updateDocks();
  setInterval(updateDocks, 3000); // Actualizar cada 3 segundos
});
