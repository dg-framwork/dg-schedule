fx_version 'cerulean'
game 'gta5'
author 'DOGON<dogon309.dev@gmail.com>'
description '[DGSC]サーバー内でスケジュールを表示するリソース'
version '0.1.0'

client_scripts {
    'client.lua'
}

server_scripts {
    'server.lua'
}

ui_page 'ui/dist/index.html'

files {
    'ui/dist/index.html',
    'ui/dist/assets/*.*'
}

lua54 'yes'