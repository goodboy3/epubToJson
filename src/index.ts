import fs from 'fs'
import { Operator } from './Operator';
import { DownLoader } from './DownLoader';

export const RootDir = __dirname + '/..';
export const TempFile = 'temp';

async function main(downloadUrl:string,distDir:string)
{
    //读取文件夹内的文件
    let epubDirPath = RootDir + '/epubTemp/';
    let fileName = TempFile;

    fs.mkdirSync(epubDirPath)


    //下载文件
    let res = await DownLoader.DownLoadFile(downloadUrl, epubDirPath, fileName + '.epub');
    if (res == false)
    {
        Operator.DeleteTempFile(epubDirPath);
        return false;
    }
    
    //解压epub文件
    res = await Operator.UnzipEpub(epubDirPath, fileName, epubDirPath);
    if (res == false) 
    {
        Operator.DeleteTempFile(epubDirPath);
        return false;
    }

    //解压成功后开始解析
    fs.mkdirSync(distDir)
    res = await Operator.ConvertToJson(epubDirPath+fileName, distDir);
    if (res == false)
    {
        Operator.DeleteTempFile(epubDirPath);
        Operator.DeleteTempFile(distDir);
        return false;
    }

    //完成后删除临时文件
    Operator.DeleteTempFile(epubDirPath);

    return true;
}


main("https://www.ixdzs.com/down?id=206154&p=4", RootDir + '/bookJson/');



