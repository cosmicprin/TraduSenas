document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('.form-control');
  const jugarBtn = document.getElementById('button-addon2');

  const nombreGuardado = sessionStorage.getItem('usuario');
  if (nombreGuardado) input.value = nombreGuardado;

  jugarBtn.addEventListener('click', () => {
    const nombre = input.value.trim();
    if (nombre) {
      sessionStorage.setItem('usuario', nombre);
      window.location.href = '/FrontEnd/Nivel/selectLevel.html';
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Elija un nombre de usuario',
        text: 'Ingresa un nombre de usuario para jugar',
        confirmButtonColor: '#0d6efd'
      });
    }
  });
});