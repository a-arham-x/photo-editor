"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageCard from '../components/ImageCard'
import Link from 'next/link'

interface image {
    id: string
    imageUrl: string
}

function page() {

    const router = useRouter()

    const [images, setImages] = useState([]);

    const fetchImages = async () => {
        const response = await fetch("/api/images/get", {
            method: "GET",
            headers: {
                "user": localStorage.getItem("user") || ""
            }
        })
        const json = await response.json();
        return json.images;
    }

    useEffect(() => {
        if (!localStorage.getItem("user")) {
            router.push("/login")
        }

        const getImages = async () => {
            setImages(await fetchImages())
        }

        getImages()
    }, [])

    return (
        <>
            <Link href="/editor"><button className="auth-button" id="back-to-editor">Back to Editor</button></Link>
            {images.length == 0 && <p style={{ color: "white" }}>Getting Images...</p>}
            {images.length > 0 && images.map((image: image) => {
                return <ImageCard image={image} key={image.id} />
            })}
        </>
    )
}

export default page