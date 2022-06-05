<!--- 画像URLの変数定義 --->

[参考画像]: https://user-images.githubusercontent.com/81066421/171986878-8dd0cc16-91ad-4a0f-aa6a-dd13c42e2ed5.gif
[インフラ構成図]: https://user-images.githubusercontent.com/81066421/127653180-42854273-0623-4aa8-8bb0-219093a9b240.png
[画面遷移図]: https://user-images.githubusercontent.com/81066421/172037950-eefb966a-d3e3-441c-8701-45548e518693.png
[鍵]: https://user-images.githubusercontent.com/81066421/120003596-dd50c580-c010-11eb-9442-5542a6466dbb.png
[er図]: https://user-images.githubusercontent.com/81066421/171987979-ae8652bb-ef52-46c5-85c5-ff370a57aadb.png
[チェック]: https://user-images.githubusercontent.com/81066421/120052611-131d9a80-c061-11eb-9e86-f323d6cb2b41.png
[外部]: https://user-images.githubusercontent.com/81066421/120052614-13b63100-c061-11eb-8b16-a679f6241f26.png
[キー]: https://user-images.githubusercontent.com/81066421/120052616-144ec780-c061-11eb-9efc-0ab2224081ab.png

<!--- 本文はこちらから --->

# [QuizMaker](https://quiz-maker-simple.vercel.app/)

クイズを作成・実行できる WEB アプリケーションです。<br>
自由にクイズを作成して他ユーザーに回答してもらったり、他ユーザーが作成したクイズを回答できます。<br>
<br><br>
![参考画像][参考画像]
<br><br>

## 作成した目的

私はクイズ番組が好きなのですが、クイズを作成して共有できるアプリはあまり見たことがなかったため、自分で開発しようと思いました。<br>
シンプルなデザインで使いやすさにこだわって作りました。
<br><br>

## 使用技術

以下を使用して WEB アプリケーションを作成しました。

- フロントエンド

  - **[React](https://ja.reactjs.org/)** 18.1.0
  - **[TypeSciprt](https://www.typescriptlang.org/)** 4.7.2
  - **[MUI](https://mui.com/)** 5.8.1
  - **[React Hook Form](https://react-hook-form.com/jp/)** 7.31.3
  - **[Axios](https://axios-http.com/)** 0.27.2
  - **[ESLint](https://eslint.org/)** 8.16.0
  - **[HTML/CSS](https://developer.mozilla.org/ja/docs/Web/HTML)**

- バックエンド

  - **[Next.js](https://nextjs.org/)** 12.1.6
  - **[Prisma](https://www.prisma.io/)** 3.14.0
  - **[NextAuth.js](https://next-auth.js.org/)** 4.3.4

- インフラ

  - **[Docker](https://www.docker.com/)** 20.10.16 / **[docker-compose](https://docs.docker.jp/compose/toc.html)** 2.6.0
  - **[PostgreSQL](https://www.postgresql.jp/)** 14.3
  - **[Vercel](https://vercel.com/)**

<br><br>

## 機能一覧

実装した機能は以下の通りです。

- ユーザー登録
- パスワードログイン機能
- OAuth 認証ログイン機能
- クイズ機能
  - クイズ作成機能
  - クイズ回答機能
  - クイズ編集機能
- ダークモード切替機能

<br><br>

## 画面遷移図

画面遷移図は以下画像の通りです。<br>

> 鍵がついた黄色のエリアにあるページはログインユーザーのみ遷移できるページになります。

![画面遷移図][画面遷移図]

<br><br>

## URL 一覧

URL の一覧は以下表の通りです。  
認証欄に鍵がついている URL はログインユーザーのみアクセスできるページになります。

> ### ページの URL

| URL                                   | コンポーネント名 |   認証    | 処理                           |
| ------------------------------------- | ---------------- | :-------: | ------------------------------ |
| /                                     | TopPage          |           | トップページを表示する         |
| /dashboard/{ユーザー ID}              | Dashboard 　     |           | ダッシュボードページを表示する |
| /quiz/create                          | QuizCreate       | ![鍵][鍵] | クイズ作成開始ページを表示する |
| /quiz/{クイズ ID}                     | QuizDetail       |           | クイズ詳細ページを表示する     |
| /quiz/{クイズ ID}/edit                | QuizEdit         | ![鍵][鍵] | クイズ編集開始ページを表示する |
| /quiz/{クイズ ID}/answer              | QuizAnswer       |           | クイズ回答開始ページを表示する |
| /quiz/{クイズ ID}/grade/{グレード ID} | QuizAnswerResult |           | クイズ回答結果ページを表示する |
| /auth/signup                          | SignUp           |           | 会員登録ページを表示する       |
| /auth/signin                          | Signin           |           | ログイン画面を表示する         |

<br>

> ### API の URL

| URL                     |  メソッド  | 処理                                                                     |
| ----------------------- | :--------: | ------------------------------------------------------------------------ |
| /api/quiz/create        |    POST    | 新規クイズをテーブルに保存する                                           |
| /api/quiz/edit          |    PUT     | クイズを更新してテーブルに保存する                                       |
| /api/quiz/fileupload    |    POST    | 新規クイズの画像をアップロードする                                       |
| /api/quiz/answer        |    POST    | クイズ回答結果をテーブルに保存する                                       |
| /api/signup             |    POST    | 新規ユーザーをテーブルに保存する                                         |
| /api/auth/{...nextauth} | GET / POST | NextAuth.js の設定ファイルでサインイン機能やログインセッションなどを司る |

<br><br>

## ER 図

ER 図は以下画像の通りです。
![ER図][er図]
<br><br>

## テーブル定義

テーブル定義は以下表の通りです。
<br>

> ### User テーブル

- クイズの作成、実行などをするユーザーを管理します。

| カラム論理名           | カラム物理名  |    型     |    PRIMARY    |        UNIQUE         |       NOT NULL        | FOREIGN |
| :--------------------- | :------------ | :-------: | :-----------: | :-------------------: | :-------------------: | :-----: |
| ユーザー ID            | id            |   TEXT    | ![キー][キー] | ![チェック][チェック] | ![チェック][チェック] |         |
| ユーザー名             | name          |   TEXT    |               |                       |                       |         |
| メールアドレス         | email         |   TEXT    |               | ![チェック][チェック] |                       |         |
| パスワード             | password      |   TEXT    |               |                       |                       |         |
| メールアドレス認証済み | emailVerified | TIMESTAMP |               |                       |                       |         |
| プロファイル画像パス   | image         |   TEXT    |               |                       |                       |         |
| 作成日                 | created_at    | TIMESTAMP |               |                       |                       |         |
| 更新日                 | updated_at    | TIMESTAMP |               |                       |                       |         |

<br>

> ### Quiz テーブル

- ユーザーが作成したクイズを管理します。

| カラム論理名   | カラム物理名 |      型      |    PRIMARY    |        UNIQUE         |       NOT NULL        |           FOREIGN            |
| -------------- | ------------ | :----------: | :-----------: | :-------------------: | :-------------------: | :--------------------------: |
| クイズ ID      | id           |    SERIAL    | ![キー][キー] | ![チェック][チェック] | ![チェック][チェック] |                              |
| ユーザー ID    | userId       |     TEXT     |               |                       | ![チェック][チェック] | ![外部][外部]&nbsp;User(id)  |
| ジャンル ID    | genre_id     |   INTEGER    |               |                       | ![チェック][チェック] | ![外部][外部]&nbsp;Genre(id) |
| クイズタイトル | title        | VARCHAR(100) |               |                       | ![チェック][チェック] |                              |
| 説明文         | description  | VARCHAR(255) |               |                       | ![チェック][チェック] |                              |
| 画像名         | filename     | VARCHAR(255) |               |                       |                       |                              |
| 作成日         | createdAt    |  TIMESTAMP   |               |                       |                       |                              |
| 更新日         | updatedAt    |  TIMESTAMP   |               |                       |                       |                              |

<br>

> ### Genre テーブル

- クイズのジャンルを管理します。

| カラム論理名 | カラム物理名 |     型      |    PRIMARY    |        UNIQUE         |       NOT NULL        | FOREIGN |
| ------------ | ------------ | :---------: | :-----------: | :-------------------: | :-------------------: | :-----: |
| ジャンル ID  | id           |   SERIAL    | ![キー][キー] | ![チェック][チェック] | ![チェック][チェック] |         |
| ジャンル名   | name         | VARCHAR(20) |               | ![チェック][チェック] | ![チェック][チェック] |         |
| 作成日       | createdAt    |  TIMESTAMP  |               |                       |                       |         |
| 更新日       | updatedAt    |  TIMESTAMP  |               |                       |                       |         |

<br>

> ### Item テーブル

- クイズの設問を管理します。

| カラム論理名      | カラム物理名   |      型      |    PRIMARY    |        UNIQUE         |       NOT NULL        |           FOREIGN           |
| ----------------- | -------------- | :----------: | :-----------: | :-------------------: | :-------------------: | :-------------------------: |
| クイズアイテム ID | id             |    SERIAL    | ![キー][キー] | ![チェック][チェック] | ![チェック][チェック] |                             |
| クイズ ID         | quizId         |   INTEGER    |               |                       | ![チェック][チェック] | ![外部][外部]&nbsp;Quiz(id) |
| 質問番号          | questionNumber |  SAMLLIINT   |               |                       | ![チェック][チェック] |                             |
| 回答形式          | format         |   SMALLINT   |               |                       | ![チェック][チェック] |                             |
| 質問              | question       | VARCHAR(255) |               |                       | ![チェック][チェック] |                             |
| 答え              | answer         | VARCHAR(255) |               |                       | ![チェック][チェック] |                             |
| 選択肢 1          | choice1        | VARCHAR(255) |               |                       |                       |                             |
| 選択肢 2          | choice2        | VARCHAR(255) |               |                       |                       |                             |
| 選択肢 3          | choice3        | VARCHAR(255) |               |                       |                       |                             |
| 選択肢 4          | choice4        | VARCHAR(255) |               |                       |                       |                             |
| 作成日            | createdAt      |  TIMESTAMP   |               |                       |                       |                             |
| 更新日            | updatedAt      |  TIMESTAMP   |               |                       |                       |                             |

<br>

> ### Grade テーブル

- クイズの実行履歴を管理します。

| カラム論理名 | カラム物理名 |    型     |    PRIMARY    |        UNIQUE         |       NOT NULL        |           FOREIGN           |
| ------------ | ------------ | :-------: | :-----------: | :-------------------: | :-------------------: | :-------------------------: |
| 成績 ID      | id           |  SERIAL   | ![キー][キー] | ![チェック][チェック] | ![チェック][チェック] |                             |
| クイズ ID    | quizId       |  INTEGER  |               |                       | ![チェック][チェック] | ![外部][外部]&nbsp;QUiz(id) |
| ユーザー ID  | userId       |   TEXT    |               |                       |                       | ![外部][外部]&nbsp;User(id) |
| 正答数       | correctCount |  INTEGER  |               |                       | ![チェック][チェック] |                             |
| 作成日       | createdAt    | TIMESTAMP |               |                       |                       |                             |
| 更新日       | updatedAat   | TIMESTAMP |               |                       |                       |                             |

<br>

> ### Answer テーブル

- クイズの実行履歴の回答内容などを管理します。

| カラム論理名      | カラム物理名 |      型      |    PRIMARY    |        UNIQUE         |       NOT NULL        |           FOREIGN            |
| ----------------- | ------------ | :----------: | :-----------: | :-------------------: | :-------------------: | :--------------------------: |
| 成績回答 ID       | id           |    SERIAL    | ![キー][キー] | ![チェック][チェック] | ![チェック][チェック] |                              |
| 成績 ID           | gradeId      |   INTEGER    |               |                       | ![チェック][チェック] | ![外部][外部]&nbsp;Grade(id) |
| クイズアイテム ID | itemId       |   INTEGER    |               |                       | ![チェック][チェック] | ![外部][外部]&nbsp;Item(id)  |
| 回答実績          | answer       | VARCHAR(255) |               |                       | ![チェック][チェック] |                              |
| 正解有無          | pass         |   BOOLEAN    |               |                       | ![チェック][チェック] |                              |
| 作成日            | createdAt    |  TIMESTAMP   |               |                       |                       |                              |
| 更新日            | updatedAt    |  TIMESTAMP   |               |                       |                       |                              |

<br>
