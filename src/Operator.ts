
const compressing = require('compressing');
import xml2js from 'xml2js'
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
    static srcFile: string = null;
    static unzipDir: string = null;
    //解压epub文件
    static UnzipEpub(epubDocumentPath: string, fileName: string)
    {
        Operator.srcFile = epubDocumentPath + fileName + '.epub';
        Operator.unzipDir = epubDocumentPath + fileName;
        return new Promise<boolean>((resolve, reject) =>
        {
            compressing.zip.uncompress(Operator.srcFile, Operator.unzipDir)
                .then(() =>
                {
                    resolve(true)
                })
                .catch((err: any) =>
                {
                    Operator.srcFile = null;
                    Operator.unzipDir = null;
                    console.log(err);
                    resolve(false);
                })
        })
    }

    static async ConvertToJson(distDir: string)
    {
        //解析目录 catalog.xhtml
        let string = fs.readFileSync(RootDir + '/epub/temp/catalog.xhtml', 'utf8');
        let result: any = xml2json.toJson(string);
    
        console.log(JSON.parse(result));
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
        Operator.SaveJson(book.cata, distDir, 'book.json')

        //保存最后几个章节的标题
        Operator.SaveJson(lastChapters, distDir, 'latestchapters.json')

        //转换并保存小说内容
        index = 0;
        for (let file of book.contentFiles)
        {
            let chapter = await Operator.ConvertContent(file);
            Operator.SaveJson(chapter, distDir, index + '.json');
            index++;
            console.log('...'+index+'/'+book.contentFiles.length);
            
        }
        console.log("convert finish");
    }

    static async ConvertContent(contentFile: string, )
    {
        let file = contentFile;
        let string = fs.readFileSync(RootDir + '/epub/temp/' + file, 'utf8');
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

    static async SaveJson(cata: string[], distDir: string, fileName: string)
    {
        if (fs.existsSync(distDir + fileName))
        {
            fs.unlinkSync(distDir + fileName);
        }
        fs.writeFileSync(distDir + fileName, JSON.stringify(cata));
    }


}