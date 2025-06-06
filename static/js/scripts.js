/*
* Start Bootstrap - Agency v7.0.12 (https://startbootstrap.com/theme/agency)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
*/


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

// JavaScript pro zoom obrázků a odeslání kontaktního formuláře
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