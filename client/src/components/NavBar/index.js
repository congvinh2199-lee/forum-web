import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { USER_INFO_KEY } from "../../utils/util.enum";
import { Stack } from "@mui/material";
import "./style.scss";
import { useNavigate } from "react-router-dom";

const pages = [
  { label: "Trang chủ", href: "/" },
  { label: "Về chúng tôi", href: "/aboutme" },
  { label: "Bài viết", href: "/blog" },
  { label: "Liên hệ", href: "/contact" },
];
const settings = [
  { label: "Trang cá nhân", href: "/info", key: "USER_PAGE" },
  { label: "Đăng xuất", href: "/login", key: "SIGNOUT" },
];

const NavBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const userInfo = React.useMemo(() => {
    const info = localStorage.getItem(USER_INFO_KEY);
    if (info) return true;
    return false;
  }, []);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <div className="page-nav-bar">
      <AppBar position="static" sx={{ backgroundColor: "#6B3DC5" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              LOGO
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem
                    key={page?.href}
                    onClick={() => {
                      navigate(page?.href);
                      handleCloseNavMenu();
                    }}
                  >
                    <Typography textAlign="center">{page?.label}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              LOGO
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page?.href}
                  onClick={() => {
                    navigate(page?.href);
                    handleCloseNavMenu();
                  }}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page?.label}
                </Button>
              ))}
            </Box>
            {userInfo ? (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/2.jpg"
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting?.label}
                      onClick={handleCloseUserMenu}
                    >
                      <Typography
                        textAlign="center"
                        onClick={() => {
                          if (setting?.key === "SIGNOUT") {
                            localStorage.clear();
                            navigate(setting?.href);
                          }
                          if ( setting?.key === 'USER_PAGE'){
                            navigate(setting?.href + `/${JSON.parse(localStorage.getItem(USER_INFO_KEY))?.user_id}`)
                          }
                          
                        }}
                      >
                        {setting?.label}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            ) : (
              <Stack
                flexDirection={"row"}
                alignItems="center"
                justifyContent={"flex-start"}
              >
                <Button
                  variant="outlined"
                  sx={{
                    color: "white",
                    border: "1px solid white",
                    ":hover": { color: "white", border: "1px solid white" },
                    "@media (max-width: 600px)": {
                      fontSize: "10px",
                      whiteSpace: "nowrap",
                    },
                  }}
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Đăng nhập
                </Button>
                <Button
                  variant="text"
                  sx={{
                    color: "white",
                    marginLeft: "15px",
                    "@media (max-width: 600px)": { fontSize: "10px" },
                  }}
                  onClick={() => {
                    navigate("/sign-up");
                  }}
                >
                  Đăng kí
                </Button>
              </Stack>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
};
export default NavBar;
