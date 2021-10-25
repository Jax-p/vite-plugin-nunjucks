# vite-plugin-nunjucks

[![Node.js CI](https://github.com/Jax-p/vite-plugin-nunjucks/actions/workflows/node.js.yml/badge.svg)](https://github.com/Jax-p/vite-plugin-nunjucks/actions/workflows/node.js.yml)
[![npm Downloads](https://img.shields.io/npm/dt/vite-plugin-nunjucks)](https://www.npmjs.com/package/vite-plugin-nunjucks)

[Vite](https://github.com/vitejs/vite) plugin for [Nunjucks](https://github.com/mozilla/nunjucks).

Supports:    
📂 - [Templates and layouts](https://mozilla.github.io/nunjucks/templating.html) 🔗     
📃 - Variables for each entry point (HTML) and global scope    
🎠 - [Custom filters](https://mozilla.github.io/nunjucks/api.html#custom-filters) 🔗 and [extensions](https://mozilla.github.io/nunjucks/api.html#custom-tags) 🔗

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

## Environment
Since v0.1.4 you can pass [custom filters](https://mozilla.github.io/nunjucks/api.html#custom-filters) and [extensions](https://mozilla.github.io/nunjucks/api.html#custom-tags) to the environment.   
Config example:
```JavaScript
import nunjucks from 'vite-plugin-nunjucks'

export default {
    plugins: [
        nunjucks({
            nunjucksEnvironment: {
                filters: {someFilter: someFilter},
                extensions: {someExtension: SomeExtension}
            }
        }),
    ]
}
```
Filter should look like this _(for more info check the Nunjucks documentation)_
```JavaScript
const someFilter = (val) => {
    // ... some logic
    return 'My modified filter content';
}
```
and extension like this:
```JavaScript
const SomeExtension = {
    tags: ['something'],
    parse: function(parser, nodes, lexer) {
        const [tag] = this.tags
        const tok = parser.nextToken()
        const args = parser.parseSignature(null, true)
        parser.advanceAfterBlockEnd(tok.value)
        const body = parser.parseUntilBlocks(tag, `end${tag}`)
        parser.advanceAfterBlockEnd()
        return new nodes.CallExtension(this, 'run', args, [body])
    },
    run (args) {
        return 'My modified extension content'
    }
}
```
then you can use it in the template:
```njk
{{ 'some text' | someFilter }}

{% something %}
    Some content
{% endsomething %}
```
and the result should be:
```html
My modified filter content
My modified extension content
```

### Async filter
If you need asynchronous filter you can pass `nunjucksFilter` instead of `nunjucksFilterCallback`:
```JavaScript
import nunjucks from 'vite-plugin-nunjucks'

export default {
    plugins: [
        nunjucks({
            nunjucksEnvironment: {
                filters: {someFilter: {
                    async: true,
                    filter: someFilter
                }},
            }
        }),
    ]
}
```

### Own environment
You can use your own environment that you configure entirely
```JavaScript
import nunjucks from 'vite-plugin-nunjucks'

const env = new nunjucks.Environment(/* someOptions */)
env.addFilter('someFilter', someFilter);
env.addExtension('someExtension', SomeExtension);
export default {
    plugins: [
        nunjucks({nunjucksEnvironment: env}),
    ]
}
```

## Options

| Parameter | Type  | Default | Description |
| ----------- | ----------- | ----------- | ----------- |
| templatesDir | `string` | `./src/html` | Absolute path where are HTML templates located. Example: `path.resolve(process.cwd(), 'src', 'myTemplates')`
| variables | `Record<string, object>` | `{}` | Variables for each entry point. Example `{ 'index.html': {username:'John'} }`
| nunjucksConfigure | `nunjucks.ConfigureOptions` | `{noCache:true}` | [Configure options for Nunjucks](https://mozilla.github.io/nunjucks/api.html#configure)
| nunjucksEnvironment | `nunjucksEnvironmentOptions OR nunjucks.Environment` | `{noCache:true}` | Configure Nunjucks environment or pass your own env



