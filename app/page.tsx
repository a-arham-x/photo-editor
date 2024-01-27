"use client"
import Navbar from "./components/Navbar";

export default function Home() {

  return (
    <>
      <Navbar />
      <div className="landing-page">
        <div className="row">
          <img src="/landing-page-image-1.png" alt="an image" width="500"/>
          <p>"We invite you to unleash your boundless creativity, capture fleeting moments, and entrust us with transforming your vision into an unforgettable masterpiece. Together, we'll weave the magic that brings your photographs to life."</p>
        </div>
        <div className="row">
          <p>
          "Embark on a journey where we collaborate to turn the ordinary into the extraordinary. Our platform is not just a photo editor; it's a creative sanctuary where your imagination takes center stage, and together, we paint vivid stories on the canvas of your memories."
          </p>
          <img src="/landing-page-image-2.jpg" alt="an image" width="500"/>
        </div>
        <div className="row">
          <img src="/landing-page-image-3.png" alt="An image" />
          <p>"At our core, we believe that editing is the delicate art of revealing what was once unseen. With us, your visual storytelling takes flight. Let us be your guiding hand, as together, we navigate the intricate terrain of expression, turning moments frozen in time into a symphony of emotions."</p>
        </div>
      </div>
    </>
  );
}
