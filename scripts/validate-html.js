// GitHub Actions 校验脚本：检查两个 HTML 的内联 JS 语法 + 内容完整性
// 用法: node validate-html.js
const fs = require('fs');
const vm = require('vm');
const path = require('path');

// 内容完整性底线（低于则视为异常）
const MIN = { mind: 100, bank: 400, decks: 100 };

function loadHtml(p) {
  if (!fs.existsSync(p)) { return null; }
  return fs.readFileSync(p, 'utf8');
}

function checkOne(file) {
  const h = loadHtml(file);
  if (!h) { console.log('跳过（不存在）:', path.basename(file)); return null; }
  const scripts = [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n;\n');
  try {
    new vm.Script(scripts, { filename: file });
  } catch (e) {
    console.error('❌ JS 语法错误:', path.basename(file), '->', String(e.stack).split('\n')[1] || e.message);
    process.exit(1);
  }
  const mind = (h.match(/'([^']+)':`/g) || []).length;
  const bank = (h.match(/\{ch:/g) || []).length;
  const decks = (h.match(/^ '.*':\[/gm) || []).length;
  const problems = [];
  if (mind < MIN.mind) problems.push('MIND主题 ' + mind + ' < ' + MIN.mind);
  if (bank < MIN.bank) problems.push('题库 ' + bank + ' < ' + MIN.bank);
  if (decks < MIN.decks) problems.push('记忆卡组 ' + decks + ' < ' + MIN.decks);
  if (problems.length) { console.error('❌ 内容不足:', path.basename(file), problems.join('; ')); process.exit(1); }
  console.log('✅', path.basename(file), '| JS语法OK | MIND:', mind, '| 题库:', bank, '| 卡组:', decks);
  return { mind, bank, decks };
}

const root = __dirname + '/..';
let ok = 0, files = ['学习工具箱.html', 'studybox-tool/index.html'];
for (const f of files) { const r = checkOne(path.join(root, f)); if (r) ok++; }
console.log('校验完成:', ok, '个文件通过');
