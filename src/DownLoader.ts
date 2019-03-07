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
                console.log('下载超时');
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
                let rs = request(url);
                rs.on('error', () =>
                {
                    console.log('请求错误,无法下载');
                    clearTimeout(timer);
                    resolve(false);
                });
                let pi=rs.pipe(stream)
                pi.on('open', (fd: number) =>
                {
                    console.log("开始下载...");
                })

                pi.on('close', () =>
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