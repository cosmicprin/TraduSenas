document.addEventListener('DOMContentLoaded', () => {
  const usuario = sessionStorage.getItem('usuario');
  const navbar = document.querySelector('.navbar .container');

  // Mostrar usuario y botón salir
  if (usuario) {
    const userDisplay = document.createElement('span');
    userDisplay.className = 'ms-auto fw-bold';
    userDisplay.textContent = `👤 ${usuario}`;
    navbar.appendChild(userDisplay);

    const cerrarBtn = document.createElement('button');
    cerrarBtn.className = 'btn btn-outline-danger ms-3';
    cerrarBtn.textContent = 'Salir';
    cerrarBtn.onclick = () => {
      sessionStorage.removeItem('usuario');
      window.location.href = '/FrontEnd/Home/index.html';
    };
    navbar.appendChild(cerrarBtn);
  } else {
    window.location.href = '/FrontEnd/Home/index.html';
  }

  // Funcionalidad de imagen
  const inputLetra = document.getElementById('singleLetterInput');
  const btnGenerar = document.querySelector('input[value="Generar Imagen"]');
  const btnAleatorio = document.querySelector('input[value="Generar Aleatorio"]');
  const imgDisplay = document.querySelector('img.rounded');

  const mostrarImagen = (letra) => {
    const letraMayus = letra.toUpperCase();
    if (!/^[A-Z]$/.test(letraMayus)) {
      Swal.fire({
        icon: 'error',
        title: 'Letra inválida',
        text: 'Por favor ingresa una letra de A a Z',
        confirmButtonColor: '#0d6efd'
      });
      return;
    }

    const ruta = `/FrontEnd/Assets/images/${letraMayus}.png`;
    imgDisplay.src = ruta;
    imgDisplay.alt = `Seña de la letra ${letraMayus}`;
  };

  btnGenerar.addEventListener('click', () => {
    const letra = inputLetra.value.trim();
    mostrarImagen(letra);
  });

  btnAleatorio.addEventListener('click', () => {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const aleatoria = letras[Math.floor(Math.random() * letras.length)];
    inputLetra.value = aleatoria;
    mostrarImagen(aleatoria);
  });
});