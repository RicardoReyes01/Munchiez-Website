document.addEventListener('DOMContentLoaded', (event) => {
    const carousel = document.querySelector('.carousel-slider');
    const items = document.querySelectorAll('.carousel-item');
    const totalItems = items.length;
    const itemWidth = 100; // Each item takes 100% width of the carousel
    let currentIndex = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    const threshold = 100; // Minimum swipe distance

    function setPositionByIndex() {
        currentTranslate = currentIndex * -100;
        prevTranslate = currentTranslate;
        setSliderPosition();
    }

    function setSliderPosition() {
        carousel.style.transform = `translateX(${currentTranslate}%)`;
    }

    function animation() {
        setSliderPosition();
        if (isDragging) requestAnimationFrame(animation);
    }

    function touchStart(index) {
        return function(event) {
            currentIndex = index;
            startPos = getPositionX(event);
            isDragging = true;
            animationID = requestAnimationFrame(animation);
            carousel.classList.add('grabbing');
        }
    }

    function touchEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID);
        const movedBy = currentTranslate - prevTranslate;

        if (movedBy < -threshold) {
            currentIndex += 1;
        }

        if (movedBy > threshold) {
            currentIndex -= 1;
        }

        setPositionByIndex();
        carousel.classList.remove('grabbing');
    }

    function touchMove(event) {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            currentTranslate = prevTranslate + currentPosition - startPos;
        }
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    // Mouse events
    items.forEach((item, index) => {
        const img = item.querySelector('img');
        img.addEventListener('dragstart', (e) => e.preventDefault());
        img.addEventListener('mousedown', touchStart(index));
        img.addEventListener('mouseup', touchEnd);
        img.addEventListener('mouseleave', touchEnd);
        img.addEventListener('mousemove', touchMove);
    });

    // Touch events
    items.forEach((item, index) => {
        const img = item.querySelector('img');
        img.addEventListener('touchstart', touchStart(index));
        img.addEventListener('touchend', touchEnd);
        img.addEventListener('touchmove', touchMove);
    });

    // Initial setup for automatic sliding
    if (totalItems > 0) {
        setInterval(() => {
            currentIndex += 1;
            if (currentIndex >= totalItems) {
                currentIndex = 0; // Reset to start
            }
            setPositionByIndex();
        }, 2500);
    }
});
