import fs from 'fs';
import request from 'request';

export class DownLoader
{
    //下载文件
    static DownLoadFile(url:string,distDir:string,fileName:string,timeout=600*1000)
    {
        let dispatchTimeout:Function = null;
        let timeoutPromise = new Promise<boolean>((resolve, reject) =>
        {
            dispatchTimeout = () =>
            {
                resolve(false)
            }
        })

        setTimeout(() => {
            dispatchTimeout();
        }, timeout);

        let downloadPromise = new Promise<boolean>((resolve, reject) =>
        {
            let stream = fs.createWriteStream(distDir + fileName);
            let rs = request(url).pipe(stream)

            rs.on('close', () =>
            {
                console.log("下载完毕");
                resolve(true)
            });
        })
        return Promise.race([timeoutPromise, downloadPromise]);
    }
}