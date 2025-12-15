// contact.js - Fungsi untuk mengirim pesan menggunakan PHPMailer

document.addEventListener("DOMContentLoaded", function () {
  console.log("Contact.js loaded");

  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    console.log("Contact form found");

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Ambil nilai dari form
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;
      const formMessage = document.querySelector(".form-message");
      const submitButton = contactForm.querySelector('button[type="submit"]');

      console.log("Form submitted with data:", { name, email, message });

      // Validasi form
      if (!name || !email || !message) {
        formMessage.textContent = "Mohon isi semua field!";
        formMessage.style.color = "red";
        return;
      }

      // Validasi format email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        formMessage.textContent = "Format email tidak valid!";
        formMessage.style.color = "red";
        return;
      }

      // Disable button dan tampilkan loading
      submitButton.disabled = true;
      submitButton.textContent = "Mengirim...";
      formMessage.textContent = "Sedang mengirim pesan...";
      formMessage.style.color = "#7c3aed";

      // Kirim data ke PHP menggunakan Fetch API
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("message", message);

      console.log("Sending request to: send-email.php");

      // PERBAIKAN: Gunakan relative path (tanpa slash di depan)
      fetch("send-email.php", {
        method: "POST",
        body: formData
      })
        .then((response) => {
          console.log("Response status:", response.status);
          console.log("Response OK:", response.ok);

          // Cek apakah response ok
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          return response.text();
        })
        .then((text) => {
          console.log("Response text:", text);

          try {
            const data = JSON.parse(text);
            console.log("Parsed data:", data);

            if (data.status === "success") {
              formMessage.textContent = data.message;
              formMessage.style.color = "green";
              contactForm.reset();
            } else {
              formMessage.textContent = data.message;
              formMessage.style.color = "red";
            }
          } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            console.error("Raw response:", text);
            formMessage.textContent = "Error: Response tidak valid dari server";
            formMessage.style.color = "red";
          }
        })
        .catch((error) => {
          console.error("Fetch Error:", error);
          formMessage.textContent = "Terjadi kesalahan: " + error.message;
          formMessage.style.color = "red";
        })
        .finally(() => {
          // Enable button kembali
          submitButton.disabled = false;
          submitButton.textContent = "Send Message";

          // Hapus pesan setelah 5 detik
          setTimeout(() => {
            formMessage.textContent = "";
          }, 5000);
        });
    });
  } else {
    console.error("Form dengan ID 'contact-form' tidak ditemukan!");
  }
});
