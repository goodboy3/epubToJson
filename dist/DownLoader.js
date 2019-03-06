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
                resolve(false);
            };
        });
        setTimeout(() => {
            dispatchTimeout();
        }, timeout);
        let downloadPromise = new Promise((resolve, reject) => {
            let stream = fs_1.default.createWriteStream(distDir + fileName);
            let rs = request_1.default(url).pipe(stream);
            rs.on('close', () => {
                console.log("下载完毕");
                resolve(true);
            });
        });
        return Promise.race([timeoutPromise, downloadPromise]);
    }
}
exports.DownLoader = DownLoader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG93bkxvYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Eb3duTG9hZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNENBQW9CO0FBQ3BCLHNEQUE4QjtBQUU5QixNQUFhLFVBQVU7SUFFbkIsTUFBTTtJQUNOLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBVSxFQUFDLE9BQWMsRUFBQyxRQUFlLEVBQUMsT0FBTyxHQUFDLEdBQUcsR0FBQyxJQUFJO1FBRTFFLElBQUksZUFBZSxHQUFZLElBQUksQ0FBQztRQUNwQyxJQUFJLGNBQWMsR0FBRyxJQUFJLE9BQU8sQ0FBVSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUUxRCxlQUFlLEdBQUcsR0FBRyxFQUFFO2dCQUVuQixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDbEIsQ0FBQyxDQUFBO1FBQ0wsQ0FBQyxDQUFDLENBQUE7UUFFRixVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ1osZUFBZSxFQUFFLENBQUM7UUFDdEIsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRVosSUFBSSxlQUFlLEdBQUcsSUFBSSxPQUFPLENBQVUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFFM0QsSUFBSSxNQUFNLEdBQUcsWUFBRSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsQ0FBQztZQUN0RCxJQUFJLEVBQUUsR0FBRyxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUVsQyxFQUFFLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7Z0JBRWhCLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3BCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUNqQixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFBO1FBQ0YsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsY0FBYyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDM0QsQ0FBQztDQUNKO0FBL0JELGdDQStCQyJ9