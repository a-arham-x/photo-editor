"use client"
import React, { useState, useEffect } from "react";
import { fabric } from "fabric";
import FilterModel from "../components/FilterModel";


export default function Editor() {
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const [isCropping, setIsCropping] = useState<Boolean>(false);
  const [cropRect, setCropRect] = useState<fabric.Rect>();
  const [setshowFilterModal, setsetshowFilterModal] = useState<any>(false);
  const [showBrightnessSlider, setShowBrightnessSlider] = useState<string>("none");
  const [brightness, setBrightness] = useState<number>(0)
  const [showCroppingDone, setShowCroppingDone] = useState<boolean>(false);

  useEffect(() => {
    var c = new fabric.Canvas("canvas", {
      height: 600,
      width: 800,
      backgroundColor: "#041E42"
    })
  
    setCanvas(c);;

    return () => {
      c.dispose();
    };
  }, []);
  const setImage = () => {

    fabric.Image.fromURL("/whitebread.jfif", function (img) {
      // Set the position and size of the image
      img.set({
        centeredRotation: true,
        left: 0,
        top: 0,
      });

      if (canvas?.width && canvas?.height && img?.height && img?.width){
        img.set({
          scaleX: canvas.width / img.width,
          scaleY: canvas.height / img.height,
        })
      }

      // Add the image to the canvas
      canvas?.add(img);

      // Render the canvas
      canvas?.renderAll();
    });
  };

  const getImageObject = (): fabric.Image | undefined => {
    if (canvas) {
      const objects = canvas.getObjects();
      const imageObject = objects.find((obj) => obj instanceof fabric.Image) as fabric.Image | undefined;
      return imageObject;
    }
    return undefined;
  };

  const openFilterModal = ()=>{
    const imageObject = getImageObject();
    if (imageObject){
      setsetshowFilterModal(true)
    }
  }

  const convertToGrayScale = () => {
    const imageObject = getImageObject();
    removeImage();
    if (imageObject) {
      imageObject.filters?.push(new fabric.Image.filters.Grayscale());
      imageObject.applyFilters();
      canvas?.add(imageObject)
    }
  }

  const goSepia = () => {
    const imageObject = getImageObject();
    removeImage();
    if (imageObject) {
      imageObject.filters?.push(new fabric.Image.filters.Sepia());
      imageObject.applyFilters();
      canvas?.add(imageObject)
    }
  }

  const changeBrightness = (event:any) => {
    const imageObject = getImageObject();

  if (imageObject) {
    let filter;
    if (brightness<parseInt(event.target.value)){
      filter = new fabric.Image.filters.Brightness({
        brightness: 0.05
      });
    }else{
      filter = new fabric.Image.filters.Brightness({
        brightness: -0.05
      });
    }
    imageObject.filters?.push(filter);
    imageObject.applyFilters();
    setBrightness(parseInt(event.target.value))
    // Render the canvas to reflect the changes

    canvas?.renderAll();
  }
  }

  const discardChanges = () => {
    if (isCropping){
      setIsCropping(false);
      setShowCroppingDone(false)
      if (cropRect)
      canvas?.remove(cropRect);
    }
    removeImage();
    setImage();
  }

  const rotateImage = () => {
    const imageObject = getImageObject();

    if (imageObject && canvas?.width && canvas?.height && imageObject.width && imageObject.height) {
      // console.log(imageObject.left)
      // console.log(imageObject.top)
      console.log(canvas.width-imageObject.height)
        console.log(canvas.width)
        console.log(imageObject.height/canvas.height);
      canvas?.renderAll();
      if (imageObject.angle==0){
        imageObject.set({ angle: 90, left: 0.875*canvas.width, top: 0});
        canvas?.renderAll();
        return; 
      }

      if (imageObject.angle==90){
        imageObject.set({ angle: 180, left: canvas.width, top: canvas.height});  
        canvas?.renderAll();
        return; 
      }

      if (imageObject.angle==180){
        imageObject.set({ angle: 270, left: 0.125*canvas.width, top: canvas.height});  
        canvas?.renderAll();
        return; 
      }   
      
      if (imageObject.angle==270){
        imageObject.set({ angle: 0, left: 0, top: 0});  
        canvas?.renderAll();
        return; 
      }   
      
    }
  };

  const applyContrast = ()=>{
    const imageObject = getImageObject();
    console.log("contrast")
    var filter = new fabric.Image.filters.Contrast({
      contrast: 0.25
    });
    imageObject?.filters?.push(filter);
    imageObject?.applyFilters();
    canvas?.renderAll();  
  }

  const startCropping = ()=>{
    setIsCropping(true);
    setShowCroppingDone(true);
    const imageObject = getImageObject();
    if (!imageObject){
      return
    }
    if (isCropping){
      setIsCropping(false);
      setShowCroppingDone(false);
      if (cropRect){
        canvas?.remove(cropRect)
      }
      canvas?.renderAll();
    }
    else{
      const currentRect = new fabric.Rect({
        left: 0,
        top: 0,
        width: canvas?.width?canvas.width-1:359,
        height: canvas?.height?canvas.height-1:359,
        fill: 'transparent',
        stroke: 'red',
        strokeWidth: 2,
      });

      
      setCropRect(currentRect)
      canvas?.add(currentRect);
    }
  }


  const removeImage = () => {
    var object = getImageObject();
    if (!object){
        window.alert('Please select the element to remove');
        return '';
    }
    setIsCropping(false)
    setShowCroppingDone(false)
    canvas?.remove(object);
  };

  const toggleBrightnessSlider = ()=>{
    if (showBrightnessSlider=="none"){
      setShowBrightnessSlider("flex")
    }else if (showBrightnessSlider=="flex"){
      setShowBrightnessSlider("none")
      setBrightness(0);
    }
  }

  // const discardBrightnessChanges = ()=>{
  //   setBrightness(0);
  //   var filter = new fabric.Image.filters.Brightness({
  //     brightness: 0
  //   });
  //   const imageObject = getImageObject();
  //   imageObject?.filters?.push(filter);
  //   imageObject?.applyFilters();
  //   canvas?.renderAll();
  // }

  const handleDownload = async () => {
    try {
      const imageObject = getImageObject();
      if (!imageObject) {
        return;
      }
  
      // Get the image data URL from the canvas
      const imageDataURL = imageObject?.toDataURL({ format: 'png', multiplier: 2 });
  
      if (!imageDataURL) {
        window.alert("Download Failed");
        return;
      }
  
      // Convert the data URL to a Blob
      const blob = await fetch(imageDataURL).then((res) => res.blob());
  
      // Create a download link
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
  
      // Set the filename for the download
      const fileName = 'canvas_image.png'; // Change the filename as needed
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
  
      // Trigger the download
      link.click();
  
      // Clean up
      link.remove();
    } catch (error) {
      console.error(error);
      window.alert("Download Failed");
    }
  };

  const crop = ()=>{
    if (!isCropping){return}
    const imageObject = getImageObject();
    if (imageObject){
      if (!imageObject?.height || !imageObject?.width || !cropRect?.height || !cropRect?.width){return;}
      var clipPath = new fabric.Rect({
        left: cropRect?.left?((imageObject?.width/cropRect?.width)*cropRect?.left)-(imageObject.width/2):0,
        top: cropRect?.top?((imageObject.height/cropRect.height)*cropRect.top)-(imageObject.height/2):0,
        width:cropRect?.getScaledWidth()?cropRect.getScaledWidth()*(imageObject?.width/cropRect?.width):imageObject?.width,
        height: cropRect?.getScaledHeight()?cropRect.getScaledHeight()*(imageObject.height/cropRect.height):imageObject?.height
      })
      // console.log(cropRect?.width*0.6)
      imageObject.clipPath=clipPath
      console.log(imageObject.getScaledWidth(), imageObject.getScaledHeight(), cropRect.getScaledHeight(), cropRect.getScaledWidth())
      console.log(canvas?.width, canvas?.height)
      canvas?.remove(cropRect);
      canvas?.renderAll();
      // if (cropRect?.left && cropRect?.height && canvas?.width && canvas?.height){
      //   removeImage();
      //   console.log("Duz Duz")
      //   const imageDataURL = imageObject?.toDataURL({ format: 'png', multiplier: 2 });
      //   fabric.Image.fromURL(imageDataURL, function(img){
      //     img.set({
      //       centeredRotation: true,
      //       left: 0,
      //       top: 0,
      //     });
    
      //     // if (canvas?.width && canvas?.height && img?.height && img?.width){
      //     //   img.set({
      //     //     scaleX: canvas.width / img.width,
      //     //     scaleY: canvas.height / img.height,
      //     //   })
      //     // }
    
      //     // Add the image to the canvas
      //     canvas?.add(img);
      //   })
      // }
    }
    console.log(imageObject?.left, imageObject?.top)
    setShowCroppingDone(false)
   canvas?.renderAll();
  }

  const resizeImage = ()=>{
    const imageObject = getImageObject();
    console.log(imageObject?.width, imageObject?.height)
    if (imageObject && canvas?.width && canvas?.height && imageObject.width && imageObject.height){
      const originalWidth = canvas?.width;
      const originalHeight = canvas?.height;
      canvas?.setWidth(originalWidth*0.5);
      canvas?.setHeight(originalHeight*0.5);
      imageObject.set({
        scaleX: canvas.width / imageObject.width,
        scaleY: canvas.height / imageObject.height,
      })
    }
    canvas?.renderAll();
  }

  return (
    <>
    <div className="editing-page">
    <nav>
      <button className="edit-button" onClick={setImage}>Choose file</button>
      <button className="edit-button" onClick={openFilterModal}>Filter</button>
      <button className="edit-button" onClick={toggleBrightnessSlider}>Brightness</button>
      <div className="brightness-slider" style={{display: showBrightnessSlider}}>
      <input type="range" min="-20" max="20" onChange={changeBrightness} value={brightness.toString()}/>
      <button>Discard</button>
      </div>
      <button className="edit-button" onClick={rotateImage}>Rotate Image</button>
      <button className="edit-button" onClick={applyContrast}>Contrast</button>
      <button className="edit-button" onClick={startCropping}>Crop</button>
      <button onClick={crop} style={{display:showCroppingDone?"block":"none"}} className="crop-button">Done</button>
      <button className="edit-button" onClick={resizeImage}>Resize</button>
      <button className="edit-button" onClick={discardChanges}>Discard Changes</button>
      <button className="edit-button" onClick={removeImage}>Remove Image</button>
      <button className="edit-button" onClick={handleDownload}>Download Image</button>
    </nav>
    <canvas id="canvas" />
    <div className="editing-buttons">
    </div>
    </div>
    {setshowFilterModal && <FilterModel showModal={setsetshowFilterModal} convertToGrayScale={convertToGrayScale} goSepia={goSepia}/>}
    </>
  );
}
