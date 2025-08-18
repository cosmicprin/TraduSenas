document.addEventListener('DOMContentLoaded', () => {
  const usuario = sessionStorage.getItem('usuario');
  const navbar = document.querySelector('.navbar .container');

//Nav
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
      window.location.href = '../Home/index.html';
    };
    navbar.appendChild(cerrarBtn);
  } else {
    window.location.href = '../Home/index.html';
  }

  // Funcionalidad de imagen
  const inputLetra = document.getElementById('singleLetterInput');
  const btnGenerar = document.querySelector('input[value="Generar Imagen"]');
  const btnAleatorio = document.querySelector('input[value="Generar Aleatorio"]');
  const btnValidar = document.querySelector('input[value="Validar mi Seña"]');
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

    const ruta = `../Assets/images/${letraMayus}.png`;
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

//validar seña
btnValidar.addEventListener('click', async () => {
    const letraUsuario = inputLetra.value.trim().toUpperCase();

    // 1. Validar que el usuario haya escrito una letra
    if (!/^[A-Z]$/.test(letraUsuario)) {
        Swal.fire({
            icon: 'warning',
            title: 'Letra inválida',
            text: 'Por favor, ingresa una letra de la A a la Z para validar tu seña.',
            confirmButtonColor: '#0d6efd'
        });
        return;
    }

    try {
        // 2. Llamar a la API para validar. 
        // ¡Asegúrate de que la IP sea la de la computadora donde corre Flask!
            const response = await axios.post('http://192.168.43.20:5000/actualizar_sensores', {
            letra_a_validar: letraUsuario // Enviamos la letra que el usuario quiere practicar
        });

        const resultado = response.data; // La API nos devuelve si es correcto, qué letra detectó, etc.

        // 3. Mostrar el resultado con una animación
        if (resultado.es_correcta) {
            Swal.fire({
                icon: 'success',
                title: '¡Correcto!',
                text: `Tu seña coincide con la letra "${resultado.letra_esperada}"`,
                showClass: { popup: 'animate__animated animate__bounceIn' },
                hideClass: { popup: 'animate__animated animate__fadeOutUp' },
                confirmButtonColor: '#198754'
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: '¡Vuelve a intentarlo!',
                text: `La seña que hiciste fue reconocida como "${resultado.letra_reconocida}", pero se esperaba la letra "${resultado.letra_esperada}"`,
                showClass: { popup: 'animate__animated animate__shakeX' },
                hideClass: { popup: 'animate__animated animate__fadeOutDown' },
                confirmButtonColor: '#dc3545'
            });
        }
    } catch (error) {
        // 4. Manejar errores de conexión con la API
        let mensajeError = 'No se pudo validar la seña. Verifica que el servidor de la API esté activo.';
        // Si la API nos dio un mensaje de error específico (como que el guante está desconectado), lo mostramos
        if (error.response && error.response.data && error.response.data.error) {
            mensajeError = error.response.data.error; 
        }

        Swal.fire({
            icon: 'error',
            title: 'Error de Conexión',
            text: mensajeError,
            confirmButtonColor: '#0d6efd'
        });
        console.error('Error al validar la seña:', error);
    }
});

});


