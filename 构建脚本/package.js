const AdmZip=require('adm-zip'); const fs=require('fs');
const zip=new AdmZip('D:/deepseek/_apkbuild/base.apk');
zip.addFile('classes.dex', fs.readFileSync('D:/deepseek/_apkbuild/dex/classes.dex'));
zip.addFile('assets/index.html', fs.readFileSync('D:/deepseek/_apkbuild/app/assets/index.html'));
zip.writeZip('D:/deepseek/_apkbuild/staged.apk');
console.log('staged.apk OK', fs.statSync('D:/deepseek/_apkbuild/staged.apk').size);
