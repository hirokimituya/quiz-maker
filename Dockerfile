# サーバサイドにJavaScriptの実行環境として、node.jsを利用
FROM node:14.17.5

# 環境変数LANGにC.UTF8を設定。Cは最低限の英語表示を表す。
ENV LANG=C.UTF-8
# タイムゾーンを日本に設定
ENV TZ=Asia/Tokyo

# コンテナ内のワーキングディレクトリを設定
WORKDIR /app

COPY . /app
