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
    if (!/^[AEIOU]$/.test(letraMayus)) {
      Swal.fire({
        icon: 'error',
        title: 'Letra inválida',
        text: 'Por favor ingresa una vocal (A, E, I, O, U)',
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
    const letras = 'AEIOU';
    const aleatoria = letras[Math.floor(Math.random() * letras.length)];
    inputLetra.value = aleatoria;
    mostrarImagen(aleatoria);
  });


btnValidar.addEventListener('click', async () => {
    
    const letraUsuario = inputLetra.value.trim().toUpperCase();

    // Validar que se haya ingresado una letra
    if (!/^[A-Z]$/.test(letraUsuario)) {
        Swal.fire({
            icon: 'warning',
            title: 'Letra inválida',
            text: 'Ingresa una vocal  (A–E-I-O-U) antes de validar.',
            confirmButtonColor: '#0d6efd'
        });
        return;
    }

    try {
        // 2. Pedirle a la API la última letra reconocida por el guante
        const response = await axios.get('http://192.168.215.46:5000/obtener_ultima_letra');
        
        const letraReconocida = response.data.letra_reconocida;
        console.log(`Usuario quiere: ${letraUsuario}, Guante hizo: ${letraReconocida}`);

        // 3. Comparar las letras y actualizar el puntaje
        if (letraReconocida === letraUsuario) {
            puntaje = Math.min(puntaje + 5, 25); // Suma 5 puntos, con un máximo de 25
            
            Swal.fire({
                icon: 'success',
                title: '¡Correcto!',
                text: `La seña coincide con la letra "${letraUsuario}". ¡+5 puntos!`,
                timer: 3000, // Se cierra solo después de 3 segundos
                showConfirmButton: false,
                showClass: { popup: 'animate__animated animate__bounceIn' },
                hideClass: { popup: 'animate__animated animate__fadeOutUp' }
            });

        } else {
            puntaje = Math.max(puntaje - 1, 0); // Resta 1 punto, con un mínimo de 0
            
            Swal.fire({
                icon: 'error',
                title: 'Incorrecto',
                text: `Tu seña fue reconocida como "${letraReconocida}", no como "${letraUsuario}". ¡-1 punto!`,
                showClass: { popup: 'animate__animated animate__shakeX' },
                hideClass: { popup: 'animate__animated animate__fadeOutDown' },
                confirmButtonColor: '#dc3545'
            });
        }
        
        // Actualizar el puntaje en la pantalla
        scoreDisplay.textContent = puntaje;

        // 4. Verificar si se completó el nivel
        if (puntaje >= 25) {
            Swal.fire({
                icon: 'success',
                title: '🏆 ¡Nivel completado!',
                text: 'Has alcanzado 25 puntos. ¡Felicidades!',
                confirmButtonText: 'Ir al siguiente nivel',
                confirmButtonColor: '#0d6efd'
            }).then(() => {
                // Redirigir a la página de selección de nivel o al siguiente nivel
                window.location.href = '../Nivel/selectLevel.html'; 
            });
        }

    } catch (error) {
        let mensajeError = 'No se pudo validar la seña. Verifica que el servidor Flask esté activo.';
        // Mostrar error específico de la API si lo hay (ej. guante desconectado)
        if (error.response && error.response.data && error.response.data.error) {
            mensajeError = error.response.data.error;
        }
        Swal.fire({
            icon: 'error',
            title: 'Error de Conexión',
            text: mensajeError,
            confirmButtonColor: '#0d6efd'
        });
        console.error('Error al validar seña:', error);
    }
});

  scoreDisplay.textContent = puntaje;
});

