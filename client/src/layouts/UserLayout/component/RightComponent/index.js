import { Button, Divider } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PopularQuestion from "../PopularQuestion";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import FeaturedMember from "../FeaturedMember";
import AskQuestionModal from "../AskQuestionModal";
import { USER_INFO_KEY } from "../../../../utils/util.enum";
import InfoAPI from "../../../../api/info";
import TagAPI from "../../../../api/tag";

export default function RightComponent() {
  const [visibleAskQuestion, setVisibleAskQuestion] = useState(false);
  const [websiteQuantity, setWebsiteQuantity] = useState({
    answer: 0,
    question: 0,
    bestAnswer: 0,
    member: 0,
  });
  const [listTag, setListTag] = useState([]);
  const location = useLocation();

  const navigate = useNavigate();
  const findInputRef = useRef();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const searchText = searchParams.get("search");
    if (searchText?.length) {
      findInputRef.current.value = searchText;
    }else{
      findInputRef.current.value = ''
    }

  }, [location]);

  const getWebsiteTrendingTag = async () => {
    const trendingTag = await TagAPI.getTrendingTag(20, 0);
    if (trendingTag?.data?.success) {
      setListTag(trendingTag?.data?.payload);
    }
  };

  const getWebsiteQuantity = async () => {
    const websiteQuantity = await InfoAPI.getWebsiteInfo();
    if (websiteQuantity?.data?.success) {
      setWebsiteQuantity(websiteQuantity?.data?.payload);
    }
  };

  useEffect(() => {
    getWebsiteQuantity();
    getWebsiteTrendingTag();
  }, []);

  return (
    <div className="right-frame">
      <div className="first">
        <Button
          variant="contained"
          size="medium"
          onClick={() => {
            const userInfo = localStorage.getItem(USER_INFO_KEY);
            if (userInfo) {
              setVisibleAskQuestion(true);
            } else {
              toast.error("Bạn cần đăng nhập để thực hiện chức năng này");
              setTimeout(() => {
                navigate("/login");
              }, 1000);
            }
          }}
        >
          Đặt 1 câu hỏi
        </Button>
      </div>
      <Divider
        sx={{
          marginBottom: "30px",
          border: "0.5px solid #E0E3E3",
        }}
      />
      <div className="second">
        <input type="text" placeholder="Tìm kiếm...." ref={findInputRef} />
        <Button
          size="medium"
          variant="outlined"
          sx={{ width: "80%", marginTop: "15px" }}
          onClick={() => {
            const searchParams = new URLSearchParams(window.location.search);
            const sort = searchParams.get("sort");
            const topic = searchParams.get("topic");
            window.location.href = `/?search=${findInputRef.current.value}&sort=${
              sort || ""
            }&topic=${topic || ''}`;
          }}
        >
          Tìm kiếm
        </Button>
      </div>
      <Divider sx={{ marginTop: "30px", border: "0.5px solid #E0E3E3" }} />
      <div className="third">
        <table>
          <tr>
            <td>
              <div className="title" style={{ color: "#1976D2" }}>
                Câu hỏi
              </div>
              <div className="result">{websiteQuantity?.question}</div>
            </td>
            <td>
              <div className="title" style={{ color: "red" }}>
                Trả lời
              </div>
              <div className="result">{websiteQuantity?.answer}</div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="title" style={{ color: "green" }}>
                Trả lời tốt nhất
              </div>
              <div className="result">{websiteQuantity?.bestAnswer || 0}</div>
            </td>
            <td>
              <div className="title" style={{ color: "#1976D2" }}>
                Thành viên
              </div>
              <div className="result">{websiteQuantity?.member}</div>
            </td>
          </tr>
        </table>
      </div>
      <Divider sx={{ marginTop: "30px", border: "0.5px solid #E0E3E3" }} />

      <div className="four">
        <PopularQuestion />
      </div>
      <Divider sx={{ border: "0.5px solid #E0E3E3" }} />

      <div className="five">
        <div
          style={{
            marginTop: "5px",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: "20px 30px 20px 30px",
          }}
        >
          <LocalOfferIcon />
          <div
            style={{
              marginLeft: "10px",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            Trending Tags
          </div>
        </div>
        <div className="tag-frame">
          {listTag.map((item, index) => {
            return (
              <div className="tag-item" key={`treding-tag-item-${index}`}>
                {item?.tag_title}
              </div>
            );
          })}
        </div>
      </div>
      <Divider sx={{ border: "0.5px solid #E0E3E3", marginTop: "30px" }} />
      <div className="six">
        <FeaturedMember />
      </div>
      {visibleAskQuestion && (
        <AskQuestionModal
          visible={visibleAskQuestion}
          onClose={() => {
            setVisibleAskQuestion(false);
          }}
          title="Đặt 1 câu hỏi"
          closeTitle="Đóng"
          closeSubmitTitle="Đăng ngay"
        />
      )}
    </div>
  );
}
