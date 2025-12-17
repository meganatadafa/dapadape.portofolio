// Simple FormSpree Contact Form

document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contact-form");

  if (!contactForm) {
    console.log("Contact form not found");
    return;
  }

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form elements
    const submitBtn = contactForm.querySelector(".submit-btn-simple");
    const messageDiv = contactForm.querySelector(".form-message-simple");

    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get("name");
    const email = formData.get("email");
    const subject = formData.get("subject");
    const message = formData.get("message");

    // Basic validation
    if (!name || !email || !subject || !message) {
      showMessage("Mohon lengkapi semua field yang wajib diisi!", "error");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage("Format email tidak valid!", "error");
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = "Mengirim...";
    showMessage("Sedang mengirim pesan...", "info");

    // Send to FormSpree
    fetch(contactForm.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json"
      }
    })
      .then((response) => {
        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

        if (response.ok) {
          return response.json();
        } else {
          // Try to get error details
          return response.text().then((text) => {
            console.error("Error response:", text);
            throw new Error("Gagal mengirim pesan: " + response.statusText);
          });
        }
      })
      .then((data) => {
        console.log("Success data:", data);
        showMessage("Terima kasih! Pesan Anda telah terkirim.", "success");
        contactForm.reset();
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        showMessage("Terjadi kesalahan. Silakan coba lagi nanti.", "error");
      })
      .finally(() => {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = "Kirim Pesan";

        // Hide message after 5 seconds
        setTimeout(() => {
          hideMessage();
        }, 5000);
      });
  });

  function showMessage(text, type) {
    const messageDiv = document.querySelector(".form-message-simple");
    messageDiv.textContent = text;
    messageDiv.className = `form-message-simple ${type}`;
    messageDiv.style.display = "block";
  }

  function hideMessage() {
    const messageDiv = document.querySelector(".form-message-simple");
    messageDiv.style.display = "none";
  }
});
