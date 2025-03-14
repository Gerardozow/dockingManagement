function updateDockingStatus(docks) {
  const statusContainer = document.getElementById("docking-status");
  statusContainer.innerHTML = ""; // Limpiar antes de agregar nuevo contenido

  // Agrupar docks por tipo
  const grupos = {
    Recepcion: [],
    Embarque: [],
    Exterior: [],
  };

  docks.forEach((dock) => {
    if (grupos[dock.tipo]) {
      grupos[dock.tipo].push(dock);
    }
  });

  // Recorrer cada grupo y crear su bloque
  for (const [grupoNombre, docksGrupo] of Object.entries(grupos)) {
    const grupoDiv = document.createElement("div");
    grupoDiv.classList.add("grupo");

    // Título del grupo
    const titulo = document.createElement("h2");
    titulo.textContent = grupoNombre;
    grupoDiv.appendChild(titulo);

    // Contenedor de docks dentro del grupo
    const docksContainer = document.createElement("div");
    docksContainer.classList.add("docks-container");

    // Agregar los docks al contenedor
    docksGrupo.forEach((dock) => {
      const dockDiv = document.createElement("div");
      dockDiv.classList.add("dock");
      dockDiv.classList.add(dock.estado.toLowerCase()); // libre u ocupado

      dockDiv.innerHTML = `
          <strong>${dock.nombre}</strong>
          Estado: ${dock.estado}<br>
          <small>Actualizado: ${dock.actualizado}</small>
        `;

      docksContainer.appendChild(dockDiv);
    });

    // Agregar el contenedor de docks al grupo
    grupoDiv.appendChild(docksContainer);

    // Finalmente agregar el grupo al contenedor principal
    statusContainer.appendChild(grupoDiv);
  }
}
