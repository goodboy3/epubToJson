import fs from 'fs'
import { Operator } from './Operator';
import { DownLoader } from './DownLoader';

export const RootDir = __dirname + '/..';
export const TempFile = 'temp';

async function main()
{
    //读取文件夹内的文件
    let epubDocumentPath = RootDir + '/epub/';
    //let files = fs.readdirSync(epubDocumentPath);
    //console.log(files);
    let fileName = TempFile;
    // if (files.length == 0) 
    // {
    //     console.log("can not find any file");
        
    //     return;
    // }
    // fileName = files[0].replace('.epub', '');
    //console.log(fileName);
    
    //解压epub文件
    let res = await Operator.UnzipEpub(epubDocumentPath, fileName);
    if (res == false) 
    {
        return;
    }

    //解压成功后开始解析


}

//let downResult:boolean= await DownLoader.DownLoadFile("https://www.ixdzs.com/down?id=206154&p=4", RootDir + '/epub/', TempFile+'.epub');

//main();

Operator.ConvertToJson(RootDir+'/bookJson/');
