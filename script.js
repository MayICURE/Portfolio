document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. ローディング演出の制御 ---
    const loaderWrapper = document.getElementById('loader-text-wrapper');
    const loader = document.getElementById('loader');
    const ripples = document.querySelectorAll('.ripple');
    let hasStarted = false;

    if (loaderWrapper && loader) {
        const hasVisited = sessionStorage.getItem('visited');

        if (hasVisited) {
            // 訪問済みの場合はローディング画面をスキップしてすぐ表示
            loader.style.display = 'none';
            document.body.classList.remove('is-loading');
            startSlideshow();
        } else {
            // 初回訪問時：クリックでインク演出スタート
            loaderWrapper.addEventListener('click', function() {
                if (hasStarted) return;
                hasStarted = true;
                sessionStorage.setItem('visited', 'true');

                // インクを順番に広げる（CSSのディレイに依存）
                ripples.forEach(r => r.classList.add('active'));
                
                // 2.5秒後：テキストがインクに溶け消える
                setTimeout(() => {
                    loaderWrapper.classList.add('fade-out');
                }, 2500);

                // 6秒後：最後の白インクが画面を覆い尽くしたタイミングで本編へ切り替え
                setTimeout(() => {
                    loader.classList.add('hidden');
                    document.body.classList.remove('is-loading');
                    startSlideshow(); 
                }, 6000);
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
        const slideInterval = 3500; 

        if(slides.length === 0) return;
        
        slides[0].classList.add('active'); 

        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, slideInterval);
    }
});
