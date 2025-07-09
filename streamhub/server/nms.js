import 'dotenv/config';
import {connectDB} from './db.js';
await connectDB();
import User from './models/User.js';
import Stream from './models/Stream.js';
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
  console.log('streamKey:', streamKey);


  const user = await User.findOneAndUpdate(
    { streamKey },
    { isLive: true },
    { new: true }
  );
  console.log('Finded user:', user);

 
  await Stream.findOneAndUpdate(
    { streamKey },
    { isLive: true }
  );

  if (!user) {
    const session = nms.getSession(id);
    session.reject();
    console.log(`Stream Rejected: invalid streamKey (${streamKey})`);
  } else {
    await Stream.findOneAndUpdate(
      { user: user._id },
      { 
        user: user._id,
        streamKey: streamKey,
        title: "Live Stream",
        startedAt: new Date(),
        isLive: true 
      },
      { upsert: true, new: true }
    );
    console.log(`Stream Accepted: ${user.username} (${streamKey})`);
  }
});


nms.on('donePublish', async (id, StreamPath, args) => {
  const streamKey = StreamPath.split('/')[2];

  await User.findOneAndUpdate(
    { streamKey },
    { isLive: false }
  );

  await Stream.findOneAndUpdate(
    { streamKey },
    { isLive: false }
  );

  console.log(`Stream ended for streamKey: ${streamKey}`);
});

nms.run();

export default nms;