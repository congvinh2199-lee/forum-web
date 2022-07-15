import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import BackArrow from "../components/BackArrow";
import _ from "lodash";
import authAPI from "../../../api/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { USER_INFO_KEY } from "../../../utils/util.enum";
const theme = createTheme();

export default function Login() {
  const [loginError, setLoginError] = React.useState({
    status: false,
    error: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    const checkNull = _.compact([email, password]);
    if (checkNull.length < 2) {
      setLoginError({ status: true, error: "Dữ liệu không được để trống" });
      return;
    }

    const loginRes = await authAPI.userLogin(email, password);

    if (loginRes?.data?.success) {
      const payload = loginRes?.data?.payload
      delete payload?.password
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(payload))
      toast.success('Bạn đã đăng nhập thành công, chuyển hướng sang trang chính sau 3 giây')
      setTimeout(() => {
        if ( payload?.role === 1 ){
          navigate('/')
        }else{
          navigate('/admin')
        }
      }, 3000)  
    }else{
      toast.error(loginRes?.data?.error || 'Bạn đã đăng nhập thất bại, vui lòng thử lại sau')
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <BackArrow />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Đăng nhập
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {loginError?.status && (
              <Grid item xs={12}>
                <p style={{ color: "red", margin: 0 }}>{loginError?.error}</p>
              </Grid>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Đăng nhập
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Quên mật khẩu?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/sign-up" variant="body2">
                  {"Bạn chưa có tài khoản? Đăng kí"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
