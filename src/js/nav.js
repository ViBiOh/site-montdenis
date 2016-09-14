const toggleLink = document.getElementById('toggleMenu');
const navElement = document.getElementsByTagName('nav')[0];

function handleNav(target) {
  const navClasses = navElement.classList;
  if (!target || navClasses.contains('displayed')) {
    navClasses.remove('displayed');
  } else {
    navClasses.add('displayed');
  }
}

function handleClick(event) {
  if (navElement.contains(event.target)) {
    return;
  }
  handleNav(toggleLink.contains(event.target));
}

document.addEventListener('touchstart', handleClick);
