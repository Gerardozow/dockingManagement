class MuelleManager {
  constructor() {
    this.modal = document.getElementById("modal");
    this.form = document.getElementById("form-muelle");
    this.loading = document.getElementById("loading");
    this.lastUpdate = null;
    this.currentMuelle = null;

    this.init();
  }

  async init() {
    this.setupEventListeners();
    await this.loadInitialData();
    this.startPolling();
  }

  setupEventListeners() {
    document
      .querySelector(".cerrar")
      .addEventListener("click", () => this.toggleModal(false));
    window.addEventListener(
      "click",
      (e) => e.target === this.modal && this.toggleModal(false)
    );
    this.form.addEventListener("submit", (e) => this.handleFormSubmit(e));
    document
      .getElementById("estado")
      .addEventListener("change", () => this.handleEstadoChange());
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    this.toggleLoading(true);

    const formData = {
      id: this.currentMuelle.id,
      estado: document.getElementById("estado").value,
      cliente: document.getElementById("cliente").value,
      detalles: document.getElementById("detalles").value,
    };

    try {
      const response = await fetch("php/actualizar_muelle.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(await response.text());
      this.toggleModal(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Error actualizando el muelle");
    } finally {
      this.toggleLoading(false);
    }
  }

  handleEstadoChange() {
    const estado = document.getElementById("estado").value;
    const cliente = document.getElementById("cliente");
    const detalles = document.getElementById("detalles");

    cliente.disabled = estado === "disponible";
    detalles.disabled = estado === "disponible";

    if (estado === "disponible") {
      cliente.value = "";
      detalles.value = "";
    }
  }

  async loadInitialData() {
    this.toggleLoading(true);
    try {
      const response = await fetch("php/obtener_muelles.php");
      const data = await response.json();
      this.updateInterface(data.data);
    } catch (error) {
      console.error("Error:", error);
      alert("Error cargando datos");
    } finally {
      this.toggleLoading(false);
    }
  }

  async checkUpdates() {
    try {
      const response = await fetch("php/ultima_actualizacion.php");
      const { timestamp } = await response.json();

      if (timestamp !== this.lastUpdate) {
        this.lastUpdate = timestamp;
        await this.loadInitialData();
      }
    } catch (error) {
      console.error("Error verificando actualizaciones:", error);
    }
  }

  startPolling() {
    this.pollingInterval = setInterval(async () => {
      try {
        const response = await fetch("php/ultima_actualizacion.php");
        const { timestamp } = await response.json();

        if (timestamp !== this.lastUpdate) {
          console.log("Cambios detectados, actualizando...");
          await this.loadInitialData();
          this.lastUpdate = timestamp;
        }
      } catch (error) {
        console.error("Error en polling:", error);
      }
    }, 3000); // Intervalo reducido a 3 segundos
  }

  updateInterface(data) {
    console.log("Datos recibidos:", data);
    const container = document.getElementById("contenedor-muelles");
    container.innerHTML = data
      .map((muelle) => this.createMuelleElement(muelle))
      .join("");
  }

  createMuelleElement(muelle) {
    return `
          <div class="muelle ${muelle.estado}" data-id="${
      muelle.id
    }" onclick="muelleManager.openEditModal(${JSON.stringify(muelle)})">
              <h3>${muelle.nombre}</h3>
              <div class="estado">${muelle.estado.toUpperCase()}</div>
              ${
                muelle.estado === "ocupado"
                  ? `
                  <div class="detalles-container">
                      <div class="cliente">${muelle.cliente_asignado}</div>
                      ${
                        muelle.detalles
                          ? `<div class="detalles-texto">${muelle.detalles}</div>`
                          : ""
                      }
                      <div class="tiempo">${new Date(
                        muelle.hora_entrada
                      ).toLocaleString()}</div>
                  </div>
              `
                  : ""
              }
          </div>
      `;
  }

  openEditModal(muelle) {
    this.currentMuelle = muelle;
    document.getElementById("muelle-id").textContent = muelle.nombre;
    document.getElementById("estado").value = muelle.estado;
    document.getElementById("cliente").value = muelle.cliente_asignado || "";
    document.getElementById("detalles").value = muelle.detalles || "";
    this.handleEstadoChange();
    this.toggleModal(true);
  }

  toggleModal(show = true) {
    this.modal.style.display = show ? "block" : "none";
  }

  toggleLoading(show) {
    this.loading.style.display = show ? "block" : "none";
  }
}

// Inicializar la aplicación
const muelleManager = new MuelleManager();
