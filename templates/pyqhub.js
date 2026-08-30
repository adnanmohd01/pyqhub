<script>
    const elements = document.querySelectorAll(".scroll-down");

  window.addEventListener("scroll", () => {
        elements.forEach((element) => {
            const position = element.getBoundingClientRect().top;

            if (position < window.innerHeight - 100) {
                element.classList.add("show");
            }
        });
  });
</script>