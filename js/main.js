// js/main.js
class MuelleManager {
  constructor() {
    this.modal = document.getElementById("modal");
    this.form = document.getElementById("form-muelle");
    this.currentMuelle = null;

    // Inicializar eventos
    this.setupEventListeners();
    this.initEventSource();
    this.loadInitialData();
  }
  openEditModal(muelle) {
    this.currentMuelle = muelle;
    this.populateForm(muelle);
    this.toggleModal(true);
    this.handleEstadoChange(); // Llamar al detectar cambio inicial
  }

  // Agregar nuevo método para manejar cambios en el select
  handleEstadoChange() {
    const estadoSelect = document.getElementById("estado");
    const clienteField = document.getElementById("cliente");
    const detallesField = document.getElementById("detalles");

    const handleChange = () => {
      if (estadoSelect.value === "disponible") {
        clienteField.value = "";
        detallesField.value = "";
        clienteField.disabled = true;
        detallesField.disabled = true;
      } else {
        clienteField.disabled = false;
        detallesField.disabled = false;
      }
    };

    estadoSelect.addEventListener("change", handleChange);
    handleChange(); // Ejecutar inicialmente
  }

  // Modificar populateForm para mantener datos actuales
  populateForm(muelle) {
    document.getElementById("muelle-id").textContent = muelle.nombre;
    document.getElementById("estado").value = muelle.estado;

    // Solo cargar datos si está ocupado
    if (muelle.estado === "ocupado") {
      document.getElementById("cliente").value = muelle.cliente_asignado || "";
      document.getElementById("detalles").value = muelle.detalles || "";
    }
  }

  setupEventListeners() {
    // Cerrar modal con la X
    document
      .querySelector(".cerrar")
      .addEventListener("click", () => this.toggleModal(false));

    // Cerrar modal al hacer clic fuera
    window.addEventListener("click", (e) => {
      if (e.target === this.modal) this.toggleModal(false);
    });

    // Enviar formulario
    this.form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await this.handleFormSubmit();
    });
  }

  async handleFormSubmit() {
    const formData = {
      id: this.currentMuelle.id,
      estado: document.getElementById("estado").value,
      cliente: document.getElementById("cliente").value,
      detalles: document.getElementById("detalles").value,
    };

    try {
      const response = await fetch("php/actualizar_muelle.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Error en la actualización");
      this.toggleModal(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Error actualizando el muelle");
    }
  }

  initEventSource() {
    this.eventSource = new EventSource("php/sse.php");

    this.eventSource.onmessage = (e) => {
      const data = JSON.parse(e.data);
      this.updateInterface(data);
    };

    this.eventSource.onerror = (e) => {
      console.error("Error en conexión SSE:", e);
      setTimeout(() => this.initEventSource(), 5000);
    };
  }

  async loadInitialData() {
    try {
      const response = await fetch("php/obtener_muelles.php");
      const data = await response.json();
      this.updateInterface(data);
    } catch (error) {
      console.error("Error cargando datos iniciales:", error);
    }
  }

  updateInterface(data) {
    const container = document.getElementById("contenedor-muelles");
    container.innerHTML = "";
    data.forEach((muelle) =>
      container.appendChild(this.createMuelleElement(muelle))
    );
  }

  createMuelleElement(muelle) {
    const div = document.createElement("div");
    div.className = `muelle ${muelle.estado}`;

    div.innerHTML = `
            <h3>${muelle.nombre}</h3>
            <div class="estado">${muelle.estado.toUpperCase()}</div>
            ${
              muelle.estado === "ocupado"
                ? `
                <div class="detalles-container">
                    <div class="cliente">Cliente: ${
                      muelle.cliente_asignado || "Sin especificar"
                    }</div>
                    ${
                      muelle.detalles
                        ? `
                        <div class="detalles-texto">Detalles: ${muelle.detalles}</div>
                    `
                        : ""
                    }
                    <div class="tiempo">Inicio: ${new Date(
                      muelle.hora_entrada
                    ).toLocaleString()}</div>
                </div>
            `
                : ""
            }
        `;

    div.addEventListener("click", () => this.openEditModal(muelle));
    return div;
  }

  openEditModal(muelle) {
    this.currentMuelle = muelle;
    this.populateForm(muelle);
    this.toggleModal(true);
  }

  populateForm(muelle) {
    document.getElementById("muelle-id").textContent = muelle.nombre;
    document.getElementById("estado").value = muelle.estado;
    document.getElementById("cliente").value = muelle.cliente_asignado || "";
    document.getElementById("detalles").value = muelle.detalles || "";
  }

  toggleModal(show = true) {
    this.modal.style.display = show ? "block" : "none";
    if (show) document.getElementById("cliente").focus();
  }
}

// Inicializar la aplicación al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  new MuelleManager();
});
