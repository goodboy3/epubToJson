
const compressing = require('compressing');
import xml2json from 'xml2json';
import fs from 'fs';
import { RootDir } from '.';

export const deleteString =
    [
        /【.*13800100.*】/,
        /【.*13800100.*看书网”$/,
        /【.*13800100.*看书网$/,
    ]

export const deleteLine = [
    "分节阅读",
    /.*看无广告，全文字无错首发小说.*/,
    //  /^【.*】$/,//正则表达式 忽略【XXXXXXXXXXX】 以【开头  以】结尾 的行
    "www.13800100.Com文字首发/files/article/info/2237/www.13800100.Com文字首发《无良房东俏佳人》",
    /.*频道177855.*/,
    /.*微信公众号*/,
    /.*ixdzs.com.*/
]

export class Operator
{
    //解压epub文件
    static UnzipEpub(epubDirPath: string, fileName: string,distDir:string,unzipToSubDir:boolean=true)
    {
        let srcFile = epubDirPath + fileName + '.epub';
        return new Promise<boolean>((resolve, reject) =>
        {
            if (!fs.existsSync(srcFile)) 
            {
                console.log(srcFile+' is not exist');
                resolve(false);    
            }
            let dist = distDir;
            if (unzipToSubDir) {
                dist += fileName;
            }
            compressing.zip.uncompress(srcFile, dist)
                .then(() =>
                {
                    console.log("解压完成");
                    resolve(true)
                })
                .catch((err: any) =>
                {
                    console.log(err);
                    resolve(false);
                })
        })
    }

    static async ConvertToJson(srcDir:string,distDir: string)
    {
        try
        {
            //解析目录 catalog.xhtml
            let string = fs.readFileSync(srcDir+'/catalog.xhtml', 'utf8');
            let result: any = xml2json.toJson(string);

            //console.log(JSON.parse(result));
            result = JSON.parse(result);
            let arr = result.html.body.ul.li;
            //console.log(arr);
            let lastChapters: string[] = [];
            let book: { cata: string[], contentFiles: string[] } = {
                cata: [],
                contentFiles: [],
            }
            let index = 0;
            let lastChapterCount = arr.length - 10;
            for (let element of arr)
            {
                let item = element.a;
                //console.log(item._);
                book.cata.push(item.$t);
                //console.log(item.$.href);
                book.contentFiles.push(item.href);
                if (index >= lastChapterCount)
                {
                    lastChapters.unshift(item.$t)
                }
                index++;
            }
            //保存目录
            let success:boolean = await Operator.SaveJson(book.cata, distDir, 'book.json')
            if (!success) {
                console.log('convert book catalog fail');
                return false;
            }
            console.log('convert book catalog finish...');
            
            

            //保存最后几个章节的标题
            success = await Operator.SaveJson(lastChapters, distDir, 'latestchapters.json')
            if (!success)
            {
                console.log('convert latestchapters fail');
                return false;
            }
            console.log('convert last 10 chapters finish...');

            //转换并保存小说内容
            index = 0;
            for (let file of book.contentFiles)
            {
                let chapter = await Operator.ConvertContent(srcDir+'/'+file);
                success = await Operator.SaveJson(chapter, distDir, index + '.json');
                if (!success)
                {
                    console.log('convert content fail: index--->'+index);
                    return false;
                }
                index++;
                console.log('converting content--->' + index + '/' + book.contentFiles.length);
            }
            console.log("convert whole book finish");
            return true;
        } catch (error)
        {
            console.error('convert book failed:', error); 
            return false;
        }
    }

    private static async ConvertContent(contentFile: string, )
    {
        let string = fs.readFileSync(contentFile, 'utf8');
        let result: any = xml2json.toJson(string);
        result = JSON.parse(result);

        let chapterArr: string[] = []
        let chapter: string[] = result.html.body.p;
        //console.log(chapter);
        for (let line of chapter)
        {
            //去掉空的line
            if (line == '')
            {
                continue;
            }
            //去掉一行的首尾空格
            line = line.replace(/(^\s*)|(\s*$)/g, '');//收尾去掉空格

            //整行去掉 设定的字符
            let find = false;
            for (let i = 0; i < deleteLine.length; i++)
            {
                if (line.search(deleteLine[i]) != -1) 
                {
                    find = true;
                    break;
                }
            }
            if (find)
            {
                continue;
            }

            //替换掉设定的字符串
            for (let i = 0; i < deleteString.length; i++)
            {
                line = line.replace(deleteString[i], '');
            }

            //去掉空行
            if (line == "") 
            {
                continue;
            }
            chapterArr.push(line);

        }
        return chapterArr;
    }

    //将json保存为文件
    private static async SaveJson(data: string[], distDir: string, fileName: string)
    {
        if (fs.existsSync(distDir + fileName))
        {
            fs.unlinkSync(distDir + fileName);
        }
        try {
            let fileData = JSON.stringify(data)
            fs.writeFileSync(distDir + fileName, fileData);
            return true;
        } catch (error)
        {
            console.log('save fail:',error);
            console.log('file name:'+distDir+fileName);
            return false;
        } 
    }

    static DeleteTempFile(path:string)
    {
        if (fs.existsSync(path))
        {
            fs.readdirSync(path).forEach(function (file)
            {
                var curPath = path + "/" + file;
                if (fs.statSync(curPath).isDirectory())
                { // recurse
                    Operator.DeleteTempFile(curPath);
                } else
                { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    }


}