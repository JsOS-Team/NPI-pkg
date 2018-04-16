# NPI package registry / Регистр пакетов NPI

JsOS/NPI (No Problem Installer) - менеджер приложений для JsOS, улучшенный appman.

`#TODO`

## Как добавить свое приложение

Форкните репозиторий кнопкой `Fork`.

Склонируйте ваш форк NPI-pkg:

```bash
$ git clone https://github.com/<author>/NPI-pkg
$ cd NPI-pkg
```

Если у приложения есть свой репозиторий на GitHub, добавьте ссылку:

```bash
$ mkdir packages/<name>
$ echo "https://github.com/<author>/<name>" >packages/<name>/module
```

Если репозитория нет, скопируйте папку:

```bash
$ cp -r ../my_package packages/<name>
```

Отправьте изменения:

```bash
$ git commit -m "Package <name>"
$ git push
```

Создайте PR на https://github.com/JsOS-Team>/NPI-pkg/pulls, указав ваш форк репозитория.