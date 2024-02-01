import Image from 'next/image'
import React from 'react'

function ImageCard(props: any) {
  const {image, } = props;
  const deleteImage = async ()=>{
    const response = await fetch(`/api/images/delete/${image.id}`, {
      method: "DELETE",
      headers: {
        "user": localStorage.getItem("user") || ""
      }
    })
    const json = await response.json();
    window.alert(json.message);
  }
  return (
    <div className="image-card">
        <Image src={image.imageUrl} alt="An image" width="500" height="500"></Image>
        <Image src="/delete.png" alt="deleltion icon" width="40" height="40" style={{cursor: "pointer"}} onClick={deleteImage}></Image>
    </div>
  )
}

export default ImageCard