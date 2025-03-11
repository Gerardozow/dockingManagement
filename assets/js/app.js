class DockManager {
  constructor() {
    this.docks = []; // Inicializar como array vacío
    this.lastUpdate = null;
    this.init();
  }

  async init() {
    this.setupEventListeners();
    await this.loadData();
    this.startPolling();
  }

  // Agregar método showError faltante
  showError(message) {
    const container = document.getElementById("docksContainer");
    container.innerHTML = `<div class="error">${message}</div>`;
  }

  async loadData() {
    try {
      const response = await fetch("php/obtener_muelles.php");
      const data = await response.json();

      // Validar estructura de respuesta
      if (!data.success || !Array.isArray(data.data)) {
        throw new Error("Respuesta inválida del servidor");
      }

      this.docks = data.data;
      this.renderDocks();
    } catch (error) {
      console.error("Error:", error);
      this.showError("Error cargando datos: " + error.message);
    }
  }

  renderDocks() {
    const container = document.getElementById("docksContainer");

    // Verificar que docks sea array
    if (!Array.isArray(this.docks)) {
      console.error("Docks no es un array:", this.docks);
      return;
    }

    container.innerHTML = this.docks
      .map((dock) => this.createDockCard(dock))
      .join("");

    this.addCardListeners();
  }

  createDockCard(dock) {
    return `
          <div class="dock-card ${dock.estado}" data-id="${dock.id}">
              <h3>Muelle ${dock.nombre}</h3>
              <div class="status">${dock.estado.toUpperCase()}</div>
              ${
                dock.estado === "ocupado"
                  ? `
                  <div class="details">
                      <p><strong>Cliente:</strong> ${
                        dock.cliente_asignado || "N/A"
                      }</p>
                      ${
                        dock.detalles
                          ? `<p><strong>Detalles:</strong> ${dock.detalles}</p>`
                          : ""
                      }
                      <p class="timestamp">Ocupado desde: ${
                        dock.hora_entrada
                          ? new Date(dock.hora_entrada).toLocaleString()
                          : "N/A"
                      }</p>
                  </div>
              `
                  : ""
              }
          </div>
      `;
  }

  addCardListeners() {
    document.querySelectorAll(".dock-card").forEach((card) => {
      card.addEventListener("click", () => {
        const dockId = card.dataset.id;
        const selectedDock = this.docks.find((d) => d.id == dockId);
        if (selectedDock) {
          this.showEditModal(selectedDock);
        }
      });
    });
  }

  // Resto del código...
}
