// 下载器：跟随重定向，流式写文件，带进度
const https = require('https');
const fs = require('fs');
const url = process.argv[2];
const out = process.argv[3];
let redirects = 0;
function dl(u){
  const req = https.get(u, { headers:{'User-Agent':'Mozilla/5.0','Accept':'*/*'} }, r => {
    if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location && redirects < 8) {
      redirects++; r.resume(); console.log('redirect ->', r.headers.location.slice(0,110)); dl(r.headers.location); return;
    }
    if (r.statusCode !== 200) { console.error('HTTP', r.statusCode, u); process.exit(2); }
    const total = Number(r.headers['content-length'] || 0);
    const ws = fs.createWriteStream(out);
    let got = 0; const t0 = Date.now();
    r.on('data', c => { got += c.length; if (Date.now() - t0 > 4000) { console.log('  ...', (got/1048576).toFixed(1), 'MB /', (total/1048576).toFixed(1), 'MB'); t0mark(); } });
    let last = Date.now();
    function t0mark(){ last = Date.now(); }
    r.pipe(ws);
    ws.on('finish', () => { console.log('DONE', out, (got/1048576).toFixed(1), 'MB'); process.exit(0); });
  });
  req.on('error', e => { console.error('ERR', e.message); process.exit(3); });
}
dl(url);
