const API_URL = "https://script.google.com/macros/s/AKfycbwFcAUpSW6bhE5-Pf47SDQ9tPtoxGqGSS3NqqFqlN7FqzRXvoIkZLtALkHl09GOcbY/exec"; // cambia por tu URL

// 📊 Cargar Dashboard
async function cargarDashboard() {
  let res = await fetch(`${API_URL}?accion=getDashboard`);
  let data = await res.json();

  let gastos = data.gastos.slice(1).filter(r => r[0]); // quitar encabezado
  let ingresos = data.ingresos.slice(1).filter(r => r[0]);

  let mesActual = new Date().getMonth();

  let totalGastos = gastos.filter(r => new Date(r[0]).getMonth() === mesActual)
                          .reduce((acc, r) => acc + Number(r[3]), 0);
  let totalIngresos = ingresos.filter(r => new Date(r[0]).getMonth() === mesActual)
                              .reduce((acc, r) => acc + Number(r[2]), 0);

  document.getElementById("totalGastos").textContent = totalGastos.toFixed(2);
  document.getElementById("totalIngresos").textContent = totalIngresos.toFixed(2);
  document.getElementById("balance").textContent = (totalIngresos - totalGastos).toFixed(2);

  // Pie de gastos
  let categorias = {};
  gastos.filter(r => new Date(r[0]).getMonth() === mesActual)
        .forEach(r => { categorias[r[1]] = (categorias[r[1]] || 0) + Number(r[3]); });

  new Chart(document.getElementById("gastosPie"), {
    type: "pie",
    data: {
      labels: Object.keys(categorias),
      datasets: [{
        data: Object.values(categorias),
        backgroundColor: ["#ff6384","#36a2eb","#ffce56","#4caf50","#9c27b0","#ff9800"]
      }]
    }
  });

  // Pie de ingresos
  let fuentes = {};
  ingresos.filter(r => new Date(r[0]).getMonth() === mesActual)
          .forEach(r => { fuentes[r[1]] = (fuentes[r[1]] || 0) + Number(r[2]); });

  new Chart(document.getElementById("ingresosPie"), {
    type: "pie",
    data: {
      labels: Object.keys(fuentes),
      datasets: [{
        data: Object.values(fuentes),
        backgroundColor: ["#36a2eb","#4caf50","#ff9800","#9c27b0","#ff6384","#795548"]
      }]
    }
  });
}

// ➕ Registrar gasto
async function registrarGasto(categoria, subcategoria, monto, nota) {
  let fd = new FormData();
  fd.append("accion", "nuevoGasto");
  fd.append("categoria", categoria);
  fd.append("subcategoria", subcategoria);
  fd.append("monto", monto);
  fd.append("nota", nota);
  await fetch(API_URL, { method: "POST", body: fd });
}

// ➕ Registrar ingreso
async function registrarIngreso(fuente, monto, nota) {
  let fd = new FormData();
  fd.append("accion", "nuevoIngreso");
  fd.append("fuente", fuente);
  fd.append("monto", monto);
  fd.append("nota", nota);
  await fetch(API_URL, { method: "POST", body: fd });
}
