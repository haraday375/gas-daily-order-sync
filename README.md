# gas-daily-order-sync

Google Apps Script for daily synchronization of order details between two Google Sheets.

---

## 概要

このスクリプトは、**注文データを管理する2つのスプレッドシート間でデータを日次同期**することを目的としています。  
差分更新・新規行追加・未更新行のキャンセル処理など、実務で必要となるロジックを自動化しています。

---

## 主な機能

- キー列（T列）をもとにA→Bのデータ差分をチェック
- Aに存在しBに存在しないデータを新規追加
- Bに存在しAに存在しないデータを「キャンセル」ステータスに自動更新（ただし過去日を除外）
- スプレッドシート間の同期を自動化し、転記ミスや抜け漏れを防止

---

## 処理の構成

1. **スプレッドシートA・Bの読み込み**
   - 各シートの「サンプル」タブを対象
2. **A→B の差分を検出**
   - T列のユニークキーをもとに比較
3. **差分があればBのデータを更新**
4. **AにないBのデータはキャンセル判定**
   - A列（発送日）を基準に、未来日ならキャンセル
5. **ログ出力**
   - 処理ログを Logger に記録

---

## スプレッドシート構成（例）

| 列 | 内容         | 備考             |
|----|--------------|------------------|
| A  | 発送日       | 日付型、キャンセル除外条件に使用 |
| C  | ステータス   | AにないBのデータはキャンセル判定 |
| T  | 注文キーID   | 一意のキー（比較基準） |

---

## 応用例

- 倉庫の出荷指示シートと実績シートの自動照合
- 外部ツール連携データの自動反映（API経由でGAS起動も可能）
- 入出庫履歴、予約データの管理・キャンセル自動化

---

## 実行タイミング

Google Apps Script のトリガー機能を使って、以下のような自動化が可能です：

- 毎朝決まった時刻に同期
- 編集時トリガーによる即時反映
- 手動実行（テストや例外処理時）

---

## 使用上の注意

- 同期対象のシート名・列数・キー列は必要に応じて修正してください
- 「キャンセル」ステータスの判定ロジックも業務に応じて調整可能です
- 大量データ（数千行以上）の場合はデータの追加処理と更新処理を分割することを推奨します

---

## 作者について

このスクリプトは、日々の業務自動化やDXの一環として、実務から得られた課題とニーズに基づいて作成されました。  
