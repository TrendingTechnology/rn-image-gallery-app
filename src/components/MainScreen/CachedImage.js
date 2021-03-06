import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import shorthash from "shorthash";
import * as FileSystem from "expo-file-system";

const CachedImage = ({ style, uri, reRender }) => {
  const [source, setSource] = useState({});

  //reRender is a state which is controlled by mainScreen.js for re-rendering images.
  useEffect(() => {
    cacheCheck();
  }, [reRender]);

  const cacheCheck = async () => {
    //shortash generate unique hashid for long uri path.
    const shortName = shorthash.unique(uri);
    console.log("Image hashed ID:", shortName);

    const path = `${FileSystem.cacheDirectory}${shortName}`;
    //Read from cache
    const image = await FileSystem.getInfoAsync(path);

    if (image.exists) {
      console.log("read image from cache");
      const uri = image.uri;
      setSource({ uri: uri });
      return;
    }
    console.log("downloading image to cache");
    //Downloading to cache
    const newImage = await FileSystem.downloadAsync(uri, path);
    const newUri = newImage.uri;
    setSource({ uri: newUri });
  };

  return <Image style={style} source={source} />;
};
export default CachedImage;
