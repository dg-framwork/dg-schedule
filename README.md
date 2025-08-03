# DG-Schedule

DG-Schedule is a simple schedule management resource for FiveM, allowing for the in-game display and management of schedules through a user-friendly interface.

DG-ScheduleはFiveM用のシンプルなスケジュール管理リソースで、使いやすいインターフェースを通じてゲーム内でスケジュールの表示と管理ができます。

## Features

- **On-Screen Display:** Shows current schedules in the top-left corner of the screen for all players.
- **Real-time Updates:** Schedule changes (creation, editing, deletion) are instantly reflected for all clients.
- **Management UI:** A clean interface for creating, editing, and deleting schedules.
- **Data Persistence:** Schedules are saved in a `schedules.json` file, ensuring they persist through server restarts.

## 機能

- **画面表示:** 現在のスケジュールを全プレイヤーの画面左上に表示します。
- **リアルタイム更新:** スケジュールの変更（作成、編集、削除）は、即座に全クライアントに反映されます。
- **管理UI:** スケジュールを作成、編集、削除するためのクリーンなインターフェース。
- **データ永続化:** スケジュールは`schedules.json`ファイルに保存され、サーバーが再起動してもデータが保持されます。

## Installation

1.  Place the `dg-schedule` directory into your server's `resources` folder.
2.  Add `ensure dg-schedule` to your `server.cfg` file.
3.  Restart your FiveM server.

## インストール

1.  `dg-schedule`ディレクトリをサーバーの`resources`フォルダに配置します。
2.  `server.cfg`ファイルに`ensure dg-schedule`を追加します。
3.  FiveMサーバーを再起動します。

## Usage

### Commands

-   `DGSC:NUI:Manage:Show`
    -   Opens the schedule management interface.
    -   スケジュール管理インターフェースを開きます。

-   `DGSC:NUI:Manage:Hide`
    -   Closes the schedule management interface. (You can also press the `Esc` key).
    -   スケジュール管理インターフェースを閉じます。（`Esc`キーでも閉じることができます）。

### How to Manage Schedules

1.  Use the `DGSC:NUI:Manage:Show` command to open the management UI.
2.  **Create:** Click the "新しいスケジュールを登録" (Register New Schedule) button.
3.  **Edit:** Click the "編集" (Edit) button on an existing schedule.
4.  **Delete:** Click the "削除" (Delete) button on an existing schedule.
5.  Changes are saved automatically and broadcast to all players.

### スケジュール管理方法

1.  `DGSC:NUI:Manage:Show`コマンドを使用して管理UIを開きます。
2.  **作成:** 「新しいスケジュールを登録」ボタンをクリックします。
3.  **編集:** 既存のスケジュールの「編集」ボタンをクリックします。
4.  **削除:** 既存のスケジュールの「削除」ボタンをクリックします。
5.  変更は自動的に保存され、全プレイヤーに通知されます。
