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
                console.log('下载超时');
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
                let rs = request_1.default(url);
                rs.on('error', () => {
                    console.log('请求错误,无法下载');
                    clearTimeout(timer);
                    resolve(false);
                });
                let pi = rs.pipe(stream);
                pi.on('open', (fd) => {
                    console.log("开始下载...");
                });
                pi.on('close', () => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG93bkxvYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Eb3duTG9hZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNENBQW9CO0FBQ3BCLHNEQUE4QjtBQUU5QixNQUFhLFVBQVU7SUFFbkIsTUFBTTtJQUNOLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBVSxFQUFDLE9BQWMsRUFBQyxRQUFlLEVBQUMsT0FBTyxHQUFDLEdBQUcsR0FBQyxJQUFJO1FBRTFFLElBQUksZUFBZSxHQUFZLElBQUksQ0FBQztRQUNwQyxJQUFJLGNBQWMsR0FBRyxJQUFJLE9BQU8sQ0FBVSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUUxRCxlQUFlLEdBQUcsR0FBRyxFQUFFO2dCQUVuQixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNwQixZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3BCLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNsQixDQUFDLENBQUE7UUFDTCxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUksS0FBSyxHQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDdEIsZUFBZSxFQUFFLENBQUM7WUFDbEIsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNqQixDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFWixJQUFJLGVBQWUsR0FBRyxJQUFJLE9BQU8sQ0FBVSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUUzRCxJQUFJO2dCQUNBLElBQUksTUFBTSxHQUFHLFlBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLENBQUM7Z0JBQ3RELElBQUksRUFBRSxHQUFHLGlCQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3RCLEVBQUUsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtvQkFFaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFDekIsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNwQixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ25CLENBQUMsQ0FBQyxDQUFDO2dCQUNILElBQUksRUFBRSxHQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7Z0JBQ3RCLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBVSxFQUFFLEVBQUU7b0JBRXpCLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzNCLENBQUMsQ0FBQyxDQUFBO2dCQUVGLEVBQUUsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtvQkFFaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDcEIsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNwQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBQ2pCLENBQUMsQ0FBQyxDQUFDO2FBQ047WUFBQyxPQUFPLEtBQUssRUFDZDtnQkFDSSxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUE7Z0JBQ25CLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTthQUNqQjtRQUVMLENBQUMsQ0FBQyxDQUFBO1FBQ0YsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsY0FBYyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDM0QsQ0FBQztDQUNKO0FBckRELGdDQXFEQyJ9