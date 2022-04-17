window.addEventListener(
  "load",
  () => {
    function onImgLoad(id, imageContent, throbberContent) {
      return () => {
        document
          .getElementById(`figure-${id}`)
          .replaceChild(imageContent, throbberContent);
      };
    }

    const throbbers = document.querySelectorAll(".throbber");
    for (let i = throbbers.length - 1; i >= 0; i -= 1) {
      const throbber = throbbers[i];
      throbber.style.display = "inline-block";

      const img = new Image();
      img.onload = onImgLoad(throbber.getAttribute("data-id"), img, throbber);
      img.src = throbber.getAttribute("data-src");
      img.alt = throbber.getAttribute("data-alt");
      img.srcset = throbber.getAttribute("data-srcset");
    }
  },
  false
);
