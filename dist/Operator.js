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
    static UnzipEpub(epubDirPath, fileName, distDir, unzipToSubDir = true) {
        let srcFile = epubDirPath + fileName + '.epub';
        return new Promise((resolve, reject) => {
            if (!fs_1.default.existsSync(srcFile)) {
                console.log(srcFile + ' is not exist');
                resolve(false);
            }
            let dist = distDir;
            if (unzipToSubDir) {
                dist += fileName;
            }
            compressing.zip.uncompress(srcFile, dist)
                .then(() => {
                console.log("解压完成");
                resolve(true);
            })
                .catch((err) => {
                console.log(err);
                resolve(false);
            });
        });
    }
    static ConvertToJson(srcDir, distDir) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //解析目录 catalog.xhtml
                let string = fs_1.default.readFileSync(srcDir + '/catalog.xhtml', 'utf8');
                let result = xml2json_1.default.toJson(string);
                //console.log(JSON.parse(result));
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
                let success = yield Operator.SaveJson(book.cata, distDir, 'book.json');
                if (!success) {
                    console.log('convert book catalog fail');
                    return false;
                }
                console.log('convert book catalog finish...');
                //保存最后几个章节的标题
                success = yield Operator.SaveJson(lastChapters, distDir, 'latestchapters.json');
                if (!success) {
                    console.log('convert latestchapters fail');
                    return false;
                }
                console.log('convert last 10 chapters finish...');
                //转换并保存小说内容
                index = 0;
                for (let file of book.contentFiles) {
                    let chapter = yield Operator.ConvertContent(srcDir + '/' + file);
                    success = yield Operator.SaveJson(chapter, distDir, index + '.json');
                    if (!success) {
                        console.log('convert content fail: index--->' + index);
                        return false;
                    }
                    index++;
                    console.log('converting content--->' + index + '/' + book.contentFiles.length);
                }
                console.log("convert whole book finish");
                return true;
            }
            catch (error) {
                console.error('convert book failed:', error);
                return false;
            }
        });
    }
    static ConvertContent(contentFile) {
        return __awaiter(this, void 0, void 0, function* () {
            let string = fs_1.default.readFileSync(contentFile, 'utf8');
            let result = xml2json_1.default.toJson(string);
            result = JSON.parse(result);
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
    //将json保存为文件
    static SaveJson(data, distDir, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (fs_1.default.existsSync(distDir + fileName)) {
                fs_1.default.unlinkSync(distDir + fileName);
            }
            try {
                let fileData = JSON.stringify(data);
                fs_1.default.writeFileSync(distDir + fileName, fileData);
                return true;
            }
            catch (error) {
                console.log('save fail:', error);
                console.log('file name:' + distDir + fileName);
                return false;
            }
        });
    }
    static DeleteTempFile(path) {
        if (fs_1.default.existsSync(path)) {
            fs_1.default.readdirSync(path).forEach(function (file) {
                var curPath = path + "/" + file;
                if (fs_1.default.statSync(curPath).isDirectory()) { // recurse
                    Operator.DeleteTempFile(curPath);
                }
                else { // delete file
                    fs_1.default.unlinkSync(curPath);
                }
            });
            fs_1.default.rmdirSync(path);
        }
    }
}
exports.Operator = Operator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3BlcmF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvT3BlcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUNBLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMzQyx3REFBZ0M7QUFDaEMsNENBQW9CO0FBR1AsUUFBQSxZQUFZLEdBQ3JCO0lBQ0ksZ0JBQWdCO0lBQ2hCLG9CQUFvQjtJQUNwQixtQkFBbUI7Q0FDdEIsQ0FBQTtBQUVRLFFBQUEsVUFBVSxHQUFHO0lBQ3RCLE1BQU07SUFDTixvQkFBb0I7SUFDcEIsa0RBQWtEO0lBQ2xELDRFQUE0RTtJQUM1RSxjQUFjO0lBQ2QsVUFBVTtJQUNWLGVBQWU7Q0FDbEIsQ0FBQTtBQUVELE1BQWEsUUFBUTtJQUVqQixVQUFVO0lBQ1YsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFtQixFQUFFLFFBQWdCLEVBQUMsT0FBYyxFQUFDLGdCQUFzQixJQUFJO1FBRTVGLElBQUksT0FBTyxHQUFHLFdBQVcsR0FBRyxRQUFRLEdBQUcsT0FBTyxDQUFDO1FBQy9DLE9BQU8sSUFBSSxPQUFPLENBQVUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFFNUMsSUFBSSxDQUFDLFlBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQzNCO2dCQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxHQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUNyQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDbEI7WUFDRCxJQUFJLElBQUksR0FBRyxPQUFPLENBQUM7WUFDbkIsSUFBSSxhQUFhLEVBQUU7Z0JBQ2YsSUFBSSxJQUFJLFFBQVEsQ0FBQzthQUNwQjtZQUNELFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUM7aUJBQ3BDLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBRVAsT0FBTyxDQUFDLEdBQUcs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