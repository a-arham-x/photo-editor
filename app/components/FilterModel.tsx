"use client"
import React, {useState} from 'react'
import Image from 'next/image';

function FilterModel(props:any) {
    const { showModal, convertToGrayScale, goSepia} = props;

    const [selectedFilter, setSelectedFilter] = useState<String>();

    const [borderGray, setBorderGray] = useState<any>("none");
    const [borderSepia, setBorderSepia] = useState<any>("none");

    const selectGray = ()=>{
        setSelectedFilter("Gray");
        setBorderGray("2px solid red");
        setBorderSepia("none")
    }

    const selectSepia = ()=>{
        setSelectedFilter("Sepia");
        setBorderGray("none");
        setBorderSepia("2px solid red")
    }

    const applyFilter = ()=>{
        if (selectedFilter=="Gray"){
            convertToGrayScale()
        }
        if (selectedFilter=="Sepia"){
            goSepia()
        }
        showModal(false)
    }

    const closeModal = ()=>{
        showModal(false)
    }
  return (
    <div className="modal-wrapper">
      <p className="modal-closer" onClick={closeModal}>X</p>
      <p>Choose Filter</p>
      <div className="filter-container">
        <div className="filter">
            <Image style={{border: borderGray}} src="/gray.png" alt="gray image" width="100" height="100"></Image>
            <button className="filter-button" onClick={selectGray}>Gray</button>
        </div>
        <div className="filter">
            <Image style={{border: borderSepia}} src="/sepia.png" alt="sepia image" width="100" height="100"></Image>
            <button className="filter-button" onClick={selectSepia}>Sepia</button>
        </div>
      </div>
      <button className="apply-button" onClick={applyFilter}>Apply</button>
    </div>
  )
}

export default FilterModel