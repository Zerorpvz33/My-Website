// Custom Cursor
class CustomCursor {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursorFollower = document.createElement('div');
        this.cursor.className = 'cursor';
        this.cursorFollower.className = 'cursor-follower';
        
        document.body.appendChild(this.cursor);
        document.body.appendChild(this.cursorFollower);
        
        this.init();
    }

    init() {
        let mouseX = 0;
        let mouseY = 0;
        let followerX = 0;
        let followerY = 0;

        // Mouse move event
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            this.cursor.style.left = mouseX + 'px';
            this.cursor.style.top = mouseY + 'px';
        });

        // Smooth follower animation
        const animateFollower = () => {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            
            this.cursorFollower.style.left = followerX + 'px';
            this.cursorFollower.style.top = followerY + 'px';
            
            requestAnimationFrame(animateFollower);
        };
        animateFollower();

        // Hover effects
        const hoverElements = document.querySelectorAll('a, button, .project-card, .gallery-item, .nav-link');
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hover');
                this.cursorFollower.classList.add('hover');
            });
            
            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover');
                this.cursorFollower.classList.remove('hover');
            });
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
            this.cursorFollower.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
            this.cursorFollower.style.opacity = '0.5';
        });
    }
}

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Shopping Cart Functionality
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.cartToggle = document.getElementById('cartToggle');
        this.cartSidebar = document.getElementById('cartSidebar');
        this.cartClose = document.getElementById('cartClose');
        this.cartItems = document.getElementById('cartItems');
        this.cartTotal = document.getElementById('cartTotal');
        this.cartCount = document.querySelector('.cart-count');
        this.checkoutBtn = document.getElementById('checkoutBtn');
        
        this.init();
    }

    init() {
        this.updateCartDisplay();
        this.bindEvents();
    }

    bindEvents() {
        // Cart toggle
        if (this.cartToggle) {
            this.cartToggle.addEventListener('click', () => {
                this.cartSidebar.classList.add('active');
            });
        }

        // Cart close
        if (this.cartClose) {
            this.cartClose.addEventListener('click', () => {
                this.cartSidebar.classList.remove('active');
            });
        }

        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-product');
                const price = parseFloat(e.target.getAttribute('data-price'));
                const productName = e.target.closest('.product-card').querySelector('h3').textContent;
                const productImage = e.target.closest('.product-card').querySelector('img').src;
                
                this.addItem({
                    id: productId,
                    name: productName,
                    price: price,
                    image: productImage
                });
                
                this.showNotification(`${productName} toegevoegd aan winkelwagen!`, 'success');
            });
        });

        // Checkout
        if (this.checkoutBtn) {
            this.checkoutBtn.addEventListener('click', () => {
                this.checkout();
            });
        }
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        
        this.saveCart();
        this.updateCartDisplay();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateCartDisplay() {
        // Update cart count
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        if (this.cartCount) {
            this.cartCount.textContent = totalItems;
            this.cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }

        // Update cart total
        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (this.cartTotal) {
            this.cartTotal.textContent = total.toFixed(2);
        }

        // Update cart items display
        if (this.cartItems) {
            if (this.items.length === 0) {
                this.cartItems.innerHTML = '<p class="empty-cart">Je winkelwagen is leeg</p>';
            } else {
                this.cartItems.innerHTML = this.items.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">€${item.price.toFixed(2)} x ${item.quantity}</div>
                        </div>
                        <button class="cart-item-remove" onclick="cart.removeItem('${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `).join('');
            }
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    checkout() {
        if (this.items.length === 0) {
            this.showNotification('Je winkelwagen is leeg!', 'error');
            return;
        }

        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemsList = this.items.map(item => `${item.name} x${item.quantity} - €${(item.price * item.quantity).toFixed(2)}`).join('\n');
        
        const subject = 'Prints bestellen';
        const body = `Hey Sem,\n\nIk wil graag deze prints:\n\n${itemsList}\n\nTotaal: €${total.toFixed(2)}\n\nHoe regel ik de betaling?\n\nThanks!`;
        
        const mailtoLink = `mailto:semweijers0@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
        
        this.showNotification('Bestelling wordt geopend in je email app!', 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'error' ? '#ef4444' : '#10b981'};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}
// Contact Form with Email Integration
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const service = formData.get('service');
        const budget = formData.get('budget');
        const message = formData.get('message');
        
        // Validation
        if (!name || !email || !message) {
            showNotification('Vul alle verplichte velden in!', 'error');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Voer een geldig email adres in!', 'error');
            return;
        }
        
        // Create email
        const subject = `Hoi Sem - ${name}`;
        let body = `Hey Sem,\n\nIk heb misschien iets voor je.\n\n`;
        body += `Ik ben ${name}\n`;
        body += `Email: ${email}\n`;
        if (phone) body += `Tel: ${phone}\n`;
        if (service) body += `Zoek: ${service}\n`;
        if (budget) body += `Budget: ${budget}\n`;
        body += `\nHet idee:\n${message}\n\n`;
        body += `Laat maar weten of je tijd hebt!\n\n${name}`;
        
        const mailtoLink = `mailto:semweijers0@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
        
        this.reset();
        showNotification('Bericht wordt geopend in je email app!', 'success');
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#ef4444' : '#10b981'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Initialize everything when DOM is loaded
let cart;
let customCursor;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize custom cursor (only on desktop)
    if (window.innerWidth > 768) {
        customCursor = new CustomCursor();
    }
    
    // Initialize shopping cart
    cart = new ShoppingCart();
    
    // Add loading animations
    const elementsToAnimate = document.querySelectorAll('.project-card, .service-card, .product-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Close cart when clicking outside
document.addEventListener('click', (e) => {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartToggle = document.getElementById('cartToggle');
    
    if (cartSidebar && cartSidebar.classList.contains('active')) {
        if (!cartSidebar.contains(e.target) && !cartToggle.contains(e.target)) {
            cartSidebar.classList.remove('active');
        }
    }
});

// ===== DOODLE INTERACTIONS =====

// Interactive Doodles Class
class InteractiveDoodles {
    constructor() {
        this.doodles = [];
        this.cursorTrails = [];
        this.init();
    }

    init() {
        this.createCursorTrail();
        this.addDoodleInteractions();
        this.addTypingAnimation();
        this.addParallaxEffect();
        this.addClickEffects();
        this.addHoverSounds();
    }

    // Create cursor trail effect
    createCursorTrail() {
        if (window.innerWidth <= 768) return; // Skip on mobile

        let trails = [];
        const maxTrails = 8;

        document.addEventListener('mousemove', (e) => {
            // Create new trail element
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.left = e.clientX + 'px';
            trail.style.top = e.clientY + 'px';
            document.body.appendChild(trail);

            trails.push(trail);

            // Animate trail
            setTimeout(() => {
                trail.style.opacity = '0.6';
                trail.style.transform = 'scale(1)';
            }, 10);

            // Remove old trails
            if (trails.length > maxTrails) {
                const oldTrail = trails.shift();
                if (oldTrail && oldTrail.parentNode) {
                    oldTrail.parentNode.removeChild(oldTrail);
                }
            }

            // Fade out trail
            setTimeout(() => {
                trail.style.opacity = '0';
                trail.style.transform = 'scale(0)';
                setTimeout(() => {
                    if (trail && trail.parentNode) {
                        trail.parentNode.removeChild(trail);
                    }
                }, 300);
            }, 200);
        });
    }

    // Add interactions to floating doodles
    addDoodleInteractions() {
        const doodles = document.querySelectorAll('.doodle');
        
        doodles.forEach((doodle, index) => {
            // Random rotation on load
            doodle.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            // Click interaction
            doodle.addEventListener('click', () => {
                this.createDoodleExplosion(doodle);
            });

            // Hover interaction
            doodle.addEventListener('mouseenter', () => {
                doodle.style.transform = `scale(1.5) rotate(${Math.random() * 360}deg)`;
                doodle.style.zIndex = '1000';
            });

            doodle.addEventListener('mouseleave', () => {
                doodle.style.transform = `scale(1) rotate(${Math.random() * 360}deg)`;
                doodle.style.zIndex = '1';
            });

            // Random movement
            setInterval(() => {
                if (Math.random() > 0.7) {
                    this.animateDoodle(doodle);
                }
            }, 3000 + Math.random() * 5000);
        });
    }

    // Create explosion effect when doodle is clicked
    createDoodleExplosion(doodle) {
        const rect = doodle.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const emojis = ['✨', '💫', '⭐', '🌟', '💥', '🎉'];
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            particle.style.cssText = `
                position: fixed;
                left: ${centerX}px;
                top: ${centerY}px;
                font-size: 1.5rem;
                pointer-events: none;
                z-index: 1001;
                transition: all 1s ease-out;
            `;
            
            document.body.appendChild(particle);

            // Animate particles
            setTimeout(() => {
                const angle = (i / 8) * Math.PI * 2;
                const distance = 100 + Math.random() * 100;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                
                particle.style.transform = `translate(${x}px, ${y}px) scale(0) rotate(720deg)`;
                particle.style.opacity = '0';
            }, 10);

            // Remove particle
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }

        // Animate original doodle
        doodle.style.transform = 'scale(0) rotate(360deg)';
        setTimeout(() => {
            doodle.style.transform = 'scale(1) rotate(0deg)';
        }, 500);
    }

    // Animate individual doodle
    animateDoodle(doodle) {
        const originalTransform = doodle.style.transform;
        doodle.style.transition = 'transform 0.5s ease';
        doodle.style.transform = `scale(1.2) rotate(${Math.random() * 360}deg)`;
        
        setTimeout(() => {
            doodle.style.transform = originalTransform;
            setTimeout(() => {
                doodle.style.transition = '';
            }, 500);
        }, 500);
    }

    // Add typing animation to hero subtitle
    addTypingAnimation() {
        const typingElement = document.querySelector('.typing-text');
        if (!typingElement) return;

        const text = typingElement.textContent;
        typingElement.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                typingElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50 + Math.random() * 50);
            }
        };

        // Start typing after a delay
        setTimeout(typeWriter, 1000);
    }

    // Add parallax effect to background elements
    addParallaxEffect() {
        const shapes = document.querySelectorAll('.bg-shape');
        const doodles = document.querySelectorAll('.section-doodle');

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            shapes.forEach((shape, index) => {
                const speed = 0.2 + (index * 0.1);
                shape.style.transform = `translateY(${scrolled * speed}px)`;
            });

            doodles.forEach((doodle, index) => {
                const speed = 0.1 + (index * 0.05);
                doodle.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
            });
        });
    }

    // Add click effects to buttons and cards
    addClickEffects() {
        const clickableElements = document.querySelectorAll('.btn, .project-card, .service-card, .product-card');
        
        clickableElements.forEach(element => {
            element.addEventListener('click', (e) => {
                this.createRippleEffect(e, element);
            });
        });
    }

    // Create ripple effect on click
    createRippleEffect(e, element) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            left: ${x}px;
            top: ${y}px;
            width: 20px;
            height: 20px;
            margin-left: -10px;
            margin-top: -10px;
            pointer-events: none;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    // Add hover sound effects (visual feedback)
    addHoverSounds() {
        const hoverElements = document.querySelectorAll('.btn, .nav-link, .social-link');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.createHoverEffect(element);
            });
        });
    }

    // Create visual hover effect
    createHoverEffect(element) {
        const effect = document.createElement('div');
        effect.textContent = '✨';
        effect.style.cssText = `
            position: absolute;
            top: -10px;
            right: -10px;
            font-size: 1rem;
            pointer-events: none;
            z-index: 1000;
            animation: sparkle 0.6s ease-out forwards;
        `;

        element.style.position = 'relative';
        element.appendChild(effect);

        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 600);
    }
}

// Fun Loading Screen
class LoadingScreen {
    constructor() {
        this.createLoadingScreen();
    }

    createLoadingScreen() {
        const loader = document.createElement('div');
        loader.id = 'loading-screen';
        loader.innerHTML = `
            <div class="loading-content">
                <div class="loading-doodles">
                    <div class="loading-doodle">🎨</div>
                    <div class="loading-doodle">✨</div>
                    <div class="loading-doodle">🚀</div>
                </div>
                <h2>Sem's Portfolio</h2>
                <p>Laden van creativiteit...</p>
                <div class="loading-bar">
                    <div class="loading-progress"></div>
                </div>
            </div>
        `;

        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            color: white;
            text-align: center;
        `;

        document.body.appendChild(loader);

        // Animate loading
        let progress = 0;
        const progressBar = loader.querySelector('.loading-progress');
        const doodles = loader.querySelectorAll('.loading-doodle');

        const loadingInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            
            progressBar.style.width = progress + '%';
            
            // Animate doodles
            doodles.forEach((doodle, index) => {
                doodle.style.transform = `translateY(${Math.sin(Date.now() * 0.001 + index) * 20}px) rotate(${Date.now() * 0.1 + index * 120}deg)`;
            });

            if (progress >= 100) {
                clearInterval(loadingInterval);
                setTimeout(() => {
                    loader.style.opacity = '0';
                    setTimeout(() => {
                        if (loader.parentNode) {
                            loader.parentNode.removeChild(loader);
                        }
                    }, 500);
                }, 500);
            }
        }, 100);

        // Add CSS for loading animations
        const style = document.createElement('style');
        style.textContent = `
            .loading-content h2 {
                font-size: 2.5rem;
                margin-bottom: 1rem;
                font-weight: 300;
            }
            .loading-content p {
                font-size: 1.2rem;
                margin-bottom: 2rem;
                opacity: 0.9;
            }
            .loading-doodles {
                display: flex;
                gap: 2rem;
                margin-bottom: 2rem;
                justify-content: center;
            }
            .loading-doodle {
                font-size: 3rem;
                animation: bounce 1s infinite;
            }
            .loading-doodle:nth-child(2) { animation-delay: 0.2s; }
            .loading-doodle:nth-child(3) { animation-delay: 0.4s; }
            .loading-bar {
                width: 300px;
                height: 4px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 2px;
                overflow: hidden;
                margin: 0 auto;
            }
            .loading-progress {
                height: 100%;
                background: white;
                width: 0%;
                transition: width 0.3s ease;
                border-radius: 2px;
            }
            @keyframes sparkle {
                0% { transform: scale(0) rotate(0deg); opacity: 1; }
                100% { transform: scale(1) rotate(180deg); opacity: 0; }
            }
            @keyframes ripple {
                to { transform: scale(4); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Easter Eggs
class EasterEggs {
    constructor() {
        this.konamiCode = [];
        this.konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
        this.init();
    }

    init() {
        this.addKonamiCode();
        this.addSecretClick();
        this.addTimeBasedEffects();
    }

    addKonamiCode() {
        document.addEventListener('keydown', (e) => {
            this.konamiCode.push(e.keyCode);
            
            if (this.konamiCode.length > this.konamiSequence.length) {
                this.konamiCode.shift();
            }
            
            if (this.konamiCode.join(',') === this.konamiSequence.join(',')) {
                this.activatePartyMode();
            }
        });
    }

    addSecretClick() {
        let clickCount = 0;
        const logo = document.querySelector('.nav-logo');
        
        if (logo) {
            logo.addEventListener('click', (e) => {
                e.preventDefault();
                clickCount++;
                
                if (clickCount >= 5) {
                    this.showSecretMessage();
                    clickCount = 0;
                }
                
                setTimeout(() => {
                    if (clickCount > 0) clickCount--;
                }, 2000);
            });
        }
    }

    addTimeBasedEffects() {
        const hour = new Date().getHours();
        
        if (hour >= 22 || hour <= 6) {
            // Night mode easter egg
            document.body.classList.add('night-mode');
            this.addStars();
        }
    }

    activatePartyMode() {
        document.body.classList.add('party-mode');
        
        // Create confetti
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createConfetti();
            }, i * 100);
        }
        
        // Show message
        this.showNotification('🎉 PARTY MODE ACTIVATED! 🎉', 'party');
        
        // Remove party mode after 10 seconds
        setTimeout(() => {
            document.body.classList.remove('party-mode');
        }, 10000);
    }

    createConfetti() {
        const confetti = document.createElement('div');
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
        const emojis = ['🎉', '🎊', '✨', '🌟', '💫'];
        
        confetti.textContent = Math.random() > 0.5 ? emojis[Math.floor(Math.random() * emojis.length)] : '●';
        confetti.style.cssText = `
            position: fixed;
            top: -10px;
            left: ${Math.random() * 100}%;
            font-size: ${Math.random() * 20 + 10}px;
            color: ${colors[Math.floor(Math.random() * colors.length)]};
            pointer-events: none;
            z-index: 1000;
            animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 5000);
    }

    addStars() {
        for (let i = 0; i < 20; i++) {
            const star = document.createElement('div');
            star.textContent = '⭐';
            star.style.cssText = `
                position: fixed;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                font-size: ${Math.random() * 10 + 5}px;
                opacity: ${Math.random() * 0.5 + 0.3};
                pointer-events: none;
                z-index: 0;
                animation: twinkle ${Math.random() * 3 + 2}s ease-in-out infinite;
            `;
            
            document.body.appendChild(star);
        }
    }

    showSecretMessage() {
        const messages = [
            "🎨 Je hebt de geheime kunstenaar gevonden!",
            "✨ Sem's geheime boodschap: Blijf creatief!",
            "🚀 Easter egg ontdekt! Je bent een echte detective!",
            "💡 Geheim: Alle beste ideeën komen tijdens het wandelen!"
        ];
        
        const message = messages[Math.floor(Math.random() * messages.length)];
        this.showNotification(message, 'secret');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${type === 'party' ? 'linear-gradient(45deg, #ff6b6b, #4ecdc4)' : 
                        type === 'secret' ? 'linear-gradient(45deg, #667eea, #764ba2)' : '#10b981'};
            color: white;
            padding: 20px 30px;
            border-radius: 15px;
            font-weight: 600;
            font-size: 1.2rem;
            z-index: 10001;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: popIn 0.5s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'popOut 0.5s ease-in forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 3000);
    }
}

// Initialize all doodle features
document.addEventListener('DOMContentLoaded', () => {
    // Add additional CSS animations
    const additionalStyles = document.createElement('style');
    additionalStyles.textContent = `
        @keyframes confettiFall {
            to {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
        
        @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes popIn {
            0% { transform: translate(-50%, -50%) scale(0); }
            100% { transform: translate(-50%, -50%) scale(1); }
        }
        
        @keyframes popOut {
            0% { transform: translate(-50%, -50%) scale(1); }
            100% { transform: translate(-50%, -50%) scale(0); }
        }
        
        .party-mode {
            animation: partyColors 0.5s infinite;
        }
        
        @keyframes partyColors {
            0% { filter: hue-rotate(0deg); }
            25% { filter: hue-rotate(90deg); }
            50% { filter: hue-rotate(180deg); }
            75% { filter: hue-rotate(270deg); }
            100% { filter: hue-rotate(360deg); }
        }
        
        .night-mode {
            filter: brightness(0.8) contrast(1.1);
        }
    `;
    document.head.appendChild(additionalStyles);
    
    // Initialize all interactive features
    new LoadingScreen();
    
    setTimeout(() => {
        new InteractiveDoodles();
        new EasterEggs();
    }, 2000);
});