# vite-plugin-nunjucks
[Vite](https://github.com/vitejs/vite) plugin for [Nunjucks](https://github.com/mozilla/nunjucks).

✔️ Can include templates   
✔️ Can pass parameters for each entry point (HTML)

## Install
**Yarn**
```
yarn add vite-plugin-nunjucks -D
```
or **npm**
```
npm i vite-plugin-nunjucks --save-dev
```

## Usage
### Configuration
Use plugin in your Vite config (`vite.config.ts`)
```JavaScript
import nunjucks from 'vite-plugin-nunjucks'

export default {
    plugins: [
        nunjucks(),
    ]
}
```
### Example
Input (`src/index.html`):
```html
{% extends "src/html/layout.html" %}
{% include "src/html/hello.html"  %}

{% block content %}
    {% if username %}
        Username: {{ username }}
    {% else %}
        Variable <code>username</code> is missing
    {% endif %}
{% endblock %}
```
Template (`src/html/layout.html`):
```html
<!DOCTYPE html>
<html lang="en">
<head></head>
<body>
    {% block content %}
    {% endblock %}
</body>
</html>
```
Template (`src/html/hello.html`):
```html
<h1>Hello world!</h1>
```
Vite config (`vite.config.ts`)
```JavaScript
import nunjucks from 'vite-plugin-nunjucks'

export default {
    plugins: [
        nunjucks({ variables: { 'index.html': { username: 'John' }}} ),
    ]
}
```
**Output** (`dist/index.html`)
```html
<!DOCTYPE html>
<html lang="en">
<head></head>
<body>
    <h1>Hello world!</h1>
    Username: John
</body>
</html>
```

## Options

| Parameter | Type  | Default | Description |
| ----------- | ----------- | ----------- | ----------- |
| templatesDir | `string` | `./src/html` | Absolute path where are HTML templates located. Example: `path.resolve(process.cwd(), 'src', 'myTemplates')`
| variables | `Record<string, object>` | `{}` | Variables for each entry point. Example `{ 'index.html': {username:'John'} }`
| nunjucksConfigure | `Nunjucks.ConfigureOptions` | `{noCache:true}` | [Configure options for Nunjucks](https://mozilla.github.io/nunjucks/api.html#configure)

