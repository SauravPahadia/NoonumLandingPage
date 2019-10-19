(function () {
  const win = window
  const doc = document.documentElement
  var wow = new WOW({mobile: false});
   wow.init();

  doc.classList.remove('no-js')
  doc.classList.add('js')

  // Reveal animations
  if (document.body.classList.contains('has-animations')) {
    /* global ScrollReveal */
    const sr = window.sr = ScrollReveal()

    sr.reveal('.hero-title, .hero-paragraph, .hero-cta', {
      duration: 1000,
      distance: '40px',
      easing: 'cubic-bezier(0.5, -0.01, 0, 1.005)',
      origin: 'bottom',
      interval: 150
    })
  }

  // Moving objects
  const movingObjects = document.querySelectorAll('.is-moving-object')

  // Throttling
  function throttle (func, milliseconds) {
    let lastEventTimestamp = null
    let limit = milliseconds

    return (...args) => {
      let now = Date.now()

      if (!lastEventTimestamp || now - lastEventTimestamp >= limit) {
        lastEventTimestamp = now
        func.apply(this, args)
      }
    }
  }

  // Init vars
  let mouseX = 0
  let mouseY = 0
  let scrollY = 0
  let coordinateX = 0
  let coordinateY = 0
  let winW = doc.clientWidth
  let winH = doc.clientHeight

  // Move Objects
  function moveObjects (e, object) {


    mouseX = e.pageX
    mouseY = e.pageY
    scrollY = win.scrollY
    coordinateX = (winW / 2) - mouseX
    coordinateY = (winH / 2) - (mouseY - scrollY)

    for (let i = 0; i < object.length; i++) {
      const translatingFactor = object[i].getAttribute('data-translating-factor') || 20
      const rotatingFactor = object[i].getAttribute('data-rotating-factor') || 20
      const perspective = object[i].getAttribute('data-perspective') || 500
      let tranformProperty = []

      if (object[i].classList.contains('is-translating')) {
        tranformProperty.push('translate(' + coordinateX / translatingFactor + 'px, ' + coordinateY / translatingFactor + 'px)')
      }

      if (object[i].classList.contains('is-rotating')) {
        tranformProperty.push('perspective(' + perspective + 'px) rotateY(' + -coordinateX / rotatingFactor + 'deg) rotateX(' + coordinateY / rotatingFactor + 'deg)')
      }

      if (object[i].classList.contains('is-translating') || object[i].classList.contains('is-rotating')) {
        tranformProperty = tranformProperty.join(' ')

        object[i].style.transform = tranformProperty
        object[i].style.transition = 'transform 1s ease-out'
        object[i].style.transformStyle = 'preserve-3d'
        object[i].style.backfaceVisibility = 'hidden'
      }
    }
  }

  $("#contact-form").validate({
      rules: {
          name: {
              required: true,
              minlength: 2
          },
          message: {
              required: false,
              minlength: 2
          },
          email: {
              required: true,
              email: true
          }
      },
      messages: {
          name: {
              required: "Please enter Your Name",
              minlength: "Your name must consist of at least 2 characters"
          },
          message: {
              minlength: "Your message must consist of at least 2 characters"
          },
          email: "Please enter a valid email address"
      },
      submitHandler: function (form) {
          var payload = {};
          $.each($(form).serializeArray(), function (i, v) {
              payload[v.name] = v.value;
          });
          $.ajax({
              type: "POST",
              data: payload,
              dataType: "json",
              url: "https://formcarry.com/s/LOIVJHxq64h",
              success: function () {
                  $('#contact-form :input').attr('disabled', 'disabled');
                  $('#contact-form').fadeTo("slow", 0.15, function () {
                      $(form).find(':input').attr('disabled', 'disabled');
                      $(form).find('label').css('cursor', 'default');
                      $('#success').fadeIn();
                  });
              },
              error: function () {
                  $('#contact-form').fadeTo("slow", 0.15, function () {
                      $('#error').fadeIn();
                  });
              }
          });
      }
  });

  // Call function with throttling
  if (movingObjects) {
    win.addEventListener('mousemove', throttle(
      function (e) {
        moveObjects(e, movingObjects)
      },
      150
    ))
  }
}())
