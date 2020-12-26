const express = require("express");
const app = express();
const { cloudinary } = require("./utils/cloudinary");

// express.json allows you pass body data in json
app.use(express.json({ limit: "50mb" }));
// urlencoded allows you accept data from forms
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// this method is to get the list of public ids in the folder
app.get("/api/images", async (req, res) => {
    const { resources } = await cloudinary.search
        .expression("folder:dev_setups")
        .sort_by("public_id", "desc")
        .max_results(30)
        .execute();

    const publicIds = resources.map((file) => file.public_id);
    res.send(publicIds);
});

app.post("/api/upload", async (req, res) => {
    try {
        const fileStr = req.body.data;
        // method to upload to cloudinary
        const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: "dev_setups",
        });
        console.log(uploadedResponse);
        res.json({ msg: "Weldone image uploaded" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: "Something went wrong" });
    }
});

// listen on port 3001 if theres no production port
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
