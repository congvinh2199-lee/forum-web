import React from "react";
import "./style.scss";

export default function Footer() {
  return (
    <div className="footer-frame">
      <footer>
        <div>
          <span class="logo">MẠNG XÃ HỘI HỎI ĐÁP</span>
        </div>

        <div class="row">
          <div class="col-3">
            <div class="link-cat" onclick="footerToggle(this)">
              <span class="footer-toggle"></span>
              <span class="footer-cat">Về chúng tôi</span>
            </div>
            <ul class="footer-cat-links">
              <li>
                <a href="">
                  <span>Cộng đồng mạng hỏi đáp, đánh giá và chia sẻ các kiến thức thứ xung quanh bạn.</span>
                </a>
              </li>
              <li>
                <a href="">
                  <span>Sẵn sàng giúp bạn giải đáp mọi thắc mắc trong cuộc sống</span>
                </a>
              </li>
            </ul>
          </div>
          <div class="col-3" id="newsletter">
            <div class="social-links social-2">
              <a href="">
                <i class="fab fa-facebook-f"></i>
              </a>
              <a href="">
                <i class="fab fa-twitter"></i>
              </a>
              <a href="">
                <i class="fab fa-linkedin-in"></i>
              </a>
              <a href="">
                <i class="fab fa-instagram"></i>
              </a>
              <a href="">
                <i class="fab fa-tumblr"></i>
              </a>
              <a href="">
                <i class="fab fa-reddit-alien"></i>
              </a>
            </div>

            <div id="address">
              <span>Địa chỉ văn phòng</span>
              <ul>
                <li>
                  <i class="far fa-building"></i>
                  <div>
                    Los Angeles
                    <br />
                    Office 9B, Sky High Tower, New A Ring Road, Los Angeles
                  </div>
                </li>
                <li>
                  <i class="fas fa-gopuram"></i>
                  <div>
                    Delhi
                    <br />
                    Office 150B, Behind Sana Gate Char Bhuja Tower, Station
                    Road, Delhi
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="social-links social-1 col-6">
            <a href="">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="">
              <i class="fab fa-linkedin-in"></i>
            </a>
            <a href="">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="">
              <i class="fab fa-tumblr"></i>
            </a>
            <a href="">
              <i class="fab fa-reddit-alien"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
