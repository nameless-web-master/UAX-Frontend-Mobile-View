import React, { useState, useEffect } from "react";
import MyCollections from './MyCollections';
import Marketplace from './Marketplace';
import CreateNFT from './CreateNFT';
import Viewoffer from './ViewOffers';
import ReserveFundsAndPower from './ReserveFundsAndPower';
import { UserInfor } from './UserInfor';

const NFTs = () => {
  const [activeTab, setActiveTab] = useState("pills-profile");
  const [myCollectionsKey, setMyCollectionsKey] = useState(0);
  const [createNFTKey, setCreateNFTKey] = useState(0);
  const [marketplaceKey, setMarketplaceKey] = useState(0);
  const [viewOffersKey, setViewOffersKey] = useState(0);
  const [reserveFundsKey, setReserveFundsKey] = useState(0);

  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab_nft");
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    localStorage.setItem("activeTab_nft", tabId);

    // Update keys based on the tab selected
    switch (tabId) {
      case "pills-home":
        setMyCollectionsKey(prevKey => prevKey + 1);
        break;
      case "pills-profile":
        setCreateNFTKey(prevKey => prevKey + 1);
        break;
      case "pills-contact":
        setMarketplaceKey(prevKey => prevKey + 1);
        break;
      case "pills-view_offer":
        setViewOffersKey(prevKey => prevKey + 1);
        break;
      case "pills-Reserve":
        setReserveFundsKey(prevKey => prevKey + 1);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <UserInfor />
      <div className="container">
        <div className='mt-3'>
          <div className='dashboard_box_001____ mb-3 desk_view'>
            <ul className="nav nav-pills my-2 flex-row justify-content-md-start justify-content-center " id="pills-tab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link tabs_button____ ${activeTab === "pills-profile" ? "active" : ""}`}
                  id="pills-profile-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-profile"
                  type="button"
                  role="tab"
                  aria-controls="pills-profile"
                  aria-selected={activeTab === "pills-profile"}
                  onClick={() => handleTabClick("pills-profile")}
                >
                  <img src={"https://images.uaxdlts.com/uax-dashboard/images/craete nft.svg"} style={{ marginRight: "5px" }} />
                  Create NFT
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link tabs_button____ ${activeTab === "pills-home" ? "active" : ""}`}
                  id="pills-home-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-home"
                  type="button"
                  role="tab"
                  aria-controls="pills-home"
                  aria-selected={activeTab === "pills-home"}
                  onClick={() => handleTabClick("pills-home")}
                >
                  <img src={"https://images.uaxdlts.com/uax-dashboard/images/collections.svg"} style={{ marginRight: "5px" }} />
                  My Collections
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link tabs_button____ ${activeTab === "pills-contact" ? "active" : ""}`}
                  id="pills-contact-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-contact"
                  type="button"
                  role="tab"
                  aria-controls="pills-contact"
                  aria-selected={activeTab === "pills-contact"}
                  onClick={() => handleTabClick("pills-contact")}
                >
                  <img src={"https://images.uaxdlts.com/uax-dashboard/images/marketplace.svg"} style={{ marginRight: "5px" }} />
                  Marketplace
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link tabs_button____ ${activeTab === "pills-view_offer" ? "active" : ""}`}
                  id="pills-view_offer-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-view_offer"
                  type="button"
                  role="tab"
                  aria-controls="pills-view_offer"
                  aria-selected={activeTab === "pills-view_offer"}
                  onClick={() => handleTabClick("pills-view_offer")}
                >
                  <img src={"https://images.uaxdlts.com/uax-dashboard/images/offers.svg"} style={{ marginRight: "5px" }} />
                  View Offers
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link tabs_button____ ${activeTab === "pills-Reserve" ? "active" : ""}`}
                  id="pills-Reserve-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-Reserve"
                  type="button"
                  role="tab"
                  aria-controls="pills-Reserve"
                  aria-selected={activeTab === "pills-Reserve"}
                  onClick={() => handleTabClick("pills-Reserve")}
                >
                  <img src={"https://images.uaxdlts.com/uax-dashboard/images/nft history.svg"} style={{ marginRight: "5px" }} />
                  My Bids
                </button>
              </li>
            </ul>
          </div>
          <div className="overflow-auto mobile_view">
            <ul className="nav nav-pills my-2 flex-row flex-nowrap" id="pills-tab" role="tablist"
            style={{
              minWidth: 600
            }}
            >
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link tabs_button____ ${activeTab === "pills-profile" ? "active" : ""}`}
                  id="pills-profile-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-profile"
                  type="button"
                  role="tab"
                  aria-controls="pills-profile"
                  aria-selected={activeTab === "pills-profile"}
                  onClick={() => handleTabClick("pills-profile")}
                >
                  <img src={"https://images.uaxdlts.com/uax-dashboard/images/craete nft.svg"} style={{ marginRight: "5px" }} />
                  Create NFT
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link tabs_button____ ${activeTab === "pills-home" ? "active" : ""}`}
                  id="pills-home-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-home"
                  type="button"
                  role="tab"
                  aria-controls="pills-home"
                  aria-selected={activeTab === "pills-home"}
                  onClick={() => handleTabClick("pills-home")}
                >
                  <img src={"https://images.uaxdlts.com/uax-dashboard/images/collections.svg"} style={{ marginRight: "5px" }} />
                  My Collections
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link tabs_button____ ${activeTab === "pills-contact" ? "active" : ""}`}
                  id="pills-contact-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-contact"
                  type="button"
                  role="tab"
                  aria-controls="pills-contact"
                  aria-selected={activeTab === "pills-contact"}
                  onClick={() => handleTabClick("pills-contact")}
                >
                  <img src={"https://images.uaxdlts.com/uax-dashboard/images/marketplace.svg"} style={{ marginRight: "5px" }} />
                  Marketplace
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link tabs_button____ ${activeTab === "pills-view_offer" ? "active" : ""}`}
                  id="pills-view_offer-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-view_offer"
                  type="button"
                  role="tab"
                  aria-controls="pills-view_offer"
                  aria-selected={activeTab === "pills-view_offer"}
                  onClick={() => handleTabClick("pills-view_offer")}
                >
                  <img src={"https://images.uaxdlts.com/uax-dashboard/images/offers.svg"} style={{ marginRight: "5px" }} />
                  View Offers
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link tabs_button____ ${activeTab === "pills-Reserve" ? "active" : ""}`}
                  id="pills-Reserve-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-Reserve"
                  type="button"
                  role="tab"
                  aria-controls="pills-Reserve"
                  aria-selected={activeTab === "pills-Reserve"}
                  onClick={() => handleTabClick("pills-Reserve")}
                >
                  <img src={"https://images.uaxdlts.com/uax-dashboard/images/nft history.svg"} style={{ marginRight: "5px" }} />
                  My Bids
                </button>
              </li>
            </ul>
          </div>

          <div className="tab-content mt-5" id="pills-tabContent">
            <div
              className={`tab-pane fade ${activeTab === "pills-home" ? "show active" : ""}`}
              id="pills-home"
              role="tabpanel"
              aria-labelledby="pills-home-tab"
            >
              <MyCollections key={myCollectionsKey} />
            </div>
            <div
              className={`tab-pane fade ${activeTab === "pills-profile" ? "show active" : ""}`}
              id="pills-profile"
              role="tabpanel"
              aria-labelledby="pills-profile-tab"
            >
              <CreateNFT key={createNFTKey} />
            </div>
            <div
              className={`tab-pane fade ${activeTab === "pills-contact" ? "show active" : ""}`}
              id="pills-contact"
              role="tabpanel"
              aria-labelledby="pills-contact-tab"
            >
              <Marketplace key={marketplaceKey} />
            </div>
            <div
              className={`tab-pane fade ${activeTab === "pills-view_offer" ? "show active" : ""}`}
              id="pills-view_offer"
              role="tabpanel"
              aria-labelledby="pills-view_offer-tab"
            >
              <Viewoffer key={viewOffersKey} />
            </div>
            <div
              className={`tab-pane fade ${activeTab === "pills-Reserve" ? "show active" : ""}`}
              id="pills-Reserve"
              role="tabpanel"
              aria-labelledby="pills-Reserve-tab"
            >
              <ReserveFundsAndPower key={reserveFundsKey} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NFTs;
