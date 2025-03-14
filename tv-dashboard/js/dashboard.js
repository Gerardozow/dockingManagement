document.addEventListener("DOMContentLoaded", () => {
  fetchDocksData(); // Carga inicial
  setInterval(fetchDocksData, 5000); // Actualiza cada 5 segundos
});

function updateDockingStatus(response) {
  const container = document.getElementById("docks-grid");
  container.innerHTML = ""; // Limpia los docks anteriores

  const docks = response.docks; // Cambia esto según la estructura de tus datos

  if (Array.isArray(docks)) {
    docks.forEach((dock) => {
      const dockDiv = document.createElement("div");
      dockDiv.classList.add("dock");
      dockDiv.classList.add(dock.estado.toLowerCase()); // 'libre' u 'ocupado'

      dockDiv.innerHTML = `
        <strong>${dock.nombre}</strong><br>
        Estado: ${dock.estado}<br>
        <small>Actualizado: ${dock.actualizado}</small>
      `;

      container.appendChild(dockDiv);
    });
  } else {
    console.error("Los datos no son un array válido.");
  }
}

function fetchDocksData() {
  fetch("../api/get_docks.php")
    .then((response) => response.json())
    .then((data) => updateDockingStatus(data))
    .catch((error) => console.error("Error al obtener datos:", error));
}
