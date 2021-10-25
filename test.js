const nunjucks = require("nunjucks");
const nunjucksPlugin = require('./dist').default;

test('it can create plugin without options', () => {
    const plugin = nunjucksPlugin();
    checkPluginKeys(plugin);
});

test('it can create plugin with variables', () => {
    const plugin = nunjucksPlugin({variables: {'*': {name: 'name'}}});
    checkPluginKeys(plugin);
});

test('it can create plugin with filters and extensions', () => {
    const plugin = nunjucksPlugin({
        nunjucksEnvironment: {
            filters: {someFilter: () => 'test'},
            extensions: {someExtension: { tags: ['test'], parse: () => 'test' }}
        }
    });
    checkPluginKeys(plugin);
});

test('it can create plugin with custom environment', () => {
    const plugin = nunjucksPlugin({nunjucksEnvironment: new nunjucks.Environment()});
    checkPluginKeys(plugin);
});

test('it can transform HTML', () => {
    const name = 'John';
    const plugin = nunjucksPlugin({variables: {'*': {name: name}}});
    const html = plugin.transformIndexHtml.transform('<p>Hello {{name}}</p>', { path: '' })
    expect(html).toEqual(`<p>Hello ${name}</p>`);
});

const checkPluginKeys = (plugin) => {
    expect(plugin).toHaveProperty('name');
    expect(plugin).toHaveProperty('enforce');
    expect(plugin).toHaveProperty('handleHotUpdate');
    expect(plugin).toHaveProperty('transformIndexHtml');
}
