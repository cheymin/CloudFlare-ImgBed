// /functions/_middleware.js

/*
 *                         _oo0oo_
 *                        o8888888o
 *                        88" . "88
 *                        (| -_- |)
 *                        0\  =  /0
 *                      ___/`---'\___
 *                    .' \\|     |// '.
 *                   / \\|||  :  |||// \
 *                  / _||||| -:- |||||- \
 *                 |   | \\\  - /// |   |
 *                 | \_|  ''\---/''  |_/ |
 *                 \  .-\__  '-'  ___/-. /
 *               ___'. .'  /--.--\  `. .'___
 *            ."" '<  `.___\_<|>_/___.' >' "".
 *           | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *           \  \ `_.   \_ __\ /__ _/   .-` /  /
 *       =====`-.____`.___ \_____/___.-`___.-'=====
 *                         `=---='
 * 
 *       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *                      佛祖保佑       
 *                      永无BUG      
 *                      Cache Hit 100% 
 *                      KV Read 降低99%
 */
// /functions/_middleware.js
// 针对大文件的智能缓存
export async function onRequest(context) {
  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';
  const fileSize = response.headers.get('content-length') || 0;
  
  // 根据不同文件类型设置不同缓存策略
  if (contentType.startsWith('video/') || fileSize > 100 * 1024 * 1024) {
    // 大视频：缓存30天，允许断点续传
    const headers = new Headers(response.headers);
    headers.set('Cache-Control', 'public, max-age=2592000');
    headers.set('Accept-Ranges', 'bytes');  // 支持断点续传
    return new Response(response.body, { headers });
  }
  
  if (contentType.startsWith('image/')) {
    // 图片：缓存7天
    const headers = new Headers(response.headers);
    headers.set('Cache-Control', 'public, max-age=604800');
    return new Response(response.body, { headers });
  }
  
  return response;
}
