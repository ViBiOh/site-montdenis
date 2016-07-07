var navElement = document.getElementById('navMenu');

function handleClick(event) {
  if (navElement.contains(event.target)) {
      return;
  }
  location.hash = '';
}

document.addEventListener('touchstart', handleClick);
