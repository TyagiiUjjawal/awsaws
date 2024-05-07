const express = require('express');
const { RekognitionClient, DetectFacesCommand } = require("@aws-sdk/client-rekognition");
const fs = require('fs');
const { promisify } = require('util');

const app = express();
const port = 4000;

app.use(express.json());

const rekognitionClient = new RekognitionClient({ region: 'ap-south-1'});

const detectFaces = async (imageBase64) => {
    try {
        const input = {
            Image: {
                Bytes: Buffer.from(imageBase64, 'base64')
            },
            Attributes: [
                "ALL"
            ]
        };

        const command = new DetectFacesCommand(input);
        const response = await rekognitionClient.send(command);
        return response.FaceDetails;
    } catch (error) {
        console.error("Error detecting faces:", error);
        throw error;
    }
};


app.post('/detectFaces', async (req, res) => {
    try {

        const imageBase64 = req.body.imageBase64;
        console.log("base64 backed",imageBase64);

        const faceDetails = await detectFaces(imageBase64);
        console.log(faceDetails);
        res.json({ success: true, faceDetails });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
