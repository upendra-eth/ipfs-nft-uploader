import axios from 'axios';
import React, { useEffect, useState } from 'react'
import "./App.css"
import "./ipfsUpload.css"

function SendNft() {
  const [fileImg, setFileImg] = useState(null);
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")

  const sendJSONtoIPFS = async (ImgHash) => {

    try {

      const resJSON = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJsonToIPFS",
        data: {
          "name": name,
          "description": desc,
          "image": ImgHash
        },
        headers: {
          'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
          'pinata_secret_api_key': process.env.REACT_APP_PINATA_SECRET_API_KEY,

        },
      });
      console.log("final ", `ipfs://${resJSON.data.IpfsHash}`)
      const tokenURI = `ipfs://${resJSON.data.IpfsHash}`;
      console.log("Token URI", tokenURI);
      //mintNFT(tokenURI, currentAccount)   // pass the winner

    } catch (error) {
      console.log("JSON to IPFS: ")
      console.log(error);
    }


  }

  const sendFileToIPFS = async (e) => {

    e.preventDefault();

    if (fileImg) {
      try {

        const formData = new FormData();
        formData.append("file", fileImg);
        console.log(formData)
        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
            'pinata_secret_api_key': process.env.REACT_APP_PINATA_SECRET_API_KEY,
            "Content-Type": "multipart/form-data"
          },
        });

        const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
        console.log(ImgHash);
        sendJSONtoIPFS(ImgHash)


      } catch (error) {
        console.log("File to IPFS: ")
        console.log(error)
      }
    }
  }




  useEffect(() => {
    console.log(fileImg)
  }, [fileImg])


  return (
    <div className='IPFS-section'>
      <h2>Upload NFT On IPFS</h2>
      <form onSubmit={sendFileToIPFS}>

        <div className='IPFS-form'>
          <input className='IPFS-form-inbox' type="file" onChange={(e) => setFileImg(e.target.files[0])} required /> <br />
          <input className='IPFS-form-inbox' type="text" onChange={(e) => setName(e.target.value)} placeholder='name' required value={name} /> <br />
          <input className='IPFS-form-inbox' type="text" onChange={(e) => setDesc(e.target.value)} placeholder="desc" required value={desc} /> <br />
        </div>
        <button className='IPFS-button' type='submit' >Upload</button>
      </form>

    </div>)
}

export default SendNft