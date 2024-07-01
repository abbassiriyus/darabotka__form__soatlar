<script>
document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var form = event.target;
    var formData = new FormData(form);

    fetch(form.action, {
        method: form.method,
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        if (data.includes("Сообщение успешно отправлено.")) {
            document.querySelector(".success-message").style.display = "block";
            form.style.display = "none";
        } else {
            alert("Ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз.");
    });
});
</script>
