// ============================================
// CARROSSEL DE FOTOS - Sistema Seguro
// ============================================

class Carousel {
    constructor(container) {
        if (!container) return;
        
        this.container = container;
        this.slides = container.querySelectorAll('.carousel-slide');
        this.prevBtn = container.querySelector('.prev-btn');
        this.nextBtn = container.querySelector('.next-btn');
        this.indicators = container.querySelectorAll('.indicator');
        this.currentSlide = 0;
        this.slideInterval = null;
        this.autoPlayDelay = 5000;
        this.isPaused = false;
        
        this.init();
    }
    
    init() {
        // Verificar se existem elementos necessários
        if (!this.slides.length || !this.prevBtn || !this.nextBtn) return;
        
        // Configurar eventos dos botões
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Configurar eventos dos indicadores
        if (this.indicators.length) {
            this.indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => this.goToSlide(index));
            });
        }
        
        // Pausar quando o mouse estiver sobre o carrossel
        this.container.addEventListener('mouseenter', () => {
            this.pauseAutoPlay();
        });
        
        // Retomar quando o mouse sair
        this.container.addEventListener('mouseleave', () => {
            this.resumeAutoPlay();
        });
        
        // Configurar evento de toque para dispositivos móveis
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            this.pauseAutoPlay();
        });
        
        this.container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
            setTimeout(() => this.resumeAutoPlay(), 3000);
        });
        
        // Iniciar rotação automática
        this.startAutoPlay();
        
        // Atualizar indicadores iniciais
        this.updateIndicators();
    }
    
    showSlide(index) {
        // Verificar limites
        if (index >= this.slides.length) {
            this.currentSlide = 0;
        } else if (index < 0) {
            this.currentSlide = this.slides.length - 1;
        } else {
            this.currentSlide = index;
        }
        
        // Mover os slides
        const slidesContainer = this.container.querySelector('.carousel-slides');
        if (slidesContainer) {
            slidesContainer.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        }
        
        // Atualizar indicadores
        this.updateIndicators();
    }
    
    nextSlide() {
        this.showSlide(this.currentSlide + 1);
        this.resetAutoPlay();
    }
    
    prevSlide() {
        this.showSlide(this.currentSlide - 1);
        this.resetAutoPlay();
    }
    
    goToSlide(index) {
        this.showSlide(index);
        this.resetAutoPlay();
    }
    
    updateIndicators() {
        if (!this.indicators.length) return;
        
        this.indicators.forEach((indicator, index) => {
            if (index === this.currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        
        if (startX - endX > swipeThreshold) {
            this.nextSlide();
        } else if (endX - startX > swipeThreshold) {
            this.prevSlide();
        }
    }
    
    startAutoPlay() {
        if (!this.slideInterval) {
            this.slideInterval = setInterval(() => {
                if (!this.isPaused) {
                    this.nextSlide();
                }
            }, this.autoPlayDelay);
        }
    }
    
    pauseAutoPlay() {
        this.isPaused = true;
    }
    
    resumeAutoPlay() {
        this.isPaused = false;
    }
    
    resetAutoPlay() {
        this.pauseAutoPlay();
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
        
        // Retomar após 3 segundos de inatividade
        setTimeout(() => {
            this.resumeAutoPlay();
            this.startAutoPlay();
        }, 3000);
    }
}

// ============================================
// FUNCIONALIDADES GERAIS DO SITE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Site carregado - Inicializando funcionalidades...');
    
    // 1. Inicializar o carrossel (se existir)
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        console.log('Carrossel encontrado - inicializando...');
        new Carousel(carouselContainer);
    } else {
        console.log('Carrossel não encontrado - continuando...');
    }
    
    // 2. Menu responsivo
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        console.log('Menu responsivo - configurando...');
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
        
        // Fechar menu ao clicar em um link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
            });
        });
    }
    
    // 3. Atualizar ano atual no footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    
    // 4. Suavizar rolagem para âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 5. Adicionar classe à navbar ao rolar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                navbar.style.padding = '15px 5%';
            } else {
                navbar.style.boxShadow = 'none';
                navbar.style.padding = '20px 5%';
            }
        }
    });
    
    // 6. Adicionar animação simples aos cards quando aparecem na tela
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    document.querySelectorAll('.servico-card, .qualidade, .galeria-item, .contato-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
    
    // 7. Efeito de digitação no título do herói
    const heroTitle = document.querySelector('.hero h2');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        // Inicia a animação quando a página carrega
        setTimeout(typeWriter, 500);
    }
    
    // 8. Feedback visual ao clicar nos botões
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Cria efeito de clique
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
    
    // 9. Mostrar/ocultar botão do WhatsApp baseado na rolagem
    let lastScrollTop = 0;
    const floatBtn = document.querySelector('.float-whatsapp');
    
    if (floatBtn) {
        window.addEventListener('scroll', function() {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop) {
                // Rolando para baixo - oculta o botão
                floatBtn.style.transform = 'translateY(100px)';
            } else {
                // Rolando para cima - mostra o botão
                floatBtn.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    console.log('Todas as funcionalidades inicializadas com sucesso!');
});