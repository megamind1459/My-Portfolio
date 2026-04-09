document.addEventListener("DOMContentLoaded", () => {
    // --- 1. TYPEWRITER LOGIC ---
    const roles = ["Web Developer", "Graphics Designer", "Web Designer"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typewriterElement = document.getElementById("typewriter");

    function animateText() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 100 : 150;

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }

        setTimeout(animateText, typeSpeed);
    }

    if (typewriterElement) animateText();

    // --- 2. SKILL BAR OBSERVER ---
   const observerOptions = {
        threshold: 0.2, // Trigger when 20% of the bar is visible
        rootMargin: "0px 0px -50px 0px" // Triggers slightly before it hits the viewport
    };

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const progressChild = bar.querySelector('.skill-progress');
                
                // Get the percentage from the style attribute (e.g., 95%)
                const targetWidth = bar.style.getPropertyValue('--target-width').trim();
                
                if (progressChild && targetWidth) {
                    // Force the width change
                    progressChild.style.width = targetWidth;
                    bar.classList.add('active');
                }
                
                // Stop watching once the animation has started
                skillObserver.unobserve(bar);
            }
        });
    }, observerOptions);

    // Find all bars and start watching them
    const allBars = document.querySelectorAll('.reveal-bar');
    allBars.forEach(bar => {
        skillObserver.observe(bar);
    });

    console.log("Skill Observer active for", allBars.length, "elements");
});