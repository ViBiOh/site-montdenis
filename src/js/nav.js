var toggleLink = document.getElementById('toggleMenu');
var navElement = document.getElementsByTagName('nav')[0];

function handleNav(show) {
  const navClasses = navElement.classList;
  if (show) {
    navClasses.add('displayed');
  } else {
    navClasses.remove('displayed');
  }
}

function handleClick(event) {
  if (navElement.contains(event.target)) {
      return;
  }
  handleNav(toggleLink.contains(event.target));
}

document.addEventListener('click', handleClick);
document.addEventListener('touchstart', handleClick);
