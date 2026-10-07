document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. ローディング演出の制御 ---
    const loaderWrapper = document.getElementById('loader-text-wrapper'); // 変更：文字全体を包むラッパーを取得
    const loader = document.getElementById('loader');
    const ripples = document.querySelectorAll('.ripple');
    const ripplesContainer = document.getElementById('loader-ripples');
    let hasStarted = false;

    // トップページ（ローディング画面がある場合）の処理
    if (loaderWrapper && loader) {
        const hasVisited = sessionStorage.getItem('visited');

        if (hasVisited) {
            // 訪問済みの場合はすぐ表示
            loader.style.display = 'none';
            document.body.classList.remove('is-loading');
            startSlideshow();
        } else {
            // 初回訪問時：クリックでインク演出スタート
            loaderWrapper.addEventListener('click', function() {
                if (hasStarted) return;
                hasStarted = true;
                sessionStorage.setItem('visited', 'true');

                // インクを順番に広げる
                ripples.forEach(r => r.classList.add('active'));
                
                // 2秒後：ぐるぐるかき混ぜるタイミングでブラー（ぼかし）をさらに強める
                setTimeout(() => { ripplesContainer.classList.add('stir'); }, 2000);
                
                // 2.2秒後：文字がインクに溶けるようにフェードアウト
                setTimeout(() => { loaderWrapper.classList.add('fade-out'); }, 2200);

                // 6秒後：全体が白くなった後、ローダーを消してスライドショー開始
                setTimeout(() => {
                    loader.classList.add('hidden');
                    document.body.classList.remove('is-loading');
                    startSlideshow(); 
                }, 6000); 
            });
        }
    } else {
        // 詳細ページなどの場合
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
