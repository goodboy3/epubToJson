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
const fs_1 = __importDefault(require("fs"));
const Operator_1 = require("./Operator");
const DownLoader_1 = require("./DownLoader");
exports.RootDir = __dirname + '/..';
exports.TempFile = 'temp';
function main(downloadUrl, distDir) {
    return __awaiter(this, void 0, void 0, function* () {
        //读取文件夹内的文件
        let epubDirPath = exports.RootDir + '/epubTemp/';
        let fileName = exports.TempFile;
        fs_1.default.mkdirSync(epubDirPath);
        //下载文件
        let res = yield DownLoader_1.DownLoader.DownLoadFile(downloadUrl, epubDirPath, fileName + '.epub');
        if (res == false) {
            Operator_1.Operator.DeleteTempFile(epubDirPath);
            return false;
        }
        //解压epub文件
        res = yield Operator_1.Operator.UnzipEpub(epubDirPath, fileName, epubDirPath);
        if (res == false) {
            Operator_1.Operator.DeleteTempFile(epubDirPath);
            return false;
        }
        //解压成功后开始解析
        fs_1.default.mkdirSync(distDir);
        res = yield Operator_1.Operator.ConvertToJson(epubDirPath + fileName, distDir);
        if (res == false) {
            Operator_1.Operator.DeleteTempFile(epubDirPath);
            Operator_1.Operator.DeleteTempFile(distDir);
            return false;
        }
        //完成后删除临时文件
        Operator_1.Operator.DeleteTempFile(epubDirPath);
        return true;
    });
}
main("https://www.ixdzs.com/down?id=206154&p=4", exports.RootDir + '/bookJson/');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLDRDQUFtQjtBQUNuQix5Q0FBc0M7QUFDdEMsNkNBQTBDO0FBRTdCLFFBQUEsT0FBTyxHQUFHLFNBQVMsR0FBRyxLQUFLLENBQUM7QUFDNUIsUUFBQSxRQUFRLEdBQUcsTUFBTSxDQUFDO0FBRS9CLFNBQWUsSUFBSSxDQUFDLFdBQWtCLEVBQUMsT0FBYzs7UUFFakQsV0FBVztRQUNYLElBQUksV0FBVyxHQUFHLGVBQU8sR0FBRyxZQUFZLENBQUM7UUFDekMsSUFBSSxRQUFRLEdBQUcsZ0JBQVEsQ0FBQztRQUV4QixZQUFFLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBR3pCLE1BQU07UUFDTixJQUFJLEdBQUcsR0FBRyxNQUFNLHVCQUFVLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxXQUFXLEVBQUUsUUFBUSxHQUFHLE9BQU8sQ0FBQyxDQUFDO1FBQ3RGLElBQUksR0FBRyxJQUFJLEtBQUssRUFDaEI7WUFDSSxtQkFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNyQyxPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUVELFVBQVU7UUFDVixHQUFHLEdBQUcsTUFBTSxtQkFBUSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ25FLElBQUksR0FBRyxJQUFJLEtBQUssRUFDaEI7WUFDSSxtQkFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNyQyxPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUVELFdBQVc7UUFDWCxZQUFFLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ3JCLEdBQUcsR0FBRyxNQUFNLG1CQUFRLENBQUMsYUFBYSxDQUFDLFdBQVcsR0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbEUsSUFBSSxHQUFHLElBQUksS0FBSyxFQUNoQjtZQUNJLG1CQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3JDLG1CQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2pDLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBRUQsV0FBVztRQUNYLG1CQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRXJDLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FBQTtBQUdELElBQUksQ0FBQywwQ0FBMEMsRUFBRSxlQUFPLEdBQUcsWUFBWSxDQUFDLENBQUMifQ==