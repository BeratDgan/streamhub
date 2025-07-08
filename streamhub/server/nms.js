import 'dotenv/config';
import {connectDB} from './db.js';
await connectDB();
import User from './models/User.js';
import NodeMediaServer from 'node-media-server';
import mongoose from 'mongoose';



const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: 8000,
    allow_origin: '*',
    mediaroot: './media',
  },
  trans: {
    ffmpeg: 'C:/ffmpeg/bin/ffmpeg.exe',
    tasks: [
      {
        app: 'live',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        dash: false,
      },
    ],
  },
};

const nms = new NodeMediaServer(config);

nms.on('prePublish', async (id, StreamPath, args) => {
  const streamKey = StreamPath.split('/')[2];
  console.log('Gelen streamKey:', streamKey);
  const user = await User.findOne({ streamKey });
  console.log('Bulunan user:', user);
  if (!user) {
    const session = nms.getSession(id);
    session.reject();
    console.log(`Stream Rejected: invalid streamKey (${streamKey})`);
  } else {
    console.log(`Stream Accepted: ${user.username} (${streamKey})`);
  }
});

nms.run();

export default nms;