document.addEventListener("DOMContentLoaded", () => {
  fetchDocksData(); // Llama la primera vez
  setInterval(fetchDocksData, 5000); // Refresca cada 5 segundos (ajustable)
});

function fetchDocksData() {
  fetch("get_docks.php")
    .then((response) => response.json())
    .then((data) => updateDockingStatus(data))
    .catch((error) => console.error("Error al obtener los datos:", error));
}

function updateDockingStatus(docks) {
  const statusContainer = document.getElementById("docking-status");
  statusContainer.innerHTML = ""; // Limpia el contenido antes de agregar nuevo

  // Agrupar los docks por su tipo
  const grupos = {
    Recibo: [],
    Embarque: [],
    Exterior: [],
  };

  docks.forEach((dock) => {
    if (grupos[dock.tipo]) {
      grupos[dock.tipo].push(dock);
    }
  });

  // Crear el HTML para cada grupo
  for (const [grupoNombre, docksGrupo] of Object.entries(grupos)) {
    const grupoDiv = document.createElement("div");
    grupoDiv.classList.add("grupo");

    const titulo = document.createElement("h2");
    titulo.textContent = grupoNombre;
    grupoDiv.appendChild(titulo);

    const docksContainer = document.createElement("div");
    docksContainer.classList.add("docks-container");

    // Crear cada dock dentro del grupo
    docksGrupo.forEach((dock) => {
      const dockDiv = document.createElement("div");
      dockDiv.classList.add("dock");
      dockDiv.classList.add(dock.estado.toLowerCase()); // 'libre' o 'ocupado'

      dockDiv.innerHTML = `
          <strong>${dock.nombre}</strong>
          Estado: ${dock.estado}<br>
          <small>Actualizado: ${dock.actualizado}</small>
        `;

      docksContainer.appendChild(dockDiv);
    });

    grupoDiv.appendChild(docksContainer);
    statusContainer.appendChild(grupoDiv);
  }
}
