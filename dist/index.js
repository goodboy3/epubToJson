"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Operator_1 = require("./Operator");
exports.RootDir = __dirname + '/..';
exports.TempFile = 'temp';
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        //读取文件夹内的文件
        let epubDocumentPath = exports.RootDir + '/epub/';
        //let files = fs.readdirSync(epubDocumentPath);
        //console.log(files);
        let fileName = exports.TempFile;
        // if (files.length == 0) 
        // {
        //     console.log("can not find any file");
        //     return;
        // }
        // fileName = files[0].replace('.epub', '');
        //console.log(fileName);
        //解压epub文件
        let res = yield Operator_1.Operator.UnzipEpub(epubDocumentPath, fileName);
        if (res == false) {
            return;
        }
        //解压成功后开始解析
    });
}
//let downResult:boolean= await DownLoader.DownLoadFile("https://www.ixdzs.com/down?id=206154&p=4", RootDir + '/epub/', TempFile+'.epub');
//main();
Operator_1.Operator.ConvertToJson(exports.RootDir + '/bookJson/');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBLHlDQUFzQztBQUd6QixRQUFBLE9BQU8sR0FBRyxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBQzVCLFFBQUEsUUFBUSxHQUFHLE1BQU0sQ0FBQztBQUUvQixTQUFlLElBQUk7O1FBRWYsV0FBVztRQUNYLElBQUksZ0JBQWdCLEdBQUcsZUFBTyxHQUFHLFFBQVEsQ0FBQztRQUMxQywrQ0FBK0M7UUFDL0MscUJBQXFCO1FBQ3JCLElBQUksUUFBUSxHQUFHLGdCQUFRLENBQUM7UUFDeEIsMEJBQTBCO1FBQzFCLElBQUk7UUFDSiw0Q0FBNEM7UUFFNUMsY0FBYztRQUNkLElBQUk7UUFDSiw0Q0FBNEM7UUFDNUMsd0JBQXdCO1FBRXhCLFVBQVU7UUFDVixJQUFJLEdBQUcsR0FBRyxNQUFNLG1CQUFRLENBQUMsU0FBUyxDQUFDLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQy9ELElBQUksR0FBRyxJQUFJLEtBQUssRUFDaEI7WUFDSSxPQUFPO1NBQ1Y7UUFFRCxXQUFXO0lBR2YsQ0FBQztDQUFBO0FBRUQsMElBQTBJO0FBRTFJLFNBQVM7QUFFVCxtQkFBUSxDQUFDLGFBQWEsQ0FBQyxlQUFPLEdBQUMsWUFBWSxDQUFDLENBQUMifQ==