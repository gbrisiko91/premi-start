---
titolo: "sd2snes+ LinkでSNESがオンラインに：クラウドセーブとRetroAchievementsに対応"
titolo_seo: "SNES オンライン化 sd2snes+ Link：仕組みを解説"
sommario: "sd2snes+ Linkは約10ドルのESP32ボードでスーパーファミコンをネット接続。クラウドセーブ、RetroAchievements、サテラビューに対応。必要なものを解説。"
slug: "snes-online-sd2snes-link-cloud-saves-retroachievements"
---

**sd2snes+ Link**によって、Super Nintendoがオンラインに接続できるようになる。これはフラッシュカートリッジのsd2snesと**FXPAK PRO**を小型のESP32ボード経由でインターネットにつなぐ個人プロジェクトだ。制作者は開発者の**Luan Freitas**（ludufre）で、mrehkopfによるオリジナルのsd2snesファームウェアをベースに開発を進めている。プロジェクトは11月21日にTime Extensionが取り上げたもので、現在もテスト段階にある。

発表された機能は多岐にわたる。セーブデータのクラウドバックアップ、RetroAchievements対応、サテラビューのシミュレーション、そしてベータ版ではあるがコンソール間のオンラインマルチプレイだ。

## sd2snesでSNESをオンラインで遊ぶのに必要なもの

本体だけでは足りない。sd2snes+ 3.0以降のファームウェアに更新したsd2snesまたはFXPAK PROのカートリッジに加え、カートリッジのUSBポートに接続するESP32-S3 N16R8 DevKitC-1ボードが必要になる。Time Extensionによると、このボードはオンラインショップで約10ドルで手に入るという。

ボードには一般的な5 Vの充電器で給電し（サイトでは1 Aを推奨）、自宅のWi-Fiに接続する。パソコンは不要で、ネットワーク設定はテレビ画面から直接行える。

## sd2snes+ Linkの機能

公式ページによると、テスト版にはすでにセーブデータのクラウドバックアップ（過去3世代まで、1アカウントあたり500 MB）と、RetroAchievements対応（現時点ではハードコアモードなし）が搭載されている。さらに、任天堂が日本でスーパーファミコン向けに提供していた衛星放送サービス、サテラビューのシミュレーション、インターネットラジオ、ファームウェアのアップデート機能もある。

ベータ版としては、XBand風のオンラインマルチプレイと、Game Boy向けのインターネット経由の通信機能がある。Townという機能はまだ開発中だ。クラウドは現在800ユーザーに制限されており、正式なリリース日は決まっていない。サイトでは連絡先を登録して通知を受け取ることができる。

## 止まらないSNESシーン

Super Nintendoの周辺には、次々とプロジェクトを生み出し続けるコミュニティがある。[無料の個人移植でCastlevania: Symphony of the NightをSNESに移植](/articoli/castlevania-symphony-of-the-night-snes/)したのも、このコミュニティだ。引き出しにFXPAK PROを眠らせている人には、それを取り出す十分な理由ができた。
