window.addEventListener('load', function() {
  function onImgLoad(id, imageContent, throbberContent) {
    return function() {
      document.getElementById('figure-' + id).replaceChild(imageContent, throbberContent);
    }
  }

  var throbbers = document.querySelectorAll('.throbber');
  for (var i = throbbers.length - 1; i >= 0; i--) {
    var throbber = throbbers[i];
    throbber.style.display = 'inline-block';

    var img = new Image();
    img.onload = onImgLoad(throbber.getAttribute('data-id'), img, throbber);
    img.src = throbber.getAttribute('data-src');
    img.alt = throbber.getAttribute('data-alt');
    img.srcset = throbber.getAttribute('data-srcset');
  }
}, false);
