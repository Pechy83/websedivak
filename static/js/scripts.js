/**
 * Start Bootstrap - Agency v7.0.12 (https://startbootstrap.com/theme/agency)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
 **/


document.addEventListener("DOMContentLoaded", () => {
  const form           = document.getElementById("contactForm");
  const nameField      = document.getElementById("name");
  const emailField     = document.getElementById("email");
  const phoneField     = document.getElementById("phone");
  const messageField   = document.getElementById("message");
  const successMessage = document.getElementById("submitSuccessMessage");
  const errorMessage   = document.getElementById("submitErrorMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 1) Reset validace a hlášky
    [nameField, emailField, phoneField, messageField].forEach(f => f.classList.remove("is-invalid"));
    successMessage.classList.add("d-none");
    errorMessage.classList.add("d-none");

    // 2) Lokální validace
    let isValid = true;
    if (!nameField.value.trim()) {
      nameField.classList.add("is-invalid");
      isValid = false;
    }
    if (!emailField.value.trim() || !emailField.value.includes("@")) {
      emailField.classList.add("is-invalid");
      isValid = false;
    }
    if (!phoneField.value.trim()) {
      phoneField.classList.add("is-invalid");
      isValid = false;
    }
    if (!messageField.value.trim()) {
      messageField.classList.add("is-invalid");
      isValid = false;
    }
    if (!isValid) {
      errorMessage.textContent = "Prosím vyplňte všechna povinná pole správně.";
      errorMessage.classList.remove("d-none");
      return;
    }

    // 3) reCAPTCHA
    const recaptchaToken = (window.grecaptcha) ? grecaptcha.getResponse() : "";
    if (!recaptchaToken) {
      errorMessage.textContent = "Prosím potvrďte reCAPTCHA.";
      errorMessage.classList.remove("d-none");
      return;
    }

    // 4) Sestav FormData (z pole i tokenu)
    const formData = new FormData(form);
    formData.set("g-recaptcha-response", recaptchaToken);

    // 5) Odeslání AJAXem
    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData
      });

      // 6) Parsuj JSON
      let result;
      try {
        result = await response.json();
      } catch {
        errorMessage.textContent = "Neplatná odezva od serveru.";
        errorMessage.classList.remove("d-none");
        return;
      }

      // 7) Zobraz odpovídající hlášku
      if (result.success) {
        successMessage.classList.remove("d-none");
        form.reset();
        grecaptcha.reset();
      } else {
        errorMessage.textContent = result.error || "Chyba při odesílání zprávy!";
        errorMessage.classList.remove("d-none");
      }

    } catch (err) {
      console.error("Fetch error:", err);
      errorMessage.textContent = "Došlo k neočekávané chybě.";
      errorMessage.classList.remove("d-none");
    }
  });
});



window.addEventListener('DOMContentLoaded', () => {

    // Navbar shrink function
    const navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        navbarCollapsible.classList.toggle('navbar-shrink', window.scrollY !== 0);
    };

    // Shrink the navbar on load
    navbarShrink();

    // Shrink the navbar on scroll
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    }

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

// JavaScript pro zoom obrázků
document.addEventListener("DOMContentLoaded", function () {
    // Zoom obrázky
    document.querySelectorAll('.zoom-img').forEach(function(img) {
        img.addEventListener('click', function() {
            this.classList.toggle('zoom-active');
        });
    });
});


    /* Odeslání kontaktního formuláře pomocí FormData
    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            const formData = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: "POST",
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    alert(result.message);
                    form.reset();
                } else {
                    alert(result.error || "Odeslání selhalo.");
                }
            } catch (error) {
                console.error("Chyba při odesílání:", error);
                alert("Odeslání se nezdařilo.");
            }
        });
    } */


/* oprava formuláře -await
let response = await fetch("https://websedivak-c4c7a7634080.herokuapp.com/submit_form", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('.zoom-img').forEach(function(img) {
      img.addEventListener('click', function() {
        this.classList.toggle('zoom-active');
      });
    });
  });
  */