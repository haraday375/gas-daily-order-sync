// 注文明細の更新
function syncOrderDetails() {
  // スプレッドシートAとBのIDを設定
  const ssAId = 'スプレッドシートA';
  const ssBId = 'スプレッドシートB';

  const ssA = SpreadsheetApp.openById(ssAId);
  const ssB = SpreadsheetApp.openById(ssBId);

  // 各シートを取得
  const sheetA = ssA.getSheetByName('サンプル');
  const sheetB = ssB.getSheetByName('サンプル');

  const lastRowA = sheetA.getLastRow();
  const lastRowB = sheetB.getLastRow();

  const dataA = sheetA.getRange(2, 1, lastRowA - 1, 26).getValues(); // A2:Z
  const dataB = sheetB.getRange(2, 1, lastRowB - 1, 26).getValues(); // A2:Z

  const sheetBKeys = {};
  const sheetAKeys = {};

  for (let i = 0; i < dataB.length; i++) {
    const keyB = dataB[i][19]; // キー列 （ここではT列）
    if (keyB) {
      sheetBKeys[keyB] = i;
    }
  }

  for (let i = 0; i < dataA.length; i++) {
    const keyA = dataA[i][19]; // キー列 （ここではT列）
    sheetAKeys[keyA] = true;
  }

  // 新規データは追加し、既存データは更新
  for (let i = 0; i < dataA.length; i++) {
    const keyA = dataA[i][19];
    const rowA = dataA[i];

    if (sheetBKeys.hasOwnProperty(keyA)) {
      const rowIndexB = sheetBKeys[keyA];
      let hasChanges = false;

      for (let j = 0; j < rowA.length; j++) {
        if (dataB[rowIndexB][j] !== rowA[j]) {
          dataB[rowIndexB][j] = rowA[j];
          hasChanges = true;
        }
      }

      if (hasChanges) {
        Logger.log(`更新: 行 ${rowIndexB + 2}, キー: ${keyA}`);
        sheetB.getRange(rowIndexB + 2, 1, 1, rowA.length).setValues([dataB[rowIndexB]]);
      }
    } else {
      Logger.log(`追加: キー ${keyA}`);
      sheetB.appendRow(rowA);
    }
  }

// BにあってAにないキーをキャンセル （ただしA列の日付が本日より前ならスキップ）
  const todayStr = formatDateToYMD(new Date());

  for (let keyB in sheetBKeys) {
    if (!sheetAKeys.hasOwnProperty(keyB)) {
      const rowIndexB = sheetBKeys[keyB];
      const rowDate = dataB[rowIndexB][0]; // A列

      let rowDateStr = null;
      if (rowDate instanceof Date) {
        rowDateStr = formatDateToYMD(rowDate);
      }

      // 本日より前ならスキップ
      if (rowDateStr && rowDateStr < todayStr) {
        continue;
      }

      if (dataB[rowIndexB][2] !== "キャンセル") {
        dataB[rowIndexB][2] = "キャンセル"; // C列
        Logger.log(`キャンセル設定: 行 ${rowIndexB + 2}, キー: ${keyB}`);
        sheetB.getRange(rowIndexB + 2, 1, 1, dataB[rowIndexB].length).setValues([dataB[rowIndexB]]);
      }
    }
  }

  Logger.log("注文明細を更新しました");
}

// 日付を yyyy-MM-dd に整形する関数 （正確な日付比較のため）
function formatDateToYMD(date) {
  return Utilities.formatDate(new Date(date), "Asia/Tokyo", "yyyy-MM-dd");
}
