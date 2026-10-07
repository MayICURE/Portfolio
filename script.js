document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. ローディング演出の制御 ---
    const loaderText = document.getElementById('loader-text');
    const loader = document.getElementById('loader');
    const ripples = document.querySelectorAll('.ripple');
    let hasStarted = false;

    // loaderTextが存在する（トップページ）場合の処理
    if (loaderText && loader) {
        // セッションストレージで訪問済みかチェック
        const hasVisited = sessionStorage.getItem('visited');

        if (hasVisited) {
            // 訪問済みの場合はすぐ表示
            loader.style.display = 'none';
            document.body.classList.remove('is-loading');
            startSlideshow();
        } else {
            // 初回訪問時はクリックを待つ
            loaderText.addEventListener('click', function() {
                if (hasStarted) return;
                hasStarted = true;
                sessionStorage.setItem('visited', 'true');

                ripples.forEach(r => r.classList.add('active'));
                
                setTimeout(() => { loaderText.classList.add('fade-out'); }, 2800);

                setTimeout(() => {
                    loader.classList.add('hidden');
                    document.body.classList.remove('is-loading');
                    startSlideshow(); 
                }, 4500);
            });
        }
    } else {
        // ローディング画面がないページ（詳細ページなど）の場合
        document.body.classList.remove('is-loading');
        startSlideshow();
    }

    // --- 2. スライドショーの制御 ---
    function startSlideshow() {
        const slides = document.querySelectorAll('.slide-video');
        let currentSlide = 0;
        const slideInterval = 5000; 

        if(slides.length === 0) return;
        
        slides[0].classList.add('active'); 

        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, slideInterval);
    }
});
