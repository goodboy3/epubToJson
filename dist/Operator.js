"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compressing = require('compressing');
const xml2json_1 = __importDefault(require("xml2json"));
const fs_1 = __importDefault(require("fs"));
const _1 = require(".");
exports.deleteString = [
    /【.*13800100.*】/,
    /【.*13800100.*看书网”$/,
    /【.*13800100.*看书网$/,
];
exports.deleteLine = [
    "分节阅读",
    /.*看无广告，全文字无错首发小说.*/,
    //  /^【.*】$/,//正则表达式 忽略【XXXXXXXXXXX】 以【开头  以】结尾 的行
    "www.13800100.Com文字首发/files/article/info/2237/www.13800100.Com文字首发《无良房东俏佳人》",
    /.*频道177855.*/,
    /.*微信公众号*/,
    /.*ixdzs.com.*/
];
class Operator {
    //解压epub文件
    static UnzipEpub(epubDocumentPath, fileName) {
        Operator.srcFile = epubDocumentPath + fileName + '.epub';
        Operator.unzipDir = epubDocumentPath + fileName;
        return new Promise((resolve, reject) => {
            compressing.zip.uncompress(Operator.srcFile, Operator.unzipDir)
                .then(() => {
                resolve(true);
            })
                .catch((err) => {
                Operator.srcFile = null;
                Operator.unzipDir = null;
                console.log(err);
                resolve(false);
            });
        });
    }
    static ConvertToJson(distDir) {
        return __awaiter(this, void 0, void 0, function* () {
            //解析目录 catalog.xhtml
            let string = fs_1.default.readFileSync(_1.RootDir + '/epub/temp/catalog.xhtml', 'utf8');
            let result = xml2json_1.default.toJson(string);
            //xml2js.parseString(string, (err: any, result: any) =>
            //{
            console.log(JSON.parse(result));
            result = JSON.parse(result);
            let arr = result.html.body.ul.li;
            //console.log(arr);
            let lastChapters = [];
            let book = {
                cata: [],
                contentFiles: [],
            };
            let index = 0;
            let lastChapterCount = arr.length - 10;
            for (let element of arr) {
                let item = element.a;
                //console.log(item._);
                book.cata.push(item.$t);
                //console.log(item.$.href);
                book.contentFiles.push(item.href);
                if (index >= lastChapterCount) {
                    lastChapters.unshift(item.$t);
                }
                index++;
            }
            //保存目录
            Operator.SaveJson(book.cata, distDir, 'book.json');
            //保存最后几个章节的标题
            Operator.SaveJson(lastChapters, distDir, 'latestchapters.json');
            //转换并保存小说内容
            index = 0;
            for (let file of book.contentFiles) {
                let chapter = yield Operator.ConvertContent(file);
                Operator.SaveJson(chapter, distDir, index + '.json');
                index++;
                console.log('...' + index + '/' + book.contentFiles.length);
            }
            console.log("convert finish");
        });
    }
    static ConvertContent(contentFile) {
        return __awaiter(this, void 0, void 0, function* () {
            let file = contentFile;
            let string = fs_1.default.readFileSync(_1.RootDir + '/epub/temp/' + file, 'utf8');
            let result = xml2json_1.default.toJson(string);
            result = JSON.parse(result);
            // xml2js.parseString(string, (err: any, result: any) =>
            // {
            let chapterArr = [];
            let chapter = result.html.body.p;
            //console.log(chapter);
            for (let line of chapter) {
                //去掉空的line
                if (line == '') {
                    continue;
                }
                //去掉一行的首尾空格
                line = line.replace(/(^\s*)|(\s*$)/g, ''); //收尾去掉空格
                //整行去掉 设定的字符
                let find = false;
                for (let i = 0; i < exports.deleteLine.length; i++) {
                    if (line.search(exports.deleteLine[i]) != -1) {
                        find = true;
                        break;
                    }
                }
                if (find) {
                    continue;
                }
                //替换掉设定的字符串
                for (let i = 0; i < exports.deleteString.length; i++) {
                    line = line.replace(exports.deleteString[i], '');
                }
                //去掉空行
                if (line == "") {
                    continue;
                }
                chapterArr.push(line);
            }
            return chapterArr;
        });
    }
    static SaveJson(cata, distDir, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (fs_1.default.existsSync(distDir + fileName)) {
                fs_1.default.unlinkSync(distDir + fileName);
            }
            fs_1.default.writeFileSync(distDir + fileName, JSON.stringify(cata));
        });
    }
}
Operator.srcFile = null;
Operator.unzipDir = null;
exports.Operator = Operator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3BlcmF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvT3BlcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUNBLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUUzQyx3REFBZ0M7QUFDaEMsNENBQW9CO0FBQ3BCLHdCQUE0QjtBQUVmLFFBQUEsWUFBWSxHQUNyQjtJQUNJLGdCQUFnQjtJQUNoQixvQkFBb0I7SUFDcEIsbUJBQW1CO0NBQ3RCLENBQUE7QUFFUSxRQUFBLFVBQVUsR0FBRztJQUN0QixNQUFNO0lBQ04sb0JBQW9CO0lBQ3BCLGtEQUFrRDtJQUNsRCw0RUFBNEU7SUFDNUUsY0FBYztJQUNkLFVBQVU7SUFDVixlQUFlO0NBQ2xCLENBQUE7QUFFRCxNQUFhLFFBQVE7SUFJakIsVUFBVTtJQUNWLE1BQU0sQ0FBQyxTQUFTLENBQUMsZ0JBQXdCLEVBQUUsUUFBZ0I7UUFFdkQsUUFBUSxDQUFDLE9BQU8sR0FBRyxnQkFBZ0IsR0FBRyxRQUFRLEdBQUcsT0FBTyxDQUFDO1FBQ3pELFFBQVEsQ0FBQyxRQUFRLEdBQUcsZ0JBQWdCLEdBQUcsUUFBUSxDQUFDO1FBQ2hELE9BQU8sSUFBSSxPQUFPLENBQVUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFFNUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDO2lCQUMxRCxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUVQLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUNqQixDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLENBQUMsR0FBUSxFQUFFLEVBQUU7Z0JBRWhCLFFBQVEsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO2dCQUN4QixRQUFRLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztnQkFDekIsT0FBTyxDQUFDLEdBQUcsQ0FB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