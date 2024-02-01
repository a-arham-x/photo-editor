"use client"
import React, { useState, useEffect } from "react";
import { fabric } from "fabric";
import FilterModal from "../components/FilterModal";
import { useRouter } from "next/navigation";
import axios from "axios";

interface user {
  id: number,
  name: string,
  email: string,
  time_created: Date
}

export default function Editor(props: any) {
  const [user, setUser] = useState<user>();
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const [isCropping, setIsCropping] = useState<Boolean>(false);
  const [cropRect, setCropRect] = useState<fabric.Rect>();
  const [setshowFilterModal, setsetshowFilterModal] = useState<any>(false);
  const [showBrightnessSlider, setShowBrightnessSlider] = useState<string>("none");
  const [brightness, setBrightness] = useState<number>(0)
  const [showCroppingDone, setShowCroppingDone] = useState<boolean>(false);
  const [size, setSize] = useState<number>(1);
  const [showResizeSlider, setShowResizeSlider] = useState<string>("none");
  const [openImage, setOpenImage] = useState<string>();
  const [fileInputVisible, setFileInputVisible] = useState<boolean>(true);
  const [imageUploading, setImageUploading] = useState(false);
  
  const CANVAS_WIDTH = 640
  const CANVAS_HEIGHT = 480

  const router = useRouter();

  const fetchUser = async ()=>{
    console.log(localStorage.getItem("user"))
    const response = await fetch("/api/user", {
      method: "GET", 
      headers: {
        "user": localStorage.getItem("user") || ""
      }
    })
    const json = await response.json();
    return json.user as user
  }

  useEffect(() => {
    if (!localStorage.getItem("user")){
      router.push("/login")
    }

    if (props.imageUrl){
      setOpenImage(props.imageUrl)
      setImage()
    }

    const getUser = async ()=>{
      setUser(await fetchUser());
    }

    getUser();

    console.log(user);
    var c = new fabric.Canvas("canvas", {
      height: CANVAS_HEIGHT,
      width: CANVAS_WIDTH,
      backgroundColor: "#041E42"
    })
  
    setCanvas(c);;

    return () => {
      c.dispose();
    };
  }, []);

  const selectImage = (e: any)=>{
    const imageObject = getImageObject();
    
    if (imageObject){return}
    let imageFile = e.target.files[0]
    const allowedExtensions = ["png", "jpeg", "jpg", "jfif"];
    console.log(e.target.files[0])
    const fileExtension = e.target.files[0].name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)){
      (document.getElementById("file-input") as HTMLInputElement).value = "";
      window.alert("Only files of type png, jpeg, jpg and jfif are accepteable");
      return;
    }
    let reader = new FileReader;
    reader.readAsDataURL(imageFile);
    reader.onload = (event: any)=>{
      fabric.Image.fromURL(event.target.result, function (img) {
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

        setOpenImage(event.target.result);
        (document.getElementById("file-input") as HTMLInputElement).value = "";
        setFileInputVisible(false)
  
        // Add the image to the canvas
        canvas?.add(img);
  
        // Render the canvas
        canvas?.renderAll();
      });
    }
  }

  const setImage = () => {
    if (!openImage){return}
    fabric.Image.fromURL(openImage, function (img) {
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
    setFileInputVisible(false)
    if (imageObject) {
      imageObject.filters?.push(new fabric.Image.filters.Grayscale());
      imageObject.applyFilters();
      canvas?.add(imageObject)
    }
  }

  const goSepia = () => {
    const imageObject = getImageObject();
    removeImage();
    setFileInputVisible(false)
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
    setFileInputVisible(false)
    canvas?.setWidth(CANVAS_WIDTH);
    canvas?.setHeight(CANVAS_HEIGHT);
    setSize(1);
    setShowBrightnessSlider("none");
    setShowResizeSlider("none")
    setImage();
  }

  const rotateImage = () => {
    const imageObject = getImageObject();

    if (imageObject && canvas?.width && canvas?.height && imageObject.width && imageObject.height) {
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
    canvas?.setWidth(CANVAS_WIDTH);
    canvas?.setHeight(CANVAS_HEIGHT);
    setIsCropping(false)
    setShowCroppingDone(false)
    setFileInputVisible(true)
    canvas?.remove(object);
  };

  const toggleBrightnessSlider = ()=>{
    const imageObject = getImageObject();
    if (!imageObject){return}
    if (showBrightnessSlider=="none"){
      setShowBrightnessSlider("flex")
    }else if (showBrightnessSlider=="flex"){
      setShowBrightnessSlider("none")
      setBrightness(0);
    }
  }

  const toggleResizeSlider = ()=>{
    const imageObject = getImageObject();
    if (!imageObject){return}
    if (showResizeSlider=="none"){
      setShowResizeSlider("flex")
    }else if (showResizeSlider=="flex"){
      setShowResizeSlider("none")
    }
  }

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
      imageObject.clipPath=clipPath
      canvas?.remove(cropRect);
      // imageObject.set({width: cropRect.getScaledWidth()*(imageObject?.width/cropRect?.width), height: cropRect.getScaledHeight()*(imageObject.height/cropRect.height)})
      // canvas?.setWidth(cropRect.getScaledWidth()*(imageObject?.width/cropRect?.width))
      // canvas?.setHeight(cropRect.getScaledHeight()*(imageObject.height/cropRect.height))
      // if (canvas?.width && canvas?.height){
      //   imageObject.set({
      //     scaleX: canvas?.width / imageObject.width,
      //     scaleY: canvas?.height / imageObject.height,
      //     top: 0, left: 0
      //   })
      // }

      canvas?.renderAll();
    }
    setShowCroppingDone(false)
   canvas?.renderAll();
  }

  const resizeImage = (e: any)=>{
    setSize(e.target.value/6);
    const imageObject = getImageObject();
    if (imageObject && canvas?.width && canvas?.height && imageObject.width && imageObject.height){
      canvas?.setWidth(CANVAS_WIDTH*size);
      canvas?.setHeight(CANVAS_HEIGHT*size);
      imageObject.set({
        scaleX: canvas.width / imageObject.width,
        scaleY: canvas.height / imageObject.height,
      })
    }
    canvas?.renderAll();
  }

  const dataURItoFile = (dataURI: string, fileName: string) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: mimeString });
    return new File([blob], fileName, { type: mimeString });
  };

  const saveImage = async ()=>{
    const imageObject = getImageObject();
      if (!imageObject) {
        return;
      }
      setImageUploading(true)
      // Get the image data URL from the canvas
      const imageDataURL = imageObject?.toDataURL({ format: 'png', multiplier: 2 });
      const file = dataURItoFile(imageDataURL, "image.png")
      var data = new FormData();

      data.append("image", file);

      const response = await axios({
        url: "/api/images/save",
        method: "POST",
        headers: {
          "user": localStorage.getItem("user")
        },
        data
      })
      const json = response.data;
      setImageUploading(false)
      window.alert(json.message)
  }

  const openSaved = ()=>{
    router.push("/saved")
  }

  const logOut = ()=>{
    localStorage.setItem("user", "");
    router.push("/login")
  }

  return (
    <>
    <div className="editing-page">
    <nav className="editor-nav">
      <button className="edit-button" onClick={openFilterModal}>Filter</button>
      <button className="edit-button" onClick={toggleBrightnessSlider}>Brightness</button>
      <div className="brightness-slider" style={{display: showBrightnessSlider}}>
      <input type="range" min="-20" max="20" onChange={changeBrightness} value={brightness.toString()}/>
      <button>Discard</button>
      </div>
      <button className="edit-button" onClick={rotateImage}>Rotate Image</button>
      <button className="edit-button" onClick={applyContrast}>Contrast</button>
      <button className="edit-button" onClick={startCropping}>Crop</button>
      <button onClick={crop} style={{display:showCroppingDone?'block':'none'}} className="crop-button">Done</button>
      <button className="edit-button" onClick={toggleResizeSlider}>Resize</button>
      <div className="resize-slider" style={{display:showResizeSlider}}>
      <input type="range" min="1" max="12" onChange={resizeImage} value={(size*6).toString()}/>
      </div>
      <button className="edit-button" onClick={discardChanges}>Discard Changes</button>
      <button className="edit-button" onClick={removeImage}>Remove Image</button>
      <button className="edit-button" onClick={saveImage}>Save Image</button>
      {imageUploading && <p style={{color: 'white'}}>Saving Image...</p>}
      <button className="edit-button" onClick={handleDownload}>Download Image</button>
    </nav>
    <h1 className="user-name">{user?.name}</h1>
    <div className="canvas-container">
    <input type="file" id="file-input" style={{display:fileInputVisible?'block':'none', color: 'white'}} onChange={selectImage} accept="png, jpeg, jpg, jfif"/>
    <canvas id="canvas" />
    </div>
    <button className="auth-button" onClick={openSaved}>Saved</button>
    <button className="auth-button" onClick={logOut}>Logout</button>
    </div>
    {setshowFilterModal && <FilterModal showModal={setsetshowFilterModal} convertToGrayScale={convertToGrayScale} goSepia={goSepia}/>}
    </>
  );
}
