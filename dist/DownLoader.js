"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const request_1 = __importDefault(require("request"));
class DownLoader {
    //下载文件
    static DownLoadFile(url, distDir, fileName, timeout = 600 * 1000) {
        let dispatchTimeout = null;
        let timeoutPromise = new Promise((resolve, reject) => {
            dispatchTimeout = () => {
                console.log('无法完成下载');
                clearTimeout(timer);
                resolve(false);
            };
        });
        let timer = setTimeout(() => {
            dispatchTimeout();
            timer = null;
        }, timeout);
        let downloadPromise = new Promise((resolve, reject) => {
            try {
                let stream = fs_1.default.createWriteStream(distDir + fileName);
                let rs = request_1.default(url).pipe(stream);
                rs.on('open', (fd) => {
                    console.log("开始下载...");
                });
                rs.on('close', () => {
                    console.log("下载完毕");
                    clearTimeout(timer);
                    resolve(true);
                });
            }
            catch (error) {
                clearTimeout(timer);
                resolve(false);
            }
        });
        return Promise.race([timeoutPromise, downloadPromise]);
    }
}
exports.DownLoader = DownLoader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG93bkxvYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Eb3duTG9hZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNENBQW9CO0FBQ3BCLHNEQUE4QjtBQUU5QixNQUFhLFVBQVU7SUFFbkIsTUFBTTtJQUNOLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBVSxFQUFDLE9BQWMsRUFBQyxRQUFlLEVBQUMsT0FBTyxHQUFDLEdBQUcsR0FBQyxJQUFJO1FBRTFFLElBQUksZUFBZSxHQUFZLElBQUksQ0FBQztRQUNwQyxJQUFJLGNBQWMsR0FBRyxJQUFJLE9BQU8sQ0FBVSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUUxRCxlQUFlLEdBQUcsR0FBRyxFQUFFO2dCQUVuQixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN0QixZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3BCLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNsQixDQUFDLENBQUE7UUFDTCxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUksS0FBSyxHQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDdEIsZUFBZSxFQUFFLENBQUM7WUFDbEIsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNqQixDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFWixJQUFJLGVBQWUsR0FBRyxJQUFJLE9BQU8sQ0FBVSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUUzRCxJQUFJO2dCQUNBLElBQUksTUFBTSxHQUFHLFlBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLENBQUM7Z0JBQ3RELElBQUksRUFBRSxHQUFHLGlCQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO2dCQUNsQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQVUsRUFBRSxFQUFFO29CQUV6QixPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUMzQixDQUFDLENBQUMsQ0FBQTtnQkFFRixFQUFFLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7b0JBRWhCLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ3BCLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDcEIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO2dCQUNqQixDQUFDLENBQUMsQ0FBQzthQUNOO1lBQUMsT0FBTyxLQUFLLEVBQ2Q7Z0JBQ0ksWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFBO2dCQUNuQixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7YUFDakI7UUFFTCxDQUFDLENBQUMsQ0FBQTtRQUNGLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLGNBQWMsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBQzNELENBQUM7Q0FDSjtBQTlDRCxnQ0E4Q0MifQ==