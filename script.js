  /* ==========================================================================
       4. SCROLL REVEAL (FADE-IN ANIMATIONS)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Once visible, stop tracking to save performance
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Offset triggers slightly early
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    /* ==========================================================================
       5. STATS ANIMATING COUNTER
       ========================================================================== */
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    function startCounters() {
        if (countersStarted) return;
        countersStarted = true;

        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 2000; // 2 seconds animation
            const stepTime = Math.abs(Math.floor(duration / target));
            
            // Adjust step time to prevent very slow animations for low numbers
            const finalStepTime = Math.max(stepTime, 25); 
            let current = 0;
            
            const incrementValue = target > 100 ? Math.ceil(target / (duration / finalStepTime)) : 1;

            const timer = setInterval(() => {
                current += incrementValue;
                if (current >= target) {
                    stat.textContent = target + (stat.parentNode.textContent.includes('%') ? '%' : '+');
                    clearInterval(timer);
                } else {
                    stat.textContent = current + (stat.parentNode.textContent.includes('%') ? '%' : '+');
                }
            }, finalStepTime);
        });
    }

    // Observer to start counters when stats section scrolled into view
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                startCounters();
                statsObserver.unobserve(statsSection);
            }
        }, { threshold: 0.3 });

        statsObserver.observe(statsSection);
    }