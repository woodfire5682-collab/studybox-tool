const AdmZip=require('adm-zip');
const fs=require('fs');
function extract(zip,dir){
  new AdmZip(zip).extractAllTo(dir,true);
  console.log('extracted',zip,'->',dir);
}
extract('D:/deepseek/_apkbuild/jdk.zip','D:/deepseek/_apkbuild/jdk');
extract('D:/deepseek/_apkbuild/build-tools.zip','D:/deepseek/_apkbuild/bt');
extract('D:/deepseek/_apkbuild/platform.zip','D:/deepseek/_apkbuild/plat');
