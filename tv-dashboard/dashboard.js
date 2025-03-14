document.addEventListener("DOMContentLoaded", () => {
  fetchDocksData(); // Carga inicial
  setInterval(fetchDocksData, 5000); // Refresca cada 5 segundos
});

function fetchDocksData() {
  fetch("api/get_docks.php") // Cambia esto si tu ruta es diferente
    .then((response) => response.json())
    .then((data) => updateDockingStatus(data))
    .catch((error) => console.error("Error al obtener datos:", error));
}

function updateDockingStatus(docks) {
  const container = document.getElementById("docks-grid-container");
  container.innerHTML = ""; // Limpia los docks anteriores

  docks.forEach((dock) => {
    const dockDiv = document.createElement("div");
    dockDiv.classList.add("dock");
    dockDiv.classList.add(dock.estado.toLowerCase()); // libre u ocupado

    dockDiv.innerHTML = `
      <strong>${dock.nombre}</strong><br>
      Estado: ${dock.estado}<br>
      <small>Actualizado: ${dock.actualizado}</small>
    `;

    container.appendChild(dockDiv);
  });
}
