class MuelleManager {
  constructor() {
    this.initEventSource();
    this.loadInitialData();
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

    data.forEach((muelle) => {
      const muelleElement = this.createMuelleElement(muelle);
      container.appendChild(muelleElement);
    });
  }

  createMuelleElement(muelle) {
    const div = document.createElement("div");
    div.className = `muelle ${muelle.estado}`;
    div.innerHTML = `
            <h3>${muelle.nombre}</h3>
            <div class="estado">${muelle.estado.toUpperCase()}</div>
            ${
              muelle.estado === "ocupado"
                ? `<div class="cliente">Cliente: ${
                    muelle.cliente_asignado
                  }</div>
                 <div class="tiempo">Ocupado desde: ${new Date(
                   muelle.hora_entrada
                 ).toLocaleTimeString()}</div>`
                : ""
            }
        `;

    div.addEventListener("click", () => this.cambiarEstado(muelle));
    return div;
  }

  async cambiarEstado(muelle) {
    const nuevoEstado =
      muelle.estado === "disponible" ? "ocupado" : "disponible";
    const cliente =
      nuevoEstado === "ocupado" ? prompt("Ingrese nombre del cliente:") : null;

    try {
      const response = await fetch("php/actualizar_muelle.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: muelle.id,
          estado: nuevoEstado,
          cliente: cliente,
        }),
      });

      if (!response.ok) throw new Error("Error en la actualización");
    } catch (error) {
      console.error("Error:", error);
      alert("Error actualizando el muelle");
    }
  }
}

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", () => {
  new MuelleManager();
});

class MuelleManager {
  constructor() {
    this.modal = document.getElementById("modal");
    this.form = document.getElementById("form-muelle");
    this.currentMuelle = null;

    this.setupEventListeners();
    // ... resto del constructor anterior
  }

  setupEventListeners() {
    // Cerrar modal
    document
      .querySelector(".cerrar")
      .addEventListener("click", () => this.toggleModal(false));

    // Clic fuera del modal
    window.addEventListener("click", (e) => {
      if (e.target === this.modal) this.toggleModal(false);
    });

    // Enviar formulario
    this.form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(this.form);

      try {
        const response = await fetch("php/actualizar_muelle.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: this.currentMuelle.id,
            estado: formData.get("estado"),
            cliente: formData.get("cliente"),
            detalles: formData.get("detalles"),
          }),
        });

        if (!response.ok) throw new Error("Error en la actualización");
        this.toggleModal(false);
      } catch (error) {
        console.error("Error:", error);
        alert("Error actualizando el muelle");
      }
    });
  }

  toggleModal(show = true) {
    this.modal.style.display = show ? "block" : "none";
  }

  // Modificar la función cambiarEstado
  async cambiarEstado(muelle) {
    this.currentMuelle = muelle;
    this.loadFormData(muelle);
    this.toggleModal();
  }

  loadFormData(muelle) {
    document.getElementById("muelle-id").textContent = muelle.nombre;
    document.getElementById("estado").value = muelle.estado;
    document.getElementById("cliente").value = muelle.cliente_asignado || "";
    document.getElementById("detalles").value = muelle.detalles || "";
  }

  // Actualizar createMuelleElement para mostrar detalles
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
                      muelle.cliente_asignado
                    }</div>
                    ${
                      muelle.detalles
                        ? `
                        <div class="detalles-texto">${muelle.detalles}</div>
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
    div.addEventListener("click", () => this.cambiarEstado(muelle));
    return div;
  }
}
