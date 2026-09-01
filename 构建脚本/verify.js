const AdmZip=require('adm-zip'); const fs=require('fs');
const zip=new AdmZip('D:/deepseek/_apkbuild/学习工具箱v1.0.apk');
const names=zip.getEntries().map(e=>e.entryName);
console.log('条目:', names.join(', '));
const html=zip.readAsText('assets/index.html');
console.log('assets/index.html 解压后大小:', html.length, '字符; 含题库:', html.includes('BANK'), '含exportData:', html.includes('exportData'));
const dex=zip.getEntry('classes.dex'); console.log('classes.dex:', dex ? dex.header.size+' 字节' : '缺失!');
