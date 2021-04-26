# LanguagEz
La aplicación LanguagEz tiene como objetivo ayudar a los usuarios a aprender idiomas con lecciones variadas bien estructuradas y minijuegos para reforzar el conocimiento de forma entretenida.

Repositorio api: https://github.com/IvanTorres21/LanguagEzApi

Repositorio app: https://github.com/IvanTorres21/LanguagEzApp

## Descripción
Los usuarios tendrán acceso a varias funcionalidades, la primera siendo la más importante serán las lecciones las cuales en lugar de seguir una plantilla establecida serán hechas dependiendo de como sea lo mejor para ellas. Además de eso contarán con minijuegos como el ahorcado o las parejas para reforzar su conocimiento. A eso se le añadirá acceso a un diccionario del lenguaje con las palabras usadas en las lecciones, las cuales podrán estudiar por lecciones; o puede que prefieran usar el diccionario personal, en el que podrán crear sus propias colecciones de palabras y estudiarlas.

## ¿Qué se usara?
Para el desarrollo del proyecto se usarán varias tecnologías:
- Flutter para la  aplicación de android.
- Laravel para la API de la aplicación.
- MySQL para la base de datos.
- Ionic para un dashboard accesible solo a administradores.

## ¿Cuáles son los contenidos de la web de Ionic?
En la web de Ionic los administradores podrán hacer varias cosas, las más importantes siendo:
- Creación de noticias que serán mostradas en la página de Inicio de la app.
- Gestión de usuarios
- Creación de lecciones
- HomePage 

## ¿Cuáles son los contenidos de la app?
La aplicación contará con las siguientes funcionalidades:
- Lecciones de distintos idiomas.
- Minijuegos para practicar más los idiomas.
- Lista de amigos
- Sistema de medallas
- Diccionario de idiomas
- Diccionario personal
- Exportar e importar diccionarios personales (?)
- Buscador en el diccionario (tanto por la palabra en el idioma original como el significado)
- Un sistema de niveles
- Un tablón de noticias

## Diseño App
<img src="appDesign.png" width="900px">

## Diseño Ionic
<img src="webDesign.png" width="900px">

## Revisiones

### ¿Uso de MCERL? 
El uso de MCERL no es nunca utilizado en la gran mayoría de estas aplicaciones, y por lo tanto no tengo pensado añadirlo. Solo contribuiría a un pensamiento incorrecto por parte del usuario. Este tipo de aplicaciones son útiles como apoyo general a los estudios de los lenguajes, no son capaces de sustituir a un curso completo de idioma. El objetivo es reforzar el aprendizaje del lenguaje de forma entretenida, sesiones cortas que puedes hacer mientras esperas a algo.

### Funcionalidad de la lista de amigos
La lista de amigos funciona como otro recurso de motivación para el usuario, siendo lo que puedes ver en el perfil de tus amigos sus medallas y nivel. Esto está hecho aposta para promover competitividad entre ellos y nada más, añadir funciones más socailes que eso provocaría que se desconcentrase demasiado (Por eso mismo no hay chat, ni estado, etc)

### ¿Como funciona la evaluación?
Cada cierto número de lecciones se desbloqueá un examen. Esto funciona exactamente igual que las lecciones (Se crearan desde la web como se crean las lecciones, excepto que se añadira un contador de "lecciones completadas", eso indicara la cantidad de lecciones completadas que necesita el usuario para poder acceder al examen). Una vez se pueda acceder al examen será exáctamente igual que la práctica de las lecciones pero contará con ejercicios relacionados con todo el temario dado. La puntuación se calculara en base a las respuestas correctas sobre 100.

## Diario proyecto

### 27/04
- Se han creado los repositorios para cada parte de la app
- Se han creado las migraciones de la base de datos
- Se han creado los modelos de la base de datos
