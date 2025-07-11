import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import Stream from "../models/Stream.js";


const router = Router();

router.post("/start" ,verifyToken, async (req, res) => {
    try{
        if(!req.user.isStreamer){
            return res.status(403).json({ message: 'Only Streamers can go live' });
        }

        // checking for is that user has an existing stream
        const existingStream = await Stream.findOne({ user: req.user.id, isLive: true });
        if (existingStream) {
            return res.status(409).json({ message: "Already has an existing stream" });
        }

        //Create Stream register
        const stream = new Stream({
                user: req.user.id,
                title: req.body.title || "Untitled Stream",
                startedAt: new Date(),
                isLive: true,
                streamKey: req.user.streamKey
        });

        await stream.save();

        res.status(201).json({
            message: "Stream Started",
            stream
        });

    }catch(err)
    {
        res.status(500).json({ error: err.message });

    }    
});

router.post("/stop",verifyToken,async(req,res)=>{
    try{
        // checking for is that user has an existing stream
        const existingStream = await Stream.findOne({ user: req.user.id, isLive: true });
        if (!existingStream) {
            return res.status(409).json({ message: "there are no stream available" });
        }

        existingStream.isLive = false;
        await existingStream.save();

        res.status(201).json({
            message: "Stream Ended",
            stream: existingStream
        });
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
});


router.get("/active", async(req,res)=>{
    try {
        // isLive: find all 'true' streams
        const activeStreams = await Stream.find({ isLive: true }).populate("user", "username email");
        res.status(200).json({ streams: activeStreams });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.put("/update-title", verifyToken, async (req, res) => {
    try {
        const { title } = req.body;
        
        if (!title || !title.trim()) {
            return res.status(400).json({ message: 'Title is required' });
        }

        // Update the user's current live stream title
        const stream = await Stream.findOneAndUpdate(
            { user: req.user.id, isLive: true },
            { title: title.trim() },
            { new: true }
        );

        if (!stream) {
            return res.status(404).json({ message: 'No active stream found' });
        }

        res.json({
            message: "Stream title updated successfully",
            stream
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;