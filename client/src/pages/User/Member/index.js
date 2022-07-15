import React, { useEffect, useState } from "react";
import {
  Breadcrumbs,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Link,
  Typography,
} from "@mui/material";
import UserAPI from "../../../api/user";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import PaidIcon from "@mui/icons-material/Paid";
import { useNavigate } from "react-router-dom";
import { USER_INFO_KEY } from "../../../utils/util.enum";
import CustomPagination from "../../../components/CustomPagination";
import PlacehoderImage from "../../../assets/user/placeholder-image.jpeg";

const ITEM_IN_PAGE = 4;
const ROLE = 1;
export default function Member() {
  const [listUser, setListUser] = useState([]);
  const navigate = useNavigate();
  const userData = JSON.parse(window.localStorage.getItem(USER_INFO_KEY));
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const getUserList = async (page) => {
    const userList = await UserAPI.getAllUser(
      ROLE,
      "USER_DESC",
      ITEM_IN_PAGE,
      page
    );
    if (userList?.data?.success) {
      const { payload } = userList?.data;
      const totalPage = Math.ceil(Number(payload?.total) / ITEM_IN_PAGE);
      setCurrentPage(page);
      setTotalPage(totalPage);
      setListUser(payload?.user);
    }
  };

  useEffect(() => {
    getUserList(0);
  }, []);

  return (
    <div>
      <div>
        <div style={{ padding: "20px" }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/">
              Trang chủ
            </Link>
            <Typography color="text.primary">Thành viên</Typography>
          </Breadcrumbs>
        </div>
        <Divider />
        <p style={{ paddingLeft: "20px", fontSize: "26px", fontWeight: 600 }}>
          Danh sách thành viên
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            padding: "0 20px 20px 20px",
          }}
        >
          {listUser?.map((item, index) => {
            return (
              <div key={`member-item-${index}`} style={{ marginTop: "20px" }}>
                {item?.user_id !== userData?.user_id ? (
                  <Card
                    sx={{ width: 300 }}
                    key={`homepage-user-member-${index}`}
                  >
                    <CardMedia
                      component="img"
                      height="180"
                      image={item?.avatar?.length ? item?.avatar : PlacehoderImage}
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{ textAlign: "center" }}
                      >
                        {item?.first_name + " " + item?.last_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}
                        >
                          <QuestionAnswerIcon />
                          <span style={{ marginLeft: "10px" }}>
                            Số câu hỏi:{" "}
                            {typeof item?.total_question !== "undefined"
                              ? item?.total_question
                              : " Chưa cập nhật"}
                          </span>
                        </div>
                        <br />
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}
                        >
                          <PaidIcon />
                          <span style={{ marginLeft: "10px" }}>
                            Điểm thưởng:{" "}
                            {typeof item?.score !== "undefined"
                              ? item?.score
                              : " Chưa cập nhật"}
                          </span>
                        </div>
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          width: "100%",
                        }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => {
                            navigate(`/member/${item?.user_id}`);
                          }}
                        >
                          Xem chi tiết
                        </Button>
                      </div>
                    </CardActions>
                  </Card>
                ) : (
                  <></>
                )}
              </div>
            );
          })}
        </div>
        {listUser?.length ? (
          <div style={{ display: "flex", justifyContent: "end" }}>
            <CustomPagination
              totalPage={totalPage}
              handlePageChange={(page) => {
                getUserList(page);
              }}
              currentPage={currentPage}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
