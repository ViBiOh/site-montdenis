var toggleLink = document.getElementById('toggleMenu');
var navElement = document.getElementsByTagName('nav')[0];
function handleNav(forceHide) {
  const navClasses = navElement.classList;
  if (forceHide || navClasses.contains('displayed')) {
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
document.addEventListener('click', handleClick);
document.addEventListener('touchstart', handleClick);
