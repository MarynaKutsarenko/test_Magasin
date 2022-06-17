(function () {
  const accordion = document.getElementsByClassName("contentBox");
  const test = document.getElementsByClassName("accordion-button");

  for (let i = 0; i < accordion.length; i++) {
    accordion[i].addEventListener('click', function () {
      this.classList.toggle("active");
    });

  }

  for (let i = 0; i < test.length; i++) {
    test[i].addEventListener('click', function () {
      this.classList.toggle("arrow-up");
    })
  }

}());
