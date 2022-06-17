(function () {
  const accordion = document.getElementsByClassName("contentBox");
  const buttons = document.getElementsByClassName("accordion-button");

  for (let i = 0; i < accordion.length; i++) {
    accordion[i].addEventListener('click', function () {
      this.classList.toggle("active");
    });

  }

  for (let i = 0; i < buttons.length; i++) {
     buttons[i].addEventListener('click', function () {
      this.classList.toggle("arrow-up");
    })
  }

}());
