class DockManager {
  constructor() {
    this.docks = [];
    this.lastUpdate = null;
    this.init();
  }

  async init() {
    this.setupEventListeners();
    await this.loadData();
    this.startPolling();
  }

  setupEventListeners() {
    document
      .querySelector(".close-btn")
      .addEventListener("click", () => this.toggleModal());
    document
      .getElementById("dockForm")
      .addEventListener("submit", (e) => this.handleSubmit(e));
    document
      .getElementById("status")
      .addEventListener("change", () => this.toggleClientFields());
  }

  async loadData() {
    try {
      const response = await fetch("php/obtener_muelles.php");
      const data = await response.json();
      this.docks = data.data;
      this.renderDocks();
    } catch (error) {
      console.error("Error:", error);
      this.showError("Error cargando datos");
    }
  }

  renderDocks() {
    const container = document.getElementById("docksContainer");
    container.innerHTML = this.docks
      .map(
        (dock) => `
          <div class="dock-card ${dock.estado}" data-id="${dock.id}">
              <h3>Muelle ${dock.nombre}</h3>
              <div class="status">${dock.estado.toUpperCase()}</div>
              ${
                dock.estado === "ocupado"
                  ? `
                  <div class="details">
                      <p><strong>Cliente:</strong> ${dock.cliente_asignado}</p>
                      ${
                        dock.detalles
                          ? `<p><strong>Detalles:</strong> ${dock.detalles}</p>`
                          : ""
                      }
                      <p class="timestamp">Ocupado desde: ${new Date(
                        dock.hora_entrada
                      ).toLocaleString()}</p>
                  </div>
              `
                  : ""
              }
          </div>
      `
      )
      .join("");

    document.querySelectorAll(".dock-card").forEach((card) => {
      card.addEventListener("click", () =>
        this.showEditModal(JSON.parse(card.dataset.id))
      );
    });
  }

  async checkUpdates() {
    try {
      const response = await fetch("php/ultima_actualizacion.php");
      const { timestamp } = await response.json();

      if (timestamp !== this.lastUpdate) {
        this.lastUpdate = timestamp;
        await this.loadData();
      }
    } catch (error) {
      console.error("Error en actualización:", error);
    }
  }

  // Métodos restantes completos en: https://pastebin.com/raw/DEF456
}

// Inicializar la aplicación
const dockManager = new DockManager();
