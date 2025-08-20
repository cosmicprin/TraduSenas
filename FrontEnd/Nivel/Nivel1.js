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


btnValidar.addEventListener('click', () => {
    const letraUsuario = inputLetra.value.trim().toUpperCase();

    // 1. Validar que se haya ingresado una vocal (como en tu función mostrarImagen)
    if (!/^[AEIOU]$/.test(letraUsuario)) {
        Swal.fire({
            icon: 'warning',
            title: 'Letra inválida',
            text: 'Por favor, ingresa una vocal (A, E, I, O, U) antes de validar.',
            confirmButtonColor: '#0d6efd'
        });
        return;
    }

    // 2. Mostrar el pop-up con el temporizador ⏱️
    let timerInterval;
    Swal.fire({
        title: '¡Prepárate para hacer la seña!',
        html: 'Tienes <b></b> segundos para realizar la seña.<br><br>Presiona ¡Listo! cuando quieras validar.',
        timer: 60000, // El pop-up durará 1 minuto (60,000 milisegundos)
        timerProgressBar: true,
        allowOutsideClick: false, // Evita que se cierre al hacer clic afuera
        confirmButtonText: '¡Listo! Validar ahora',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',

        // Esta función se ejecuta cuando el pop-up se abre
        didOpen: () => {
            const timerElement = Swal.getHtmlContainer().querySelector('b');
            // Actualizar el contador de segundos cada 100ms para que sea fluido
            timerInterval = setInterval(() => {
                timerElement.textContent = Math.ceil(Swal.getTimerLeft() / 1000);
            }, 100);
        },
        // Esta función se ejecuta cuando el pop-up está a punto de cerrarse
        willClose: () => {
            clearInterval(timerInterval);
        }
    }).then(async (result) => {
        // 3. Después de que el pop-up se cierra...
        //    Solo si el usuario confirmó O si se acabó el tiempo.
        if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
            
            // Mostramos un pop-up de carga mientras esperamos la respuesta de la API
            Swal.fire({
                title: 'Validando tu seña...',
                text: 'Por favor, espera.',
                didOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false
            });

            // 4. Ejecutar la validación con la API (el código que ya tenías) 🚀
            try {
                const response = await axios.get('http://192.168.1.136:5000/obtener_ultima_letra');
                const letraReconocida = response.data.letra_reconocida;
                console.log(`Usuario quiere: ${letraUsuario}, Guante hizo: ${letraReconocida}`);

                if (letraReconocida === letraUsuario) {
                    puntaje = Math.min(puntaje + 5, 25);
                    Swal.fire({
                        icon: 'success',
                        title: '¡Correcto!',
                        text: `La seña coincide con la letra "${letraUsuario}". ¡+5 puntos!`,
                        timer: 3000,
                        showConfirmButton: false,
                        showClass: { popup: 'animate__animated animate__bounceIn' },
                        hideClass: { popup: 'animate__animated animate__fadeOutUp' }
                    });
                } else {
                    puntaje = Math.max(puntaje - 1, 0);
                    Swal.fire({
                        icon: 'error',
                        title: 'Incorrecto',
                        text: `Tu seña fue reconocida como "${letraReconocida}", no como "${letraUsuario}". ¡-1 punto!`,
                        showClass: { popup: 'animate__animated animate__shakeX' },
                        hideClass: { popup: 'animate__animated animate__fadeOutDown' },
                        confirmButtonColor: '#dc3545'
                    });
                }
                
                scoreDisplay.textContent = puntaje;

                if (puntaje >= 25) {
                    Swal.fire({
                        icon: 'success',
                        title: '🏆 ¡Nivel completado!',
                        text: 'Has alcanzado 25 puntos. ¡Felicidades!',
                        confirmButtonText: 'Ir al siguiente nivel',
                        confirmButtonColor: '#0d6efd'
                    }).then(() => {
                        window.location.href = '../Nivel/selectLevel.html';
                    });
                }

            } catch (error) {
                let mensajeError = 'No se pudo validar la seña. Verifica que el servidor Flask esté activo.';
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
        }
    });
});

  scoreDisplay.textContent = puntaje;
});

