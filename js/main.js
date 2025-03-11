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
