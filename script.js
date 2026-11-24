
// ===============================
// 1. МОБИЛЬНОЕ МЕНЮ
// ===============================

const menuButton = document.createElement("button");

menuButton.className = "mobile-menu-button";
menuButton.textContent = "☰";
menuButton.setAttribute("aria-label", "Открыть меню");
menuButton.setAttribute("aria-expanded", "false");

const header = document.querySelector(".header .container");
const navigation = document.querySelector(".navigation");

if (header && navigation) {
    header.insertBefore(menuButton, navigation);

    menuButton.addEventListener("click", () => {
        navigation.classList.toggle("active");

        const isOpen = navigation.classList.contains("active");

        menuButton.textContent = isOpen ? "✕" : "☰";
        menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    navigation.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navigation.classList.remove("active");
            menuButton.textContent = "☰";
            menuButton.setAttribute("aria-expanded", "false");
        });
    });
}


// ===============================
// 2. ПЛАВНАЯ ПРОКРУТКА
// ===============================

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function(event) {
        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});


// ===============================
// 3. АНИМАЦИЯ ПОЯВЛЕНИЯ
// ===============================

const animatedElements = document.querySelectorAll(
    ".about, .service-card, .contacts"
);

if ("IntersectionObserver" in window) {
    animatedElements.forEach(element => {
        element.classList.add("hidden-animation");
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show-animation");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}


// ===============================
// 4. ФОРМА ОБРАТНОЙ СВЯЗИ
// ===============================

const contactButton = document.querySelector(
    ".hero .button-outline"
);

if (contactButton) {
    contactButton.addEventListener("click", function(event) {
        event.preventDefault();

        const oldForm = document.querySelector(".popup-form");

        if (oldForm) {
            oldForm.remove();
            return;
        }

        const popup = document.createElement("div");
        popup.className = "popup-form";

        popup.innerHTML = `
            <div class="popup-content">

                <button class="popup-close" aria-label="Закрыть">×</button>

                <h2>Оставить заявку</h2>

                <p>Заполните форму, и мы свяжемся с вами.</p>

                <form id="request-form">

                    <input
                        type="text"
                        name="name"
                        placeholder="Ваше имя"
                        required
                    >

                    <input
                        type="tel"
                        name="phone"
                        placeholder="Ваш телефон"
                        required
                    >

                    <textarea
                        name="message"
                        placeholder="Ваш вопрос"
                    ></textarea>

                    <button type="submit" class="button">
                        Отправить заявку
                    </button>

                    <p class="form-message" role="status"></p>

                </form>

            </div>
        `;

        document.body.appendChild(popup);

        popup.querySelector(".popup-close").addEventListener("click", () => {
            popup.remove();
        });

        popup.addEventListener("click", event => {
            if (event.target === popup) {
                popup.remove();
            }
        });

        // Отправка заявки на сервер и в Telegram
        popup.querySelector("#request-form").addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                const form = event.currentTarget;
                const formData = new FormData(form);

                const name = formData.get("name").trim();
                const phone = formData.get("phone").trim();
                const messageText = formData.get("message").trim();

                const message = popup.querySelector(".form-message");
                const submitButton = form.querySelector('button[type="submit"]');

                submitButton.disabled = true;
                submitButton.textContent = "Отправляем...";
                message.textContent = "";

                try {
                    const response = await fetch("/api/contact", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            name: name,
                            phone: phone,
                            message: messageText
                        })
                    });

                    const result = await response.json();

                    if (!response.ok || !result.success) {
                        throw new Error(result.error || "Не удалось отправить заявку");
                    }

                    message.textContent =
                        `Спасибо, ${name}! Заявка успешно отправлена.`;

                    form.reset();

                } catch (error) {
                    console.error("Ошибка отправки:", error);

                    message.textContent =
                        "Не удалось отправить заявку. Попробуйте ещё раз.";

                } finally {
                    submitButton.disabled = false;
                    submitButton.textContent = "Отправить заявку";
                }
            }
        );
    });
}


// ===============================
// 5. ГОД В ПОДВАЛЕ
// ===============================

console.log("Сайт успешно загружен!");
