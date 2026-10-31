window.GimmickAction = (function () {
  const modal = document.getElementById('code-modal');
  const modalTitle = document.getElementById('modal-filename');
  const modalCode = document.getElementById('modal-code-body');
  const closeBtn = document.getElementById('btn-close-modal');

  closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  async function previewCode(filePath, fileName) {
    try {
      modalTitle.textContent = fileName;
      modalCode.textContent = '読み込み中...';
      modal.classList.remove('hidden');

      const response = await fetch(filePath);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      modalCode.textContent = text;
    } catch (err) {
      modalCode.textContent = `ファイルの読み込みに失敗しました: ${err.message}`;
    }
  }

  async function downloadSingleFile(filePath, fileName) {
    const response = await fetch(filePath);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function downloadFileGroup(files) {
    for (let i = 0; i < files.length; i++) {
      await downloadSingleFile(files[i].path, files[i].name);
      // ブラウザの複数同時DLブロックを回避するための微小ウェイト
      await new Promise(r => setTimeout(r, 250));
    }
  }

  return {
    previewCode,
    downloadSingleFile,
    downloadFileGroup
  };
})();