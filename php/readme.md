# Installation

1. Installer laragon via scoop ```scoop install laragon```
2. Télécharger PHP via Laragon
   1. Lancer Laragon
   2. Menu / Tools / Quick add
   3. Séléctionner PHP8.0
   4. (optionnel) même chose pour nginx
3. Activer openssl dans la configuration php
   1. Depuis Laragon
   2. ouvrir le fichier php.ini (Menu / PHP / php.ini)
   3. les configs ```curl.cainfo``` et ```openssl.cafile``` doivent être décommentées et avoir la valeur suivante (attention a mettre votre trigramme) :  ```"%USERPROFILE%\scoop\apps\laragon\current\etc\ssl\cacert.pem"```.
4. Configurer la version de PHP dans PHPStorm (PHP language level / Cli Interpreter) => 8.0
5. Lancer un ```composer install``` depuis PHPStorm (ouvrir ```composer.json``` et un bouton ```install``` apparaît en haut a droite)
6. Configurer PHPUnit
   1. Settings / PHP / Test Frameworks
   2. PHPUnit Library
   3. Séléctionner ```Use composer autoloader```
   4. Path to script => choisir le fichier ```autoload.php``` situé dans le dossier ```vendor``` du projet
7. Lancer un test pour vérifier le fonctionnement.

# Lancer les tests depuis une invite de commande 

## Installer les dépendances composer
Depuis le dossier php du projet :
```%USERPROFILE%\scoop\apps\laragon\current\bin\php\php-8.0.10-nts\php.exe %USERPROFILE%\scoop\apps\laragon\current\bin\composer\composer.phar install```

## Lancer les tests 
Depuis le dossier php du projet (Lance uniquement la classe BlogTests) :
```%USERPROFILE%\scoop\apps\laragon\current\bin\php\php-8.0.10-nts\php.exe vendor\phpunit\phpunit\phpunit tests\Antipatterns\BlogTests.php```

C:\Users\SSJ\scoop\apps\laragon\current\bin\php\php-8.0.10-nts\php.exe C:\Users\SSJ\scoop\apps\laragon\current\bin\composer\composer.phar install