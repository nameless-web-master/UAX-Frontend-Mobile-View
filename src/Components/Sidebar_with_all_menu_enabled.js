import * as React from 'react';
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
import Badge from '@mui/material/Badge';
import CircularProgress from '@mui/material/CircularProgress';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Tooltip from '@mui/material/Tooltip';
import Button from 'react-bootstrap/Button';
import PowerSettingsNewIcon from '@mui/icons-material/Bolt';
import axios from 'axios';

// import Logo from '../images/uaxlogo.svg';
import UAXN from '../images/Group 40004 (1).svg';
import StakingReward from './StakingReward';
import Dashboard from './Dashboard';
import SwapComponent from './Swap';
import Transaction from './Transactions';
import NFTs from './NFTs';
import Settings from './Settings';
import InviteAndEarn from './InviteAndEarn';
import DashboardIcon from '../images/dashboard.svg';
import LogoutIcon from '../images/logout.svg';
import DappsIcon from '../images/daaps.svg';
import NFTIcon from '../images/nft.svg';
import SettingIcon from '../images/settings.svg';
import StakingIcon from '../images/power.svg';
import SwapIcon from '../images/swap.svg';
import MultiChainIcon from '../images/multichain.svg';
import MailIcon from '@mui/icons-material/Mail';
import UAXPNG from '../images/favicon.png';

const drawerWidth = 240;

export default function ResponsiveDrawer() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(1); // Default to Dashboard
  const [loading, setLoading] = React.useState(true);
  const [title, setTitle] = React.useState('Dashboard');
  const [walletAddress, setWalletAddress] = React.useState('');
  const [balanceAndPower, setBalanceAndPower] = React.useState('');
  const [coinPrice, setCoinPrice] = React.useState(0);

  const menuItems = [
    { text: 'Dashboard', icon: <img src={DashboardIcon} alt="Dashboard" /> },
    { text: 'NFTs', icon: <img src={NFTIcon} alt="NFTs" /> },
    // { text: 'Create NFT', icon: <img src={NFTIcon} alt="NFTs" /> },
    // { text: 'dApps', icon: <img src={DappsIcon} alt="dApps" />, disabled: true, tooltip: 'Coming Soon' },
    // { text: 'Swap', icon: <img src={SwapIcon} alt="Swap" />, disabled: true, tooltip: 'Coming Soon' },
    { text: 'Get Bandwidth', icon: <img src={StakingIcon} alt="Get Bandwidth" /> },
    // { text: 'Multichain Bridge', icon: <img src={MultiChainIcon} alt="Multichain Bridge" />, disabled: true, tooltip: 'Coming Soon' },
    { text: 'Settings', icon: <img src={SettingIcon} alt="Settings" /> },
    { text: 'Invite & Earn', icon: <MailIcon sx={{ color: 'gray' }} /> },
    { text: 'Logout', icon: <img src={LogoutIcon} alt="Logout" /> }
  ];

  React.useEffect(() => {
    const storedIndex = localStorage.getItem('selectedIndex');
    if (storedIndex !== null) {
      const index = Number(storedIndex);
      setSelectedIndex(index);
      setTitle(menuItems[index - 1].text);
    } else {
      setSelectedIndex(1); // Default to the first menu item if no index is stored
      setTitle('Dashboard');
    }
    setLoading(false);

    const initialFunction = async () => {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");
      if (token && email) {
        try {
          const responseToken = await axios.post('https://services.uaxwallet.com/api/verifyToken', {
            token,
            email
          });
          if (responseToken.data === "Token Expired") {
            localStorage.clear();
            window.location.href = '/login';
          } else {
            const config = {
              headers: { Authorization: `Bearer ${token}` }
            };
            const responseWallet = await axios.post('https://services.uaxwallet.com/api/getUserWallet', {
              email
            }, config);
            setWalletAddress(responseWallet.data);
            const balanceAndPowerResponse = await axios.post("https://services.uaxwallet.com/api/getUserBalanceAndPower", {
              email
            }, config);
            if (balanceAndPowerResponse) {
              setBalanceAndPower(balanceAndPowerResponse.data);
            }
            const price = await axios.get("https://cmw.uax.network/get_current_price");
            setCoinPrice(price.data.current_price);
          }
        } catch (error) {
          console.error('Error fetching initial data:', error);
          window.location.href = "/login";
        }
      } else {
        window.location.href = "/login";
      }
    };
    initialFunction();
  }, []); // Removed dependencies to ensure this effect runs only once on mount

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuItemClick = (index) => {
    if (menuItems[index].disabled) return; // Prevent navigation if the item is disabled

    if (index === 8) { // Logout
      localStorage.clear();
      window.location.href = "/login";
    } else {
      setSelectedIndex(index + 1);
      setTitle(menuItems[index].text);
      localStorage.setItem('selectedIndex', index + 1);
      setMobileOpen(false);
    }
  };

  const renderContent = React.useMemo(() => {
    switch (selectedIndex) {
      case 1: return <Dashboard />;
      case 2: return <NFTs />;
      case 3: return null; // dApps
      case 4: return null; // Swap
      case 5: return <StakingReward />;
      case 6: return null; // Multichain Bridge
      case 7: return <Settings />;
      case 8: return <InviteAndEarn />;
      default: return <Dashboard />;
    }
  }, [selectedIndex]);

  return (
    <Box sx={{ display: 'flex', backgroundColor: 'black', color: 'white' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'transparent', // Remove background color
          boxShadow: 'none' // Remove box shadow
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {title}
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
                >
                  Invite & Earn
                </Button>
              </Typography>
            </IconButton>
            <IconButton color="inherit">
              <Typography variant="button" sx={{ mr: 1 }}>
                <img src={UAXPNG} style={{ width: "15px", marginRight: "8px", marginTop: "-5px" }} />
                <span style={{ fontSize: "16px", fontWeight: "700", color: "#c006df" }}>{balanceAndPower ? parseFloat(balanceAndPower.balance).toFixed(2) : 0.00} UAXN</span>
              </Typography>
            </IconButton>
            {/* Power Icon */}
            <IconButton color="inherit">
              <PowerSettingsNewIcon style={{ padding: "", backgroundColor: "", color: "#fff" }} />
              <span style={{ color: "#c006df", fontSize: "16px", fontWeight: "700" }}>{balanceAndPower ? parseFloat(balanceAndPower.bandwidth).toFixed(2) : 0.00} Bandwidth </span>
            </IconButton>
            <IconButton color="inherit">
              <img src={UAXPNG} style={{ width: "15px", marginRight: "8px", marginTop: "-5px" }} />
              <span style={{ fontSize: "16px", fontWeight: "700", color: "#c006df" }}>${coinPrice ? parseFloat(coinPrice).toFixed(2) : 0.00}</span>
            </IconButton>
            <IconButton color="inherit" sx={{ ml: 2 }}>
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, paddingTop: '20px', backgroundColor: '#1c1c1c', color: 'white' },
          }}
          open
        >
          <Toolbar>
          <img src={"https://images.uaxdlts.com/uax-landing/assets/images/logo/uax_white_logo.png?quality=lossless"} tyle={{ width: '10vw', margin: '0 auto', display: 'block' }}/>
            {/* <img src={} alt="Logo" style={{ width: '10vw', margin: '0 auto', display: 'block' }} /> */}
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
                  <img src={UAXN} style={{ width: "3rem" }} />
                </Box>
                <Box style={{ marginLeft: "15px" }}>
                  <ListItemText style={{ color: "#c006df" }} primary="Wallet Address" />
                  <Typography sx={{ color: '#909090', fontSize: '0.75rem' }}>{walletAddress}</Typography>
                </Box>
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            {menuItems.map((item, index) => (
              <Tooltip key={item.text} title={item.tooltip || ''} arrow>
                <ListItem
                  disablePadding
                  selected={selectedIndex === index + 1}
                  onClick={() => handleMenuItemClick(index)}
                  sx={{
                    backgroundColor: selectedIndex === index + 1 ? '#c006df' : 'inherit',
                  }}
                >
                  <ListItemButton disabled={item.disabled}>
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
              </Tooltip>
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
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: 'black', color: 'white' },
          }}
        >
          <Toolbar>
            <img src={"https://images.uaxdlts.com/uax-landing/assets/images/logo/uax_white_logo.png?quality=lossless"} alt="Logo" style={{ width: '50%', margin: '0 auto', display: 'block' }} />
          </Toolbar>
          <Divider />
          <List>
            {menuItems.map((item, index) => (
              <Tooltip key={item.text} title={item.tooltip || ''} arrow>
                <ListItem
                  disablePadding
                  selected={selectedIndex === index + 1}
                  onClick={() => handleMenuItemClick(index)}
                  sx={{
                    backgroundColor: selectedIndex === index + 1 ? '#c006df' : 'inherit',
                  }}
                >
                  <ListItemButton disabled={item.disabled}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              </Tooltip>
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
        }}
      >
        <Toolbar />
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : (
          <>{renderContent}</>
        )}
      </Box>
    </Box>
  );
}
