function startAutoRefresh() {
  fetchDockingStatus(); // carga inicial
  setInterval(fetchDockingStatus, 10000); // refresca cada 10 segundos
}

function fetchDockingStatus() {
  fetch("../api/get_docks.php")
    .then((response) => response.json())
    .then((data) => updateDashboard(data))
    .catch((error) => {
      console.error("Error obteniendo los datos:", error);
      const container = document.getElementById("docking-status");
      container.innerHTML = `<p style="color: red;">Error al cargar los datos</p>`;
    });
}

function updateDashboard(data) {
  const container = document.getElementById("docking-status");
  container.innerHTML = "";

  for (let tipo in data) {
    const grupo = document.createElement("div");
    grupo.className = "grupo";

    const grupoContenedor = document.createElement("div");
    grupo.className = "grupo-contenedor";

    const titulo = document.createElement("h2");
    titulo.textContent = tipo.charAt(0).toUpperCase() + tipo.slice(1);
    grupo..appendChild(grupoContenedor).appendChild(titulo);

    data[tipo].forEach((dock) => {
      const dockElement = document.createElement("div");
      dockElement.className = `dock ${dock.status.toLowerCase()}`;

      dockElement.innerHTML = `
          <strong>${dock.name}</strong><br>
          Estado: ${dock.status}<br>
          Última actualización: ${dock.updated_at || "N/A"}
        `;

      grupo.appendChild(dockElement);
    });

    container.appendChild(grupo);
  }
}

function toggleFullscreen() {
  const elem = document.documentElement;
  if (!document.fullscreenElement) {
    elem.requestFullscreen().catch((err) => {
      alert(`Error al intentar pantalla completa: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}
