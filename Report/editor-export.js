function exportProductionHTML() {
    const title = document.getElementById("meta-title").value || "無題のレポート";
    const date = document.getElementById("meta-date").value || "2026.11.01";
    const category = document.getElementById("meta-cat").value || "Report";
    const filename = document.getElementById("meta-filename").value || "diary-001.html";

    // 本番用のクリーンな画像パス（images/diary/...）を使って本文HTMLを生成
    const bodyContent = window.buildBodyHTML(false);

    const fullHTML = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - 舞色 (∑ay][) Diary & Report</title>
    <link rel="icon" href="images/favicon.ico" type="image/x-icon">
    <link rel="shortcut icon" href="images/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="diary-style.css">
</head>
<body>

    <!-- 奥のレイヤー：薄緑のぼかしインク -->
    <div id="bg-ink">
        <div class="ink-blob ink-1"></div>
        <div class="ink-blob ink-2"></div>
        <div class="ink-blob ink-3"></div>
        <div class="ink-blob ink-4"></div>
    </div>

    <!-- 手前のレイヤー：薄緑のアウトライン -->
    <div id="bg-outline">
        <div class="outline-blob outline-1"></div>
        <div class="outline-blob outline-2"></div>
        <div class="outline-blob outline-3"></div>
    </div>

    <header class="site-header">
        <div class="header-inner">
            <a href="diary-index.html" class="back-link">← Back to Diary List</a>
            <a href="index.html" class="header-logo"><span class="sigma">∑</span>ay][</a>
        </div>
    </header>

    <main class="diary-container">
        <article class="diary-glass-panel">
            <div class="diary-header">
                <span class="diary-category">${category}</span>
                <h1 class="diary-title">${title}</h1>
                <div class="diary-date">${date}</div>
            </div>

            <div class="diary-body clearfix">
${bodyContent}
            </div>
        </article>
    </main>

    <footer>
        <p>&copy; 2026 舞色 - ∑ay][. All rights reserved.</p>
    </footer>

</body>
</html>`;

    // ファイルとしてブラウザから自動ダウンロードさせる
    const blob = new Blob([fullHTML], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.endsWith(".html") ? filename : filename + ".html";
    a.click();
    URL.revokeObjectURL(url);
}