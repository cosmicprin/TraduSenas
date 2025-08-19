document.addEventListener('DOMContentLoaded', () => {
  const usuario = sessionStorage.getItem('usuario');
  const navbar = document.querySelector('.navbar .container');
  const inputLetra = document.getElementById('singleLetterInput');
  const btnGenerar = document.querySelector('input[value="Generar Imagen"]');
  const btnAleatorio = document.querySelector('input[value="Generar Aleatorio"]');
  const btnValidar = document.querySelector('input[value="Validar mi Seña"]');
  const imgDisplay = document.querySelector('img.rounded');
  let puntaje = 0;
  const scoreDisplay = document.getElementById('score');

  const valoresSensores = [0.1, 0.9, 0.9, 0.9, 0.9];
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


btnValidar.addEventListener('click', async () => {
  const letraUsuario = inputLetra.value.trim().toUpperCase();

  if (!/^[A-Z]$/.test(letraUsuario)) {
    Swal.fire({
      icon: 'error',
      title: 'Letra inválida',
      text: 'Ingresa una letra válida (A–Z) antes de validar',
      confirmButtonColor: '#0d6efd'
    });
    return;
  }

  try {
    const response = await axios.post('http://192.168.100.5:5000/reconocer_letra', {
      sensores: valoresSensores
    });

    const letraReconocida = response.data.letra_reconocida;

    if (letraReconocida === letraUsuario) {
      puntaje = Math.min(puntaje + 5, 25);
      scoreDisplay.textContent = puntaje;

      Swal.fire({
        icon: 'success',
        title: '¡Correcto!',
        text: `La seña coincide con la letra "${letraUsuario}"`,
        showClass: {
          popup: 'animate__animated animate__bounceIn'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        },
        confirmButtonColor: '#198754'
      });

      if (puntaje === 25) {
        Swal.fire({
          icon: 'info',
          title: '¡Nivel completado!',
          text: 'Has alcanzado 25 puntos. Puedes avanzar al Nivel 2',
          confirmButtonText: 'Ir al siguiente nivel',
          confirmButtonColor: '#0d6efd'
        }).then(() => {
          window.location.href = '../Nivel/Nivel2.html'; 
        });
      }

    } else {
      puntaje = Math.max(puntaje - 1, 0);
      scoreDisplay.textContent = puntaje;

      Swal.fire({
        icon: 'error',
        title: 'Incorrecto',
        text: `La seña detectada fue "${letraReconocida}", no coincide con "${letraUsuario}"`,
        showClass: {
          popup: 'animate__animated animate__shakeX'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutDown'
        },
        confirmButtonColor: '#dc3545'
      });
    }

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: 'No se pudo validar la seña. Verifica que el servidor Flask esté activo.',
      confirmButtonColor: '#0d6efd'
    });
    console.error('Error al validar seña:', error);
  }
});

  scoreDisplay.textContent = puntaje;
});

