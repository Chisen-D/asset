function addAsset(name = "", ratio = "") {
  let assetContainer = document.getElementById("assets");
  let div = document.createElement("div");
  div.classList.add("asset-group");
  div.innerHTML = `
        <input type="text" placeholder="資産名" class="asset-name" value="${name}">
        <input type="number" placeholder="割合%" class="asset-ratio" min="0" max="100" value="${ratio}">
    `;
  assetContainer.appendChild(div);
}

function saveAssets() {
  let assetNames = document.querySelectorAll(".asset-name");
  let assetRatios = document.querySelectorAll(".asset-ratio");
  let assets = [];

  assetNames.forEach((input, index) => {
    assets.push({ name: input.value, ratio: assetRatios[index].value });
  });

  localStorage.setItem("savedAssets", JSON.stringify(assets));
  alert("資産情報を保存しました。");
}

function loadAssets() {
  let assets = JSON.parse(localStorage.getItem("savedAssets")) || [];
  document.getElementById("assets").innerHTML = "";
  assets.forEach((asset) => addAsset(asset.name, asset.ratio));
}

function calculateWithdrawal1() {
  let currentAsset = parseFloat(document.getElementById("currentAsset1").value);
  let baseAsset = parseFloat(document.getElementById("baseAsset1").value);
  if (isNaN(currentAsset) || isNaN(baseAsset)) {
    alert("数値を入力してください。");
    return;
  }
  let withdrawal = (currentAsset - baseAsset) / 4;
  withdrawal = withdrawal > 0 ? withdrawal : 0;
  distributeWithdrawal(withdrawal, "result1");
}

function calculateWithdrawal2() {
  let currentAsset = parseFloat(document.getElementById("currentAsset2").value);
  let baseAsset = parseFloat(document.getElementById("baseAsset2").value);
  let month = parseInt(document.getElementById("month").value);
  if (isNaN(currentAsset) || isNaN(baseAsset)) {
    alert("数値を入力してください。");
    return;
  }
  let divisor = month === 3 ? 4 : month === 6 ? 3 : month === 9 ? 2 : 1;
  let withdrawal = (currentAsset - baseAsset) / divisor;
  withdrawal = withdrawal > 0 ? withdrawal : 0;
  distributeWithdrawal(withdrawal, "result2");
}

function distributeWithdrawal(totalWithdrawal, resultId) {
  let assetNames = document.querySelectorAll(".asset-name");
  let assetRatios = document.querySelectorAll(".asset-ratio");
  let resultText = `総取り崩し額: ${totalWithdrawal.toFixed(2)} 円\n`;

  let totalRatio = 0;
  assetRatios.forEach((input) => (totalRatio += parseFloat(input.value) || 0));

  if (totalRatio !== 100) {
    alert("資産割合の合計は100%である必要があります。");
    return;
  }

  assetNames.forEach((input, index) => {
    let name = input.value || `資産${index + 1}`;
    let ratio = parseFloat(assetRatios[index].value) / 100;
    let allocation = totalWithdrawal * ratio;
    resultText += `${name}: ${allocation.toFixed(2)} 円\n`;
  });

  document.getElementById(resultId).innerText = resultText;
}
