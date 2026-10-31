document.addEventListener('DOMContentLoaded', () => {
const canvas = document.getElementById('atlasCanvas');
const inputText = document.getElementById('inputText');
const fontFamily = document.getElementById('fontFamily');
const gridCount = document.getElementById('gridCount');
const texSize = document.getElementById('texSize');
const fontScale = document.getElementById('fontScale');
const bgMode = document.getElementById('bgMode');
const showGuide = document.getElementById('showGuide');
const statsInfo = document.getElementById('statsInfo');
const downloadBtn = document.getElementById('downloadBtn');

function getOptions(includeGuide = true) {
    return {
    text: inputText.value,
    fontFamily: fontFamily.value,
    gridCount: parseInt(gridCount.value, 10) || 16,
    texSize: parseInt(texSize.value, 10) || 2048,
    fontScale: parseFloat(fontScale.value) || 78,
    bgMode: bgMode.value,
    showGuide: includeGuide ? showGuide.checked : false
    };
}

function updatePreview() {
    const res = AtlasRenderer.render(canvas, getOptions(true));
    statsInfo.innerHTML = `現在の文字数: <b>${res.totalChars}</b> 文字 / 最大格納数: <b>${res.maxCapacity}</b> マス<br>` +
                        `※Unityマテリアルの <b>_AtlasGrid</b> に <b>${gridCount.value}</b>、<b>_TotalTextLen</b> に <b>${res.totalChars}</b> を設定してください。`;
}

  // 入力変更時にリアルタイム再描画
[inputText, fontFamily, gridCount, texSize, fontScale, bgMode, showGuide].forEach(el => {
    el.addEventListener('input', updatePreview);
    el.addEventListener('change', updatePreview);
});

  // Webフォントのロード完了時にも再描画
document.fonts.ready.then(updatePreview);

  // ダウンロード時はガイド線を一時的に消してクリーンなPNGを出力
downloadBtn.addEventListener('click', () => {
    AtlasRenderer.render(canvas, getOptions(false));
    canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MazeTextAtlas.png';
    a.click();
    URL.revokeObjectURL(url);
      // プレビュー表示を元に戻す
    updatePreview();
    }, 'image/png');
});
});