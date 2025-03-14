$(document).ready(function () {
  // Obtener los datos de docks
  $.ajax({
    url: "../api/get_docks.php",
    type: "GET",
    success: function (data) {
      const docks = JSON.parse(data);
      displayDocks(docks);
    },
  });

  // Función para mostrar los datos de docks
  function displayDocks(docks) {
    let html = "";
    docks.forEach((dock) => {
      html += `
                <div class="col-md-4">
                    <div class="card">
                        <img src="${dock.image}" class="card-img-top" alt="Dock Image">
                        <div class="card-body">
                            <h5 class="card-title">${dock.name}</h5>
                            <p class="card-text">Estado: ${dock.status}</p>
                            <p class="card-text">Fecha: ${dock.date}</p>
                        </div>
                    </div>
                </div>
            `;
    });
    $("#dockData").html(html);
  }
});
