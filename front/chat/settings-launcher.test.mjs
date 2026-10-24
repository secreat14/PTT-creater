import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { transformSync } from 'rolldown/utils';

function nodes(node) {
  if (!node || typeof node !== 'object') return [];
  return [node, ...[node.props?.children].flat(Infinity).flatMap(nodes)];
}

async function renderApp(search = '') {
  const jsx = (type, props) => ({ type, props });
  const context = vm.createContext({
    URLSearchParams,
    window: { location: { search } },
    document: { body: { classList: { toggle() {}, remove() {} } } },
  });
  const mocks = {
    react: { useEffect(effect) { effect(); } },
    'react/jsx-runtime': { Fragment: 'fragment', jsx, jsxs: jsx },
    'lucide-react': { Settings: 'settings-icon' },
    './features/ppt-reader/PptReader': { PptReader: 'ppt-reader', PptPresenter: 'ppt-presenter' },
  };
  const code = transformSync('App.tsx', await readFile(new URL('../App.tsx', import.meta.url), 'utf8'), { jsx: { runtime: 'automatic' } }).code;
  const module = new vm.SourceTextModule(code, { context });
  await module.link((name) => {
    const mock = mocks[name];
    return new vm.SyntheticModule(Object.keys(mock), function() {
      for (const [key, value] of Object.entries(mock)) this.setExport(key, value);
    }, { context });
  });
  await module.evaluate();
  return module.namespace.App();
}

test('top controls are one settings icon opening the standalone page', async () => {
  const tree = nodes(await renderApp());
  const links = tree.filter((node) => node.type === 'a');
  assert.equal(links.length, 1);
  assert.equal(links[0].props.href, '/__saplingagent/kernel');
  assert.equal(links[0].props.target, '_blank');
  assert.equal(links[0].props.rel, 'noopener');
  assert.equal(links[0].props['aria-label'], 'Open settings');
  assert.equal(tree.filter((node) => node.type === 'settings-icon').length, 1);
  assert.equal(tree.filter((node) => node.type === 'iframe').length, 1);
  assert.equal(tree.find((node) => node.type === 'iframe').props.src, '/__saplingagent/kernel?footer');
});

test('presenter window stays free of application settings controls', async () => {
  const tree = nodes(await renderApp('?mode=present'));
  assert.equal(tree.filter((node) => node.type === 'ppt-presenter').length, 1);
  assert.equal(tree.filter((node) => node.type === 'a' || node.type === 'iframe').length, 0);
});
