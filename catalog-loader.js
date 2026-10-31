(function () {
  const listContainer = document.getElementById('gimmick-list');
  const filterBtns = document.querySelectorAll('.filter-btn');

  // サーバー上の gimmicks.json から読み込む想定（フォールバック用の初期データ付き）
  const fallbackCatalog = [
    {
      id: "com.mayi.pedestal-hologram",
      title: "展示台ホログラムギミック",
      category: "Set",
      version: "1.0.0",
      description: "プレイヤーが近づくとホログラムシェーダーの輝度とリング回転速度が変化する展示台ギミック一式です。",
      files: [
        { name: "GimmickPedestalController.cs", path: "files/GimmickPedestalController.cs" },
        { name: "GimmickPedestalHologram.shader", path: "files/GimmickPedestalHologram.shader" }
      ]
    }
  ];

  let catalogData = [];

  async function loadCatalog() {
    try {
      const res = await fetch('gimmicks.json');
      if (!res.ok) throw new Error('Using fallback');
      catalogData = await res.json();
    } catch {
      catalogData = fallbackCatalog;
    }
    renderCards('all');
  }

  function renderCards(categoryFilter) {
    listContainer.innerHTML = '';
    const filtered = catalogData.filter(item =>
      categoryFilter === 'all' || item.category === categoryFilter
    );

    filtered.forEach(item => {
      const card = document.createElement('article');
      card.className = 'gimmick-card';

      const fileListHtml = item.files.map((f, idx) => `
        <li class="file-item">
          <span>${f.name}</span>
          <div>
            <button class="sub-btn btn-preview" data-path="${f.path}" data-name="${f.name}">閲覧</button>
            <button class="sub-btn btn-dl-one" data-path="${f.path}" data-name="${f.name}">DL</button>
          </div>
        </li>
      `).join('');

      card.innerHTML = `
        <div>
          <span class="badge">${item.category} / v${item.version}</span>
          <h2>${item.title}</h2>
          <p style="color:var(--text-muted); font-size:0.9rem; margin-top:0.4rem;">${item.description}</p>
          <ul class="file-list">${fileListHtml}</ul>
        </div>
        <div class="card-actions">
          <button class="dl-all-btn" data-id="${item.id}">スクリプト群を一括DL (${item.files.length} files)</button>
        </div>
      `;

      // イベント登録
      card.querySelectorAll('.btn-preview').forEach(btn => {
        btn.addEventListener('click', () => {
          window.GimmickAction.previewCode(btn.dataset.path, btn.dataset.name);
        });
      });

      card.querySelectorAll('.btn-dl-one').forEach(btn => {
        btn.addEventListener('click', () => {
          window.GimmickAction.downloadSingleFile(btn.dataset.path, btn.dataset.name);
        });
      });

      card.querySelector('.dl-all-btn').addEventListener('click', () => {
        window.GimmickAction.downloadFileGroup(item.files);
      });

      listContainer.appendChild(card);
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCards(btn.dataset.category);
    });
  });

  loadCatalog();
})();