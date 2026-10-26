const contactForm = document.querySelector("#contact-form");
const contactFormStatus = document.querySelector("#contact-form-status");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const subject = encodeURIComponent(formData.get("subject"));
  const body = encodeURIComponent(
    `Name: ${formData.get("name")}\nEmail: ${formData.get("email")}\n\n${formData.get("message")}`,
  );

  contactFormStatus.textContent = "Opening your email app to send this message.";
  window.location.href = `mailto:hello@looo.store?subject=${subject}&body=${body}`;
});