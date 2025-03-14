document.addEventListener("DOMContentLoaded", () => {
  // Obtener los datos de docks
  fetch("../api/get_docks.php")
    .then((response) => response.json())
    .then((data) => {
      displayDocks(data);
    })
    .catch((error) => console.error("Error al obtener los datos:", error));

  // Función para mostrar los datos de docks
  function displayDocks(docks) {
    const dockDataContainer = document.getElementById("dockData");
    dockDataContainer.innerHTML = ""; // Limpiar el contenedor

    docks.forEach((dock) => {
      const dockCard = document.createElement("div");
      dockCard.classList.add("col-md-4");

      dockCard.innerHTML = `
                <div class="card">
                    <img src="${dock.image}" class="card-img-top" alt="Dock Image">
                    <div class="card-body">
                        <h5 class="card-title">${dock.name}</h5>
                        <p class="card-text">Estado: ${dock.status}</p>
                        <p class="card-text">Fecha: ${dock.date}</p>
                    </div>
                </div>
            `;

      dockDataContainer.appendChild(dockCard);
    });
  }
});
