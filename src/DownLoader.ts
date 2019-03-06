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
                console.log('无法完成下载');
                clearTimeout(timer);
                resolve(false)
            }
        })

        let timer=setTimeout(() => {
            dispatchTimeout();
            timer = null;
        }, timeout);

        let downloadPromise = new Promise<boolean>((resolve, reject) =>
        {
            try {
                let stream = fs.createWriteStream(distDir + fileName);
                let rs = request(url).pipe(stream)
                rs.on('open', (fd: number) =>
                {
                    console.log("开始下载...");
                })

                rs.on('close', () =>
                {
                    console.log("下载完毕");
                    clearTimeout(timer);
                    resolve(true)
                });
            } catch (error)
            {
                clearTimeout(timer)
                resolve(false)
            }
            
        })
        return Promise.race([timeoutPromise, downloadPromise]);
    }
}