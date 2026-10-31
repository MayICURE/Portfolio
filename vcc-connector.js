(function () {
  const vpmInput = document.getElementById('vpm-url-input');
  const addVccBtn = document.getElementById('btn-add-vcc');
  const copyVpmBtn = document.getElementById('btn-copy-vpm');

  // 現在のドメインに合わせて自動でvpm.jsonのURLをセットする場合
  const currentOrigin = window.location.origin;
  if (currentOrigin && currentOrigin !== 'null' && !currentOrigin.startsWith('file')) {
    vpmInput.value = `${currentOrigin}/vpm.json`;
  }

  addVccBtn.addEventListener('click', () => {
    const repoUrl = encodeURIComponent(vpmInput.value.trim());
    const vccSchemeUrl = `vcc://vpm/addRepo?url=${repoUrl}`;
    window.location.href = vccSchemeUrl;
  });

  copyVpmBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(vpmInput.value.trim());
      const originalText = copyVpmBtn.textContent;
      copyVpmBtn.textContent = 'コピー完了!';
      setTimeout(() => { copyVpmBtn.textContent = originalText; }, 1500);
    } catch (err) {
      vpmInput.select();
      document.execCommand('copy');
    }
  });
})();