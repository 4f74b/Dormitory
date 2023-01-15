const canvas = require("canvas");
const faceapi = require("@vladmandic/face-api/dist/face-api.node.js");
const FaceModel = require("../../data-models/faceModel");

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

async function uploadProfile(body) {
  body.descriptions = JSON.parse(body.descriptions);
  const data = await FaceModel({ ...body, hash: body.password });
  await data.save();
}

module.exports = uploadProfile;
