// 記事内の全ブロックを保持する配列
window.diaryBlocks = [
    { type: "heading", text: "イベントを終えて" },
    { type: "text", text: "ここに本文を入力します。\n左側のパネルから、見出し・文章・画像を好きな順番でいくつでも差し込むことができます。" },
    { type: "image", src: "images/diary/sample1.png", previewUrl: "https://placehold.co/800x450/d8f2c9/2ea87c?text=Sample+Photo", caption: "当日の様子", layout: "img-full" }
];

// ブロックを追加する関数
function addBlock(type) {
    if (type === "heading") {
        window.diaryBlocks.push({ type: "heading", text: "新しい見出し" });
    } else if (type === "text") {
        window.diaryBlocks.push({ type: "text", text: "ここに文章を入力してください。" });
    } else if (type === "image") {
        window.diaryBlocks.push({
            type: "image",
            src: "images/diary/photo.png",
            previewUrl: "",
            caption: "",
            layout: "img-full"
        });
    } else if (type === "image2") {
        window.diaryBlocks.push({
            type: "image2",
            src1: "images/diary/photo1.png", previewUrl1: "", cap1: "",
            src2: "images/diary/photo2.png", previewUrl2: "", cap2: ""
        });
    }
    renderEditorBlocks();
    renderPreview();
}

// ブロックの順番を上下に入れ替える
function moveBlock(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= window.diaryBlocks.length) return;
    const temp = window.diaryBlocks[index];
    window.diaryBlocks[index] = window.diaryBlocks[target];
    window.diaryBlocks[target] = temp;
    renderEditorBlocks();
    renderPreview();
}

// ブロックを削除する
function removeBlock(index) {
    window.diaryBlocks.splice(index, 1);
    renderEditorBlocks();
    renderPreview();
}

// PC内の画像ファイルを選択した際にプレビュー表示＆ファイル名を自動取得する
function handleFileSelect(index, fileInput, keyPrefix = "") {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        if (keyPrefix === "") {
            window.diaryBlocks[index].previewUrl = e.target.result;
            window.diaryBlocks[index].src = "images/diary/" + file.name;
        } else {
            window.diaryBlocks[index][`previewUrl${keyPrefix}`] = e.target.result;
            window.diaryBlocks[index][`src${keyPrefix}`] = "images/diary/" + file.name;
        }
        renderEditorBlocks();
        renderPreview();
    };
    reader.readAsDataURL(file);
}

// 左側の編集パネルを描画する
function renderEditorBlocks() {
    const list = document.getElementById("block-list");
    list.innerHTML = "";

    window.diaryBlocks.forEach((block, i) => {
        const item = document.createElement("div");
        item.className = "block-item";

        let label = block.type === "heading" ? "見出し" : block.type === "text" ? "本文テキスト" : block.type === "image" ? "画像（単体・回り込み）" : "画像（2枚横並び）";

        let innerHTML = `
            <div class="block-header">
                <span>#${i + 1} ${label}</span>
                <div class="block-controls">
                    <button type="button" onclick="moveBlock(${i}, -1)">↑</button>
                    <button type="button" onclick="moveBlock(${i}, 1)">↓</button>
                    <button type="button" class="btn-del" onclick="removeBlock(${i})">削除</button>
                </div>
            </div>
        `;

        if (block.type === "heading") {
            innerHTML += `<input type="text" value="${block.text}" oninput="window.diaryBlocks[${i}].text = this.value; renderPreview();">`;
        } else if (block.type === "text") {
            innerHTML += `<textarea oninput="window.diaryBlocks[${i}].text = this.value; renderPreview();">${block.text}</textarea>`;
        } else if (block.type === "image") {
            innerHTML += `
                <label style="font-size:0.75rem;">配置スタイル：</label>
                <select onchange="window.diaryBlocks[${i}].layout = this.value; renderPreview();">
                    <option value="img-full" ${block.layout === "img-full" ? "selected" : ""}>大サイズ（横幅いっぱい）</option>
                    <option value="img-center" ${block.layout === "img-center" ? "selected" : ""}>中サイズ（中央配置）</option>
                    <option value="img-float-left" ${block.layout === "img-float-left" ? "selected" : ""}>左寄せ（右に文章を回り込ませる）</option>
                    <option value="img-float-right" ${block.layout === "img-float-right" ? "selected" : ""}>右寄せ（左に文章を回り込ませる）</option>
                </select>
                <label style="font-size:0.75rem;">画像ファイル選択（またはパス直接入力）：</label>
                <input type="file" accept="image/*" onchange="handleFileSelect(${i}, this)">
                <input type="text" value="${block.src}" placeholder="images/diary/xxx.png" oninput="window.diaryBlocks[${i}].src = this.value; renderPreview();">
                <input type="text" value="${block.caption}" placeholder="キャプション（画像の説明・省略可）" oninput="window.diaryBlocks[${i}].caption = this.value; renderPreview();">
            `;
        } else if (block.type === "image2") {
            innerHTML += `
                <label style="font-size:0.75rem;">左の画像：</label>
                <input type="file" accept="image/*" onchange="handleFileSelect(${i}, this, '1')">
                <input type="text" value="${block.src1}" oninput="window.diaryBlocks[${i}].src1 = this.value; renderPreview();">
                <input type="text" value="${block.cap1}" placeholder="左のキャプション" oninput="window.diaryBlocks[${i}].cap1 = this.value; renderPreview();">
                <label style="font-size:0.75rem;">右の画像：</label>
                <input type="file" accept="image/*" onchange="handleFileSelect(${i}, this, '2')">
                <input type="text" value="${block.src2}" oninput="window.diaryBlocks[${i}].src2 = this.value; renderPreview();">
                <input type="text" value="${block.cap2}" placeholder="右のキャプション" oninput="window.diaryBlocks[${i}].cap2 = this.value; renderPreview();">
            `;
        }

        item.innerHTML = innerHTML;
        list.appendChild(item);
    });
}

// ブロック配列から記事本文のHTML組み立てを行う（usePreviewUrlがtrueならローカル選択画像を表示）
window.buildBodyHTML = function(usePreviewUrl = true) {
    return window.diaryBlocks.map(b => {
        if (b.type === "heading") {
            return `            <h3>${b.text}</h3>`;
        } else if (b.type === "text") {
            return `            <p>${b.text}</p>`;
        } else if (b.type === "image") {
            const imgSrc = (usePreviewUrl && b.previewUrl) ? b.previewUrl : b.src;
            const cap = b.caption ? `\n                <figcaption class="diary-caption">${b.caption}</figcaption>` : "";
            return `            <figure class="diary-figure ${b.layout}">\n                <img src="${imgSrc}" alt="${b.caption}">` + cap + `\n            </figure>`;
        } else if (b.type === "image2") {
            const img1 = (usePreviewUrl && b.previewUrl1) ? b.previewUrl1 : b.src1;
            const img2 = (usePreviewUrl && b.previewUrl2) ? b.previewUrl2 : b.src2;
            const c1 = b.cap1 ? `<figcaption class="diary-caption">${b.cap1}</figcaption>` : "";
            const c2 = b.cap2 ? `<figcaption class="diary-caption">${b.cap2}</figcaption>` : "";
            return `            <div class="img-grid-2">
                <figure class="diary-figure"><img src="${img1}" alt="">${c1}</figure>
                <figure class="diary-figure"><img src="${img2}" alt="">${c2}</figure>
            </div>`;
        }
    }).join("\n\n");
};

// 右側のプレビューを更新する
function renderPreview() {
    document.getElementById("prev-title").textContent = document.getElementById("meta-title").value;
    document.getElementById("prev-date").textContent = document.getElementById("meta-date").value;
    document.getElementById("prev-cat").textContent = document.getElementById("meta-cat").value;
    document.getElementById("prev-body").innerHTML = window.buildBodyHTML(true);
}

document.addEventListener("DOMContentLoaded", () => {
    renderEditorBlocks();
    renderPreview();
});