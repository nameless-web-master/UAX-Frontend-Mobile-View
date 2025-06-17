import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

const CreateNft = () => {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [name, setname] = useState('');
  const [naftcreatorname, setnaftcreatorname] = useState('');
  const [minvalue, setminvalue] = useState(0);
  const [description, setdescription] = useState('');
  const [externallink, setexternallink] = useState('NA');
  const [msg, setmsg] = useState('');
  const [disable_create_nft_button, setdisable_create_nft_button] = useState(false);
  const [NftSupply, setNftSupply] = useState(1);


  const allowedTypes = ["image/png", "image/jpeg", "image/svg+xml", "video/mp4"];
  const maxFileSize = 100 * 1024 * 1024; // 5MB in bytes

  const CreateNFT = async () => {
    setdisable_create_nft_button(true)
    setmsg(
      <img src={"https://images.uaxdlts.com/uax-dashboard/images/loader3.gif"} style={{ width: "3vw" }} />
    );
    if (name.length > 0 && naftcreatorname.length > 0 && parseFloat(minvalue) > 0 && description.length > 0) {
      if (selectedFile) {
        if (!allowedTypes.includes(selectedFile.type)) {
          setmsg("Invalid file type. Only PNG, JPEG, SVG, and MP4 are allowed.");
          setdisable_create_nft_button(false)
          return;
        }
        if (selectedFile.size > maxFileSize) {
          setmsg("File size exceeds 100MB limit.");
          setdisable_create_nft_button(false)
          return;
        }
      } else {
        setmsg("File is required.");
        setdisable_create_nft_button(false)
        return;
      }

      try {
        var token = localStorage.getItem("token")
        var email = localStorage.getItem("email")
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('name', name);
        formData.append('naftcreatorname', naftcreatorname);
        formData.append('minvalue', minvalue);
        formData.append('description', description);
        formData.append('externallink', externallink);
        formData.append('email', email);
        formData.append('nft_supply', NftSupply);

        const response = await axios.post('https://services.uaxwallet.com/api/createNFT', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setmsg(response.data.message);
          setTimeout(() => {
            window.location.reload();
          }, 2000)
        } else {
          setmsg(response.data.message || 'Failed to create NFT.');
          setdisable_create_nft_button(false)
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setmsg('An error occurred while creating the NFT.');
        setdisable_create_nft_button(false)
      }
    } else {
      setmsg("Please fill in all required fields.");
      setdisable_create_nft_button(false)
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file.size > maxFileSize) {
      setmsg("File size exceeds 100MB limit.");
      setSelectedFile(null);
      setSelectedImage(null);
      return;
    } else {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
      setmsg('');
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setShowImage(false);
  };

  return (
    <>
      <div className="nft_box_0001____ small_back p-md-4 p-0 py-4">
        <p style={{ fontSize: "25px", fontWeight: "700", marginBottom: "5px" }}>
          Create an NFT
        </p>
        <p style={{ fontSize: "13px" }}>
          Once your item is minted you will not be able to change any of its information.
        </p>
        <div
          className="my-3 small_view"
          style={{
            border: "1px solid #2f2d2f",
            position: "relative",
            height: "100%",
            borderRadius: "7px",
            backgroundColor: '#211f24',
            borderRadius: 6
          }} onClick={handleFileSelect}>
          {selectedImage ? (
            <>
              <div className="nftUplaod">
                <img
                  src={selectedImage}
                  alt="Selected Image"
                  style={{
                    width: "100%",
                    borderRadius: ".25rem",
                  }}
                />
              </div>
            </>
          ) : (
            <div className="nftUplaod" style={{ position: "relative", }}>
              <center className="absCenter" style={{ fontSize: "13px" }}>
                <i
                  className="fa fa-upload mt-4"
                  style={{ fontSize: "30px" }}
                ></i>
                <p className="my-3">JPG, PNG, GIF, SVG, MP4 <span style={{ color: '#E12DFF' }}>Max size: 100MB</span></p>
              </center>
            </div>
          )}
        </div>
        <div className="row">
          <div className="col-lg-6 col-12 mt-2">
            <form>
              <div className="form-group">
                <label className="desk_view" htmlFor="" style={{ fontWeight: "700" }}>
                  Name*
                </label>
                <label className="mobile_view" style={{
                  fontWeight: 400,
                  color: "#FFFFFFCC",
                  fontSize: 14
                }}>Name*</label>
                <input
                  type=""
                  className="mt-2"
                  id="searchQueryInput"
                  aria-describedby=""
                  placeholder="Name your NFT"
                  style={{ backgroundColor: '#403242' }}
                  onChange={(e) => setname(e.target.value)}
                />
              </div>
              <br />
              <div className="form-group">
                <label className="desk_view" htmlFor="" style={{ fontWeight: "700" }}>
                  NFT Creator*
                </label>
                <label className="mobile_view" style={{
                  fontWeight: 400,
                  color: "#FFFFFFCC",
                  fontSize: 14
                }}>NFT Creator*</label>
                <input
                  type=""
                  className="mt-2"
                  id="searchQueryInput"
                  aria-describedby=""
                  placeholder="NFT Creator Name"
                  style={{ backgroundColor: '#403242' }}
                  onChange={(e) => setnaftcreatorname(e.target.value)}
                />
              </div>
              <br />
              <div className="form-group">
                <label className="desk_view" htmlFor="" style={{ fontWeight: "700" }}>
                  Fixed Price*
                </label>
                <label className="mobile_view" style={{
                  fontWeight: 400,
                  color: "#FFFFFFCC",
                  fontSize: 14
                }}>Fixed Price*</label>
                <input
                  type="number"
                  className="mt-2"
                  id="searchQueryInput"
                  aria-describedby=""
                  placeholder="Enter Minimum Price"
                  style={{ backgroundColor: '#403242' }}
                  onChange={(e) => setminvalue(e.target.value)}
                />
              </div>
              <br />
              <div className="form-group">
                <label className="desk_view" htmlFor="" style={{ fontWeight: "700" }}>
                  Total Supply*
                </label>
                <label className="mobile_view" style={{
                  fontWeight: 400,
                  color: "#FFFFFFCC",
                  fontSize: 14
                }}>Total Supply*</label>
                <input
                  type="number"
                  className="mt-2"
                  id="searchQueryInput"
                  aria-describedby=""
                  placeholder="Enter Supply"
                  value={NftSupply}
                  style={{ backgroundColor: '#403242' }}
                  onChange={(e) => setNftSupply(e.target.value)}
                />
              </div>
              <br />
              <div className="form-group">
                <label className="desk_view" htmlFor="" style={{ fontWeight: "700" }}>
                  Description*
                </label>
                <label className="mobile_view" style={{
                  fontWeight: 400,
                  color: "#FFFFFFCC",
                  fontSize: 14
                }}> Description*</label>
                <textarea
                  type=""
                  className="mt-2"
                  placeholder="Enter a description"
                  id="searchQueryInput"
                  aria-describedby=""
                  style={{ backgroundColor: '#403242' }}
                  onChange={(e) => setdescription(e.target.value)}
                ></textarea>
              </div>
              <br />
              <div className="form-group">
                <label className="desk_view" htmlFor="" style={{ fontWeight: "700" }}>
                  External Link
                </label>
                <label className="mobile_view" style={{
                  fontWeight: 400,
                  color: "#FFFFFFCC",
                  fontSize: 14
                }}>External Link</label>
                <input
                  type=""
                  className="mt-2"
                  id="searchQueryInput"
                  aria-describedby=""
                  placeholder="https://sample.iofitem/test"
                  style={{ backgroundColor: '#403242' }}
                  onChange={(e) => setexternallink(e.target.value)}
                />
              </div>
            </form>
            {disable_create_nft_button ?
              <button
                className="headerGrad"
                style={{
                  cursor: "pointer",
                  backgroundColor: "grey",
                  marginTop: "15px",
                  color: "white",
                  minWidth: "100%",
                  fontWeight: "600",
                  fontSize: "16px",
                  border: "none",
                  marginRight: "0px",
                  minHeight: "5vh",
                  borderRadius: ".25rem",
                }}
                disabled
              >
                <span style={{ fontSize: "14px" }}> Create</span>
              </button>
              :
              <button
                className="headerGrad"
                style={{
                  cursor: "pointer",
                  backgroundColor: "#c006df ",
                  marginTop: "15px",
                  color: "white",
                  minWidth: "100%",
                  fontWeight: "600",
                  fontSize: "16px",
                  border: "1px solid #c006df",
                  marginRight: "0px",
                  minHeight: "5vh",
                  borderRadius: ".25rem",
                }}
                onClick={CreateNFT}
              >
                <span style={{ fontSize: "14px" }}> Create</span>
              </button>
            }
            {msg && (
              <div className="alert alert-success mt-3 text-center" role="alert">
                {msg}
              </div>
            )}
          </div>
          <div className="col-md-6 col-12 mt-2 large_view" style={{}}>
            <div style={{ border: "1px solid #2f2d2f", position: "relative", height: "100%", borderRadius: "7px", padding: "5px" }}>
              {selectedImage ? (
                <>
                  <div className="nftUplaodafter">
                    <center className="" style={{ fontSize: "13px" }}>
                      <p
                        style={{
                          marginBottom: "0px",
                          float: "right",
                          cursor: "pointer",
                          position: "absolute",
                          top: "2%",
                          right: "5%",
                        }}
                      >
                        <i
                          className="fa fa-close"
                          onClick={handleCloseImage}
                          style={{ fontSize: "18px" }}
                        ></i>
                      </p>
                      <img
                        src={selectedImage}
                        alt="Selected Image"
                        style={{
                          width: "100%",
                          borderRadius: ".25rem",
                        }}
                      />
                    </center>
                  </div>
                </>
              ) : (
                <div className="nftUplaod" style={{ position: "relative", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                  <center className="absCenter" style={{ fontSize: "13px" }}>
                    <i
                      className="fa fa-upload"
                      style={{ fontSize: "30px" }}
                    ></i>
                    <p
                      style={{
                        fontWeight: "600",
                        marginBottom: "0px",
                        marginTop: "5px",
                      }}
                    >
                      Drag and drop media
                    </p>
                    <input
                      type="file"
                      name="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileUpload}
                    />
                    <Link
                      to=""
                      onClick={handleFileSelect}
                      style={{ color: "#b250fe" }}
                    >
                      Browse files
                    </Link>
                    <p style={{ marginBottom: "0px" }}>Max size: 100MB</p>
                    <p>JPG, PNG, GIF, SVG, MP4</p>
                  </center>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateNft;
