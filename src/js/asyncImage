function loadAsyncImage(url, alt, figureId, figureCaptionId, throbberId)
  document.getElementById(throbberId).style.display = 'inline-block';

  const image = new Image();
  image.onload = function () {
    document.getElementById(figureId).insertBefore(image, document.getElementById(figureCaptionId));
    document.getElementById(throbberId).style.display = 'none';
  };
  image.srcset = url + '.jpg?v={{version}}, ' + url + '-640.jpg?v={{version}} 640w';
  image.src = url + '.jpg?v={{version}}';
  image.alt = alt;
  image.width = '0';
}
