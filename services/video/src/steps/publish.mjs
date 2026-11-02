// Step 8 — Meta Graph API publisher for an Instagram Business account and a Facebook Page.
// Off by default: without --publish it only prints the requests it would send.
import { readFile, stat } from 'node:fs/promises';

const VERSION = process.env.META_GRAPH_VERSION || 'v23.0';
const GRAPH = `https://graph.facebook.com/${VERSION}`;
const RUPLOAD = 'https://rupload.facebook.com';

function plan(env, videoBytes) {
  const ig = env.META_IG_USER_ID || '<META_IG_USER_ID>';
  const page = env.META_PAGE_ID || '<META_PAGE_ID>';
  return [
    `Instagram Reel (account ${ig})`,
    `  POST ${GRAPH}/${ig}/media  media_type=REELS upload_type=resumable share_to_feed=true caption=<caption>`,
    `  POST ${RUPLOAD}/ig-api-upload/${VERSION}/<container-id>  (${videoBytes} bytes)`,
    `  GET  ${GRAPH}/<container-id>?fields=status_code  (until FINISHED)`,
    `  POST ${GRAPH}/${ig}/media_publish  creation_id=<container-id>`,
    `Facebook Reel (page ${page})`,
    `  POST ${GRAPH}/${page}/video_reels  upload_phase=start`,
    `  POST ${RUPLOAD}/video-upload/${VERSION}/<video-id>  (${videoBytes} bytes)`,
    `  POST ${GRAPH}/${page}/video_reels  upload_phase=finish video_state=PUBLISHED description=<caption>`,
  ];
}

async function graph(method, pathAndQuery, params, token) {
  const url = new URL(`${GRAPH}/${pathAndQuery}`);
  const body = new URLSearchParams({ ...params, access_token: token });
  const res = method === 'GET'
    ? await fetch(`${url}${url.search ? '&' : '?'}${body}`)
    : await fetch(url, { method, body });
  const json = await res.json();
  if (!res.ok || json.error) throw new Error(`Graph ${method} ${url.pathname}: ${JSON.stringify(json.error ?? json)}`);
  return json;
}

async function uploadBinary(url, video, token) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `OAuth ${token}`, offset: '0', file_size: String(video.length) },
    body: video,
  });
  const json = await res.json();
  if (!res.ok || json.error) throw new Error(`Upload to ${url}: ${JSON.stringify(json.error ?? json)}`);
  return json;
}

async function publishInstagram(env, video, caption) {
  const { META_IG_USER_ID: ig, META_ACCESS_TOKEN: token } = env;
  const container = await graph('POST', `${ig}/media`, { media_type: 'REELS', upload_type: 'resumable', share_to_feed: 'true', caption }, token);
  await uploadBinary(`${RUPLOAD}/ig-api-upload/${VERSION}/${container.id}`, video, token);
  for (let i = 0; i < 60; i++) {
    const { status_code: status } = await graph('GET', container.id, { fields: 'status_code' }, token);
    if (status === 'FINISHED') break;
    if (status === 'ERROR' || status === 'EXPIRED') throw new Error(`Instagram processing ${status}`);
    await new Promise((r) => setTimeout(r, 5000));
  }
  const { id } = await graph('POST', `${ig}/media_publish`, { creation_id: container.id }, token);
  return id;
}

async function publishFacebook(env, video, caption) {
  const { META_PAGE_ID: page, META_ACCESS_TOKEN: token } = env;
  const { video_id: videoId, upload_url: uploadUrl } = await graph('POST', `${page}/video_reels`, { upload_phase: 'start' }, token);
  await uploadBinary(uploadUrl, video, token);
  await graph('POST', `${page}/video_reels`, { upload_phase: 'finish', video_id: videoId, video_state: 'PUBLISHED', description: caption }, token);
  return videoId;
}

export async function publish({ videoFile, caption, live }) {
  const env = process.env;
  const { size } = await stat(videoFile);
  if (!live) {
    console.log('Dry run — nothing was posted. With --publish this would send:');
    for (const line of plan(env, size)) console.log(`  ${line}`);
    console.log('  Caption:\n' + caption.split('\n').map((l) => `    ${l}`).join('\n'));
    return null;
  }

  const missing = ['META_ACCESS_TOKEN', 'META_IG_USER_ID', 'META_PAGE_ID'].filter((k) => !env[k]);
  if (missing.length) throw new Error(`--publish needs ${missing.join(', ')} in .env`);
  const video = await readFile(videoFile);
  const instagram = await publishInstagram(env, video, caption);
  console.log(`  Instagram media id: ${instagram}`);
  const facebook = await publishFacebook(env, video, caption);
  console.log(`  Facebook video id: ${facebook}`);
  return { instagram, facebook };
}
