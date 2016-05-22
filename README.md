# swipe.
### The new way to use every last meal.

#### By Derick Yang

**swipe** is a tool that every college student needs at the end of the semester: 

*'It's finals season, and I need to eat. I don't want to pay full price for dining hall meals...'*

*'What should I do with all these meal swipes I've got left???'*

Using a full Javascript stack (Angular, Node, Mongo), this site is designed to solve the problems that students face every day towards the end of a semester, all while making a profit.

### API's used:
* Facebook Graph API
* **Venmo API**
* **Twilio API** 


### File structure (5/22/2016)
    .
    ├── NOTES.md // implementation notes
    ├── README.md // this file
    ├── css
    │   ├── bootstrap.min.css // Bootstrap
    │   ├── bootstrap.min.css.map
    │   ├── font-awesome.css // font-awesome
    │   ├── font-awesome.min.css
    │   └── styles.less // custom styles
    ├── fonts // Raleway and font-awesome
    │   └── ...
    ├── img // logo and background
    │   └── ...
    ├── index.html // main html
    ├── index.js // server and site API
    ├── js
    │   ├── angular.min.js // angular script
    │   ├── angular.min.js.map
    │   ├── bootstrap.min.js // Bootstrap
    │   ├── jquery-1.12.3.min.js // jquery (not used yet)
    │   ├── less.js // LESS processor (remove on deploy)
    │   ├── script.js // angular controller scripts
    │   └── services.js // angular services
    └── package.json

### npm dependencies
* body-parser (for requests)
* mongoose (schemas for DB input)
* mongoose-sanitizer (sanitizes db input to avoid XSS, but it is NOT PERFECT)
* express (routing)
