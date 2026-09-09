document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll(".scroll-down");

    if (elements.length > 0) {
        const handleScroll = () => {
            elements.forEach((element) => {
                const position = element.getBoundingClientRect().top;
                if (position < window.innerHeight - 100) {
                    element.classList.add("show");
                }
            });
        };

        window.addEventListener("scroll", handleScroll);
        // Initial trigger in case elements are already in viewport
        handleScroll();
    }
});
