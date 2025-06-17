import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import MenuIcon from '@mui/icons-material/Menu';
import StakingReward from './StakingReward';
import Dashboard from './Dashboard';
import SwapComponent from './Swap';
import Transaction from './Transactions';
import NFTs from './NFTs';
import Settings from './Settings';
import InviteAndEarn from './InviteAndEarn';
import Button from 'react-bootstrap/Button';
import PowerSettingsNewIcon from '@mui/icons-material/Bolt';
import axios from 'axios';
import Stake from './Stake'

import BackTop from '../media/back-top.svg';
import BackBottom from '../media/back-bottom.svg';
const drawerWidth = 240;

export default function ResponsiveDrawer() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [title, setTitle] = React.useState('');
  const [wallet_address, setwallet_address] = React.useState();
  const [BalanceAndPower, setBalanceAndPower] = React.useState('');
  const [coin_price, setcoin_price] = React.useState(0);
  const [coin_price_diff_percent, setcoin_price_diff_percent] = React.useState(0);
  const [reserved_power, setreserved_power] = React.useState(0);
  const [reserved_balance, setreserved_balance] = React.useState(0);
  const [loader, setloader] = React.useState(true);
  const navigate = useNavigate();

  var menuItems = []
  if (window.innerWidth > 892) {
    menuItems = [
      { text: 'Dashboard', icon: <img src={"https://images.uaxdlts.com/uax-dashboard/images/dashboard.svg"} /> },
      { text: 'NFTs', icon: <img src={"https://images.uaxdlts.com/uax-dashboard/images/nft.svg"} /> },
      { text: 'Get Bandwidth', icon: <img src={"https://images.uaxdlts.com/uax-dashboard/images/power.svg"} /> },
      { text: 'Staking Reward', icon: <img src={"https://images.uaxdlts.com/uax-dashboard/images/staking-menu.svg"} /> },
      { text: 'Settings', icon: <img src={"https://images.uaxdlts.com/uax-dashboard/images/settings.svg"} /> },
      { text: 'Invite & Earn', icon: <img src={"https://images.uaxdlts.com/uax-dashboard/images/INVITE.svg"} /> },
      { text: 'Multichain Bridge', icon: <img src={"https://images.uaxdlts.com/uax-dashboard/images/multichain.svg"} /> },
      { text: 'Logout', icon: <img src={"https://images.uaxdlts.com/uax-dashboard/images/logout.svg"} /> }
    ];
  }
  else {
    menuItems = [
      { text: 'Dashboard', icon: <img src={"https://images.uaxdlts.com/uax-dashboard/images/dashboard.svg"} /> },
      { text: 'Transactions', icon: <img src={"https://images.uaxdlts.com/uax-dashboard/images/swap.svg"} /> },
      { text: 'NFTs', icon: <img src={"https://images.uaxdlts.com/uax-dashboard/images/nft.svg"} /> },
      { text: 'Get Bandwidth', icon: <img src={"https://images.uaxdlts.com/uax-dashboard/images/power.svg"} /> },
      { text: 'Staking Reward', icon: <img src={"https://images.uaxdlts.com/uax-dashboard/images/staking-menu.svg"} /> },
      { text: 'Settings', icon: <img src={"https://images.uaxdlts.com/uax-dashboard/images/settings.svg"} /> },
      { text: 'Invite & Earn', icon: <img src={"https://images.uaxdlts.com/uax-dashboard/images/INVITE.svg"} /> },
      { text: 'Multichain Bridge', icon: <img src={"https://images.uaxdlts.com/uax-dashboard/images/multichain.svg"} /> },
      { text: 'Logout', icon: <img src={"https://images.uaxdlts.com/uax-dashboard/images/logout.svg"} /> }
    ];
  }

  const historyStackRef = React.useRef([]); // Maintain a ref to keep the history stack

  React.useEffect(() => {
    const storedIndex = localStorage.getItem('selectedIndex');
    if (storedIndex !== null) {
      const index = Number(storedIndex);
      setSelectedIndex(index);
      setTitle(index === 0 ? 'Wallet Address' : menuItems[index - 1].text);
    } else {
      setSelectedIndex(1);
      setTitle('Dashboard');
    }
    setLoading(false);

    const initialFunction = async () => {
      var token = localStorage.getItem("token");
      var email = localStorage.getItem("email");
      if (token && email) {
        try {
          const responseToken = await axios.post('https://services.uaxwallet.com/api/verifyToken', {
            token: token,
            email: email
          });
          if (responseToken.data === "Token Expired") {
            localStorage.clear();
            window.location.href = '/login';
          } else {
            setloader(false);
            const config = {
              headers: { Authorization: `Bearer ${token}` }
            };
            const responseWallet = await axios.post('https://services.uaxwallet.com/api/getUserWallet', {
              email: email
            }, config);
            setwallet_address(responseWallet.data);
            const balanceAndPower = await axios.post("https://services.uaxwallet.com/api/getUserBalanceAndPower", {
              email: email
            }, config);
            if (balanceAndPower) {
              const getSummary = await axios.post("https://services.uaxwallet.com/api/getNFTsAndOffersSummary", {
                email: email
              }, config)
              if (getSummary.data) {
                setreserved_power((parseFloat(getSummary.data.totalAskAmounts) * 212) + (parseFloat(getSummary.data.totalNFTsListedForSell) * 212))
                setreserved_balance((parseFloat(getSummary.data.totalBidAmount)))
              }
              setBalanceAndPower(balanceAndPower.data);
            }
            const price = await axios.get("https://cmw.uax.network/get_coin_price_history");
            setcoin_price(price.data.current_price);
            if (price.data.price_history.length >= 2) {
              const priceHistory = price.data.price_history;
              const lastPrice = priceHistory[priceHistory.length - 1].current_price;
              const secondLastPrice = priceHistory[priceHistory.length - 2].current_price;
              const priceDifferencePercent = ((lastPrice - secondLastPrice) / secondLastPrice) * 100;
              setcoin_price_diff_percent(priceDifferencePercent.toFixed(2));
            }
          }
        } catch (error) {
          console.error("Error during token validation:", error);
          window.location.href = '/login';  // Navigate to login page on error
        }
      } else {
        window.location.href = '/login';
      }
    };
    initialFunction();
    const interval = setInterval(() => {
      initialFunction();
    }, 6000);

    return () => clearInterval(interval);
  }, [navigate]);

  const refreshThePage = () => {
    localStorage.removeItem("activeTab")
    localStorage.removeItem("activeTab_nft")
    window.location.reload()
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuItemClick = (index) => {
    if (window.innerWidth > 892 && index === 7) {
      // window.open('https://bridge.uax.network', '_blank');
    } else if (window.innerWidth < 892 && index === 8) {
      // window.open('https://bridge.uax.network', '_blank');
    }
    if (window.innerWidth > 892 && index === 8) {
      localStorage.clear();
      // navigate('/login');
      window.location.reload();
    }
    else if (window.innerWidth < 892 && index === 9) {
      localStorage.clear();
      // navigate('/login');
      window.location.reload();
    }
    else {
      // if(window.innerWidth>892 && index === 6){

      // }
      // else if(window.innerWidth<892 && index === 7){
      //   // window.location.href = 'https://bridge.uax.network';
      // }
      // else{
      if (selectedIndex == index) {
        localStorage.removeItem("activeTab")
        localStorage.removeItem("activeTab_nft")
        window.location.reload()
      }
      if (selectedIndex !== null && selectedIndex !== index) {
        // Push current index to history stack if it's not the same as the selected index
        historyStackRef.current.push(selectedIndex);
        // window.location.reload();
      }
      setSelectedIndex(index);
      setTitle(index === 0 ? 'Wallet Address' : menuItems[index - 1].text);
      localStorage.setItem('selectedIndex', index);
      setMobileOpen(false);
      // }
    }
  };

  // const handleBackButtonClick = () => {
  //   if (historyStackRef.current.length > 0) {
  //     const previousIndex = historyStackRef.current.pop();
  //     setSelectedIndex(previousIndex);
  //     setTitle(previousIndex === 0 ? 'Wallet Address' : menuItems[previousIndex - 1].text);
  //     localStorage.setItem('selectedIndex', previousIndex);
  //   } else {
  //     // Handle going back to initial state or previous route if history stack is empty
  //     navigate(-1); // Go back in browser history if using <Router> component
  //   }
  // };
  return (
    <>
      {loader ? (
        ''
      ) : (
        <>
          <Box sx={{ display: 'flex', backgroundColor: 'black', color: 'white' }}>
            <CssBaseline />
            <AppBar
              position="fixed"
              sx={{
                width: { md: `calc(100% - ${drawerWidth}px)` },
                ml: { md: `${drawerWidth}px` },
                bgcolor: 'transparent',
                boxShadow: 'none'
              }}
            >
              <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { md: 'none' } }}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Typography variant="h6" noWrap component="div">
                    {/* <img src={BackButton} style={{ marginRight: "5px", cursor: "pointer" }} onClick={handleBackButtonClick} /> */}
                    <span className='for__desk__view'>
                      {title}
                    </span>
                    <span className='for__mobile__view'>
                      <img onClick={refreshThePage} src={"https://images.uaxdlts.com/uax-landing/assets/images/logo/uax_white_logo.png?quality=lossless"} alt="Logo" style={{ width: '20vw', margin: '0 auto', display: 'block', cursor: "pointer" }} />
                    </span>
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {/* Custom Button */}
                  <IconButton color="inherit">
                    <Typography variant="button" sx={{ mr: 1 }}>
                      <Button
                        style={{ backgroundColor: "transparent", border: "1px solid #c006df" }}
                        className='sidebar_class_001____'
                        variant="primary"
                        type="submit"
                        onClick={() => handleMenuItemClick(6)}
                      >
                        Invite & Earn
                      </Button>
                    </Typography>
                  </IconButton>
                  <div className='sidebar_class_001____'>
                    <IconButton color="inherit">
                      <Typography variant="button" sx={{ mr: 1 }}>
                        <img src={"https://images.uaxdlts.com/uax-landing/assets/images/logo/uax%20favicon.png"} style={{ width: "15px", marginRight: "8px", marginTop: "-5px" }} />
                        <span style={{ fontSize: "16px", fontWeight: "700", color: "#c006df" }}>{BalanceAndPower ? ((parseFloat(BalanceAndPower.balance) - parseFloat(reserved_balance)).toFixed(3)) : 0.000} UAXN</span>
                      </Typography>
                    </IconButton>
                  </div>
                  {/* Power Icon */}
                  <div className=''>
                    <IconButton color="inherit">
                      <PowerSettingsNewIcon style={{ padding: "", backgroundColor: "", color: "#fff" }} />
                      <span style={{ color: "#c006df", fontSize: "16px", fontWeight: "700" }}>{BalanceAndPower ? (parseFloat((BalanceAndPower.bandwidth) - parseFloat(reserved_power)).toFixed(2)) : 0.00}</span>
                    </IconButton>
                  </div>
                  <div className='sidebar_class_001____'>
                    <IconButton color="inherit">
                      <span style={{ color: "#c006df", fontSize: "16px", fontWeight: "700" }}>Price : ${parseFloat(coin_price).toFixed(3)} <small style={{ color: parseFloat(coin_price_diff_percent) > 0 ? "green" : "red" }}><i className={parseFloat(coin_price_diff_percent) > 0 ? "fa fa-arrow-up" : "fa fa-arrow-down"} aria-hidden="true"></i> {coin_price_diff_percent}%</small></span>
                    </IconButton>
                  </div>
                </Box>
              </Toolbar>
              {/* <div className='sticky-navbar'>
                        <div id="top-section" className="">
                          <div className="top-content">
                            <center>
                            <span className="top-text" style={{fontFamily:"'Arial Black', sans-serif"}}>
                              <span style={{ fontSize:"12px",fontWeight:"900" }}>   Beta Testing is Now Live</span>
                              <br/>
                              <span style={{ fontSize: '12px',fontWeight:"900" }}>
                              If you encounter any issues during the beta testing phase, please reach out to us via email.
                              Important: Be cautious of fraudulent activities. We are not selling our coin—please do not engage with any unauthorized offers.
                              </span>
                            </span>
                            </center>
                          </div>
                        </div>
                        </div> */}
            </AppBar>
            <Box
              component="nav"
              sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
              aria-label="mailbox folders"
            >
              <Drawer
                variant="permanent"
                sx={{
                  display: { xs: 'none', sm: 'none', md: 'block', },
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, paddingTop: '20px', backgroundColor: '#1c1c1c', color: 'white' },
                }}
                open
              >
                <Toolbar>
                  <img onClick={refreshThePage} src={"https://images.uaxdlts.com/uax-landing/assets/images/logo/uax_white_logo.png?quality=lossless"} alt="Logo" style={{ width: '10vw', margin: '0 auto', display: 'block', cursor: "pointer" }} />
                </Toolbar>
                <Divider />
                <List>
                  <ListItem
                    disablePadding
                    selected={selectedIndex === 0}
                    onClick={() => handleMenuItemClick(0)}
                    sx={{
                      backgroundColor: selectedIndex === 0 ? '#c006df' : '#303030',
                      height: '64px',
                      border: 'none'
                    }}
                  >
                    <ListItemButton>
                      <Box>
                        <img src={"https://images.uaxdlts.com/uax-landing/assets/images/logo/uax%20favicon.png"} style={{ width: "3rem" }} />
                      </Box>
                      <Box style={{ marginLeft: "15px" }}>
                        <ListItemText style={{ color: "#c006df" }} primary="Wallet Address" />
                        <Typography sx={{ color: '#909090', fontSize: '0.75rem' }}>{wallet_address}</Typography>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                </List>
                <Divider />
                <List>
                  {menuItems.map((item, index) => (
                    <ListItem
                      key={item.text}
                      disablePadding
                      selected={selectedIndex === index + 1}
                      onClick={() => handleMenuItemClick(index + 1)}
                      sx={{
                        backgroundColor: selectedIndex === index + 1 ? '#c006df' : 'inherit',
                      }}
                    >
                      <ListItemButton>
                        <ListItemIcon>
                          {React.cloneElement(item.icon, {
                            sx: { color: selectedIndex === index + 1 ? '#c006df' : 'gray' },
                          })}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.text}
                          sx={{ color: selectedIndex === index + 1 ? '#c006df' : 'inherit' }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Drawer>

              <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true,
                }}
                sx={{
                  display: { xs: 'block', sm: 'block', md: 'none', },
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: 'black', color: 'white' },
                }}
              >
                <Toolbar>
                  <img src={"https://images.uaxdlts.com/uax-landing/assets/images/logo/uax_white_logo.png?quality=lossless"} alt="Logo" style={{ width: '50%', margin: '0 auto', display: 'block' }} />
                </Toolbar>
                <Divider />
                <List>
                  {menuItems.map((item, index) => (
                    <ListItem
                      key={item.text}
                      disablePadding
                      selected={selectedIndex === index + 1}
                      onClick={() => handleMenuItemClick(index + 1)}
                      sx={{
                        backgroundColor: selectedIndex === index + 1 ? '#c006df' : 'inherit', // #c006df if selected, otherwise inherit
                      }}
                    >
                      <ListItemButton>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
                <Divider />
              </Drawer>
            </Box>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                backgroundColor: 'black',
                color: 'white',
                minHeight: '100vh',
                width: '100%'
              }}
            >
              <img
                src={BackTop}
                alt='no Backtop'
                className="mobile_view"
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '100%'
                }}
              />
              <img
                src={BackBottom}
                alt='no Backbottom'
                style={{
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  width: '100%',
                }}
                className="mobile_view"
              />
              <Toolbar />
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <CircularProgress />
                </Box>
              ) : (
                <div className='w-100'>
                  {selectedIndex === 0 && (
                    <Typography paragraph>
                      <Transaction />
                    </Typography>
                  )}
                  {selectedIndex > 0 && (
                    <Typography paragraph style={{
                      width: '100%'
                    }}>
                      {menuItems[selectedIndex - 1].text === 'Get Bandwidth' ? <StakingReward /> : ''}
                      {menuItems[selectedIndex - 1].text === 'Dashboard' ? <Dashboard /> : ''}
                      {menuItems[selectedIndex - 1].text === 'Swap' ? <SwapComponent /> : ''}
                      {menuItems[selectedIndex - 1].text === 'NFTs' ? <NFTs /> : ''}
                      {menuItems[selectedIndex - 1].text === 'Settings' ? <Settings /> : ''}
                      {menuItems[selectedIndex - 1].text === 'Invite & Earn' ? <InviteAndEarn /> : ''}
                      {menuItems[selectedIndex - 1].text === 'Transactions' ? <Transaction /> : ''}
                      {menuItems[selectedIndex - 1].text === 'Staking Reward' ? <Stake /> : ''}
                      {/* {menuItems[selectedIndex - 1].text} Content */}
                    </Typography>
                  )}
                </div>
              )}
            </Box>
          </Box>
        </>
      )}
    </>
  );
}
