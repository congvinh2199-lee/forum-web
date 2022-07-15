import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import "./style.scss";
import { Container, ListItemButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import CollectionsIcon from "@mui/icons-material/Collections";
import CampaignIcon from "@mui/icons-material/Campaign";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PeopleIcon from "@mui/icons-material/People";
import SupportIcon from "@mui/icons-material/Support";
import Footer from "../../components/Footer";
import RightComponent from "./component/RightComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { USER_INFO_KEY } from "../../utils/util.enum";

const ACTIVE_MENU_COLOR = "#4C1C95";

export default function UserLayout(props) {
  const mdTheme = createTheme();
  const navigate = useNavigate();
  const pathName = useLocation()?.pathname;
  const search = useLocation()?.search;

  useEffect(() => {
    let userInfo = JSON.parse(localStorage.getItem(USER_INFO_KEY));
    if (Number(userInfo && userInfo?.role) === 2) {
      navigate("/admin");
      localStorage.clear();
    }
  }, []);

  return (
    <div>
      <NavBar />
      {props.page === "homepage" && (
        <div className="user-homepage-jumbotron">
          <section>
            <div class="about-us">
              <h2>Hỏi đáp và chia sẻ</h2>
              <p>
                Chia sẻ và tiếp cận đánh giá từ người dùng. Chúng tôi muốn kết
                nối những người có kiến thức với những người cần nó, tập hợp
                những người có quan điểm khác nhau để họ có thể hiểu nhau hơn và
                trao quyền cho mọi người chia sẻ kiến thức của họ.
              </p>
            </div>
            <div class="image-wrapper">
              <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2940&q=80" />
            </div>
          </section>
        </div>
      )}
      <Box>
        <ThemeProvider theme={mdTheme} sx={{ backgroundColor: "#F2F2F2" }}>
          <Box
            sx={{
              display: "flex",
              backgroundColor: "#F2F2F2",
              "@media (min-width: 1001px)": {
                paddingLeft: "30px",
                paddingRight: "30px",
              },
              "@media (min-width: 601px) and (max-width: 1000px)": {
                paddingLeft: "30px",
                paddingRight: "30px",
              },
              paddingTop: "15px",
            }}
          >
            <List>
              <React.Fragment>
                <ListItemButton
                  onClick={() => navigate("/")}
                  sx={
                    pathName === "/" && search.indexOf("poll=true") === -1
                      ? { color: ACTIVE_MENU_COLOR }
                      : {}
                  }
                >
                  <ListItemIcon>
                    <HomeIcon
                      sx={
                        pathName === "/" && search.indexOf("poll=true") === -1
                          ? { color: ACTIVE_MENU_COLOR }
                          : {}
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Trang chủ"
                    sx={{ whiteSpace: "nowrap" }}
                  />
                </ListItemButton>

                <ListItemButton
                  onClick={() => navigate("/topic")}
                  sx={pathName === "/topic" ? { color: ACTIVE_MENU_COLOR } : {}}
                >
                  <ListItemIcon>
                    <CollectionsIcon
                      sx={
                        pathName === "/topic"
                          ? { color: ACTIVE_MENU_COLOR }
                          : {}
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Chủ đề"
                    sx={{ whiteSpace: "nowrap" }}
                  />
                </ListItemButton>

                <ListItemButton
                  onClick={() => {
                    const searchParams = new URLSearchParams(
                      window.location.search
                    );
                    const search = searchParams.get("search");
                    const sort = searchParams.get("sort");
                    const topic = searchParams.get("searchParams");

                    window.location.href = `/?search=${search || ""}&sort=${
                      sort || ""
                    }&topic=${topic || ""}&poll=true`;
                  }}
                  sx={
                    search.indexOf("poll=true") > -1
                      ? { color: ACTIVE_MENU_COLOR }
                      : {}
                  }
                >
                  <ListItemIcon>
                    <CampaignIcon
                      sx={
                        search.indexOf("poll=true") > -1
                          ? { color: ACTIVE_MENU_COLOR }
                          : {}
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Ý kiến"
                    sx={{ whiteSpace: "nowrap" }}
                  />
                </ListItemButton>

                <ListItemButton onClick={() => navigate("/tag")}>
                  <ListItemIcon>
                    <LocalOfferIcon
                      sx={
                        pathName === "/tag" ? { color: ACTIVE_MENU_COLOR } : {}
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Thẻ"
                    sx={pathName === "/tag" ? { color: ACTIVE_MENU_COLOR } : {}}
                  />
                </ListItemButton>

                <ListItemButton onClick={() => navigate("/member")}>
                  <ListItemIcon>
                    <PeopleIcon
                      sx={
                        pathName?.includes("/member")
                          ? { color: ACTIVE_MENU_COLOR }
                          : {}
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Thành viên"
                    sx={{
                      whiteSpace: "nowrap",
                      color: pathName?.includes("/member")
                        ? ACTIVE_MENU_COLOR
                        : "",
                    }}
                  />
                </ListItemButton>

                <ListItemButton onClick={() => navigate("/helper")}>
                  <ListItemIcon>
                    <SupportIcon
                      sx={
                        pathName?.includes("/helper")
                          ? { color: ACTIVE_MENU_COLOR }
                          : {}
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Giúp đỡ"
                    sx={{
                      whiteSpace: "nowrap",
                      color: pathName?.includes("/helper")
                        ? ACTIVE_MENU_COLOR
                        : "",
                    }}
                  />
                </ListItemButton>
              </React.Fragment>
            </List>
            <Box
              component="main"
              sx={{
                width: "100%",
              }}
            >
              <Container
                maxWidth="xl"
                sx={{ mt: 3, backgroundColor: "transparent" }}
              >
                <div
                  className="home-page"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                  }}
                >
                  {/** left */}
                  <div
                    className="left-frame"
                    style={{ height: "1200px", overflow: "auto" }}
                    id="questionScrollableDiv"
                  >
                    {props.children}
                  </div>
                  {/** right */}
                  <RightComponent />
                </div>
              </Container>
            </Box>
          </Box>
        </ThemeProvider>
      </Box>

      <Footer />
    </div>
  );
}
