import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Alert, Button, Stack, Tab, Tabs, Typography } from "@mui/material";
import UserAPI from "../../../api/user";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Box } from "@mui/system";
import SwipeableTemporaryDrawer from "./components/ViewUserDrawer";
import { ToastContainer, toast } from "react-toastify";
import AddManagerModal from "./components/AddManagerModal";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CustomPopover from "../../../components/CustomPopover";
import ChangeStatusPopover from "./components/ChangeStatusPopover";
import authAPI from "../../../api/auth";
import PlaceholderImage from '../../../assets/user/placeholder-image.jpeg';

const columns = [
  { id: "stt", label: "Số thứ tự", minWidth: 170 },
  { id: "avatar", label: "Hình ảnh", minWidth: 170 },
  { id: "name", label: "Tên", minWidth: 170 },
  { id: "email", label: "Email", minWidth: 170 },
  {
    id: "phone_number",
    label: "SĐT",
    minWidth: 170,
    align: "right",
  },
  {
    id: "address",
    label: "Địa chỉ",
    minWidth: 170,
    align: "left",
  },
  {
    id: "status",
    label: "Trạng thái",
    minWidth: 170,
    align: "center",
  },
  {
    id: "action",
    label: "Thao tác",
  },
];

export default function AdminAccount() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [currentTab, setCurrentTab] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [viewUserData, setViewUserData] = useState({});
  const [visibleUserDrawer, setVisibleUserDrawer] = useState(false);
  const [visibleAddModal, setVisibleAddModal] = useState(false);
  const [popoverId, setPopoverId] = useState("");
  const [changeStatusPopoverId, setChangeStatusPopoverId] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getAllUserData = async () => {
    setTableData([]);
    const accountRes = await UserAPI.getAllUser(currentTab);
    if (accountRes?.data?.payload?.user?.length) {
      setTableData(accountRes?.data?.payload?.user);
    }
  };

  useEffect(() => {
    getAllUserData();
  }, [currentTab]);

  const handleCreateManager = async (managerData) => {
    const { address, email, firstName, lastName, password, phone } =
      managerData;
    const createData = {
      firstName,
      lastName,
      email: email,
      phone_number: phone,
      address: address,
      password: password,
      role: 2,
    };
    const createRes = await authAPI.userSignup(createData);
    if (createRes?.data?.success) {
      getAllUserData();
      setVisibleAddModal(false);
      toast.success("Thêm mới nhân viên quản lí thành công");
      return { success: true };
    } else {
      toast.error("Thêm mới nhân viên quản lí thất bại");
      return createRes;
    }
  };

  const changeUserStatus = async (status, userId) => {
    const changeStatusRes = await UserAPI.changeUserStatus(
      status,
      userId,
      currentTab
    );

    if (changeStatusRes?.data?.success) {
      getAllUserData();
      toast.success("Cập nhật trạng thái thành công");
      setPopoverId("");
    } else {
      toast.error(
        changeStatusRes?.data?.error?.message || "Cập nhật trạng thái thất bại"
      );
    }
  };

  const handleDeleteAccount = async (userId) => {
    const deleteRes = await UserAPI.deleteUser(userId, currentTab);

    if (deleteRes?.data?.success) {
      getAllUserData();
      toast.success("Xoá tài khoản thành công");
      setPopoverId("");
    } else {
      toast.error(deleteRes?.data?.error?.message || "Xoá tài khoản thất bại");
    }
  };

  const displayStatus = (status, userId) => {
    if (status === 0) {
      return (
        <ChangeStatusPopover
          visible={changeStatusPopoverId === userId}
          onClose={() => setChangeStatusPopoverId("")}
          currentStatus={status}
          handleSubmit={(selectStatus) => {
            changeUserStatus(selectStatus, userId);
            return;
          }}
        >
          <Alert
            badgeContent={4}
            color="error"
            icon={false}
            onClick={() => setChangeStatusPopoverId(userId)}
            sx={{ cursor: "pointer" }}
          >
            Vô hiệu hoá
          </Alert>
        </ChangeStatusPopover>
      );
    } else if (status === 1) {
      return (
        <ChangeStatusPopover
          visible={changeStatusPopoverId === userId ? true : false}
          onClose={() => setChangeStatusPopoverId("")}
          currentStatus={status}
          handleSubmit={(selectStatus) => {
            changeUserStatus(selectStatus, userId);
            return;
          }}
        >
          <Alert
            badgeContent={4}
            color="success"
            icon={false}
            sx={{ cursor: "pointer", textAlign: "center" }}
            onClick={() => setChangeStatusPopoverId(userId)}
          >
            Hoạt động
          </Alert>
        </ChangeStatusPopover>
      );
    }
  };

  return (
    <>
      <Stack
        flexWrap={"nowrap"}
        flexDirection="row"
        justifyContent={"space-between"}
        sx={{ marginBottom: "20px" }}
      >
        <Typography
          component="h2"
          variant="h6"
          color="primary"
          gutterBottom
          sx={{ textAlign: "left" }}
        >
          Quản lí tài khoản
        </Typography>
        <div>
          <Button variant="contained" onClick={() => setVisibleAddModal(true)}>
            Thêm mới
          </Button>
        </div>
      </Stack>
      <Box sx={{ marginBottom: "10px" }}>
        <Tabs
          value={currentTab}
          onChange={(event, newValue) => {
            setCurrentTab(newValue);
          }}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value={1} label="Khách hàng" />
          <Tab value={2} label="Nhân viên" />
        </Tabs>
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns?.map((column) => (
                  <TableCell
                    key={column?.id}
                    align={column?.align}
                    style={{ minWidth: column?.minWidth }}
                  >
                    {column?.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((row, index) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === "action" ? (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-start",
                                  alignItems: "center",
                                  flexWrap: "nowrap",
                                }}
                              >
                                <Button
                                  sx={{ height: "30px", padding: 0 }}
                                  variant="contained"
                                  color="success"
                                  onClick={() => {
                                    setViewUserData(row);
                                    setVisibleUserDrawer(true);
                                  }}
                                >
                                  {value}
                                  <RemoveRedEyeIcon />
                                </Button>
                                <CustomPopover
                                  open={
                                    currentTab === 1
                                      ? popoverId === row.user_id
                                      : popoverId === row.admin_id
                                  }
                                  onClose={() => setPopoverId("")}
                                  handleSubmit={() =>
                                    handleDeleteAccount(
                                      currentTab === 1
                                        ? row?.user_id
                                        : row?.admin_id
                                    )
                                  }
                                  noti="Tất cả thông tin của khách hàng sẽ bị mất hoàn toàn khi tài khoản bị xoá"
                                >
                                  <Button
                                    sx={{ height: "30px", padding: 0 }}
                                    variant="contained"
                                    color="error"
                                    onClick={() => {
                                      if (
                                        currentTab === 1
                                          ? popoverId === row.user_id
                                          : popoverId === row.admin_id
                                      ) {
                                        setPopoverId("");
                                      } else {
                                        setPopoverId(
                                          currentTab === 1
                                            ? row?.user_id
                                            : row?.admin_id
                                        );
                                      }
                                    }}
                                  >
                                    <DeleteForeverIcon />
                                  </Button>
                                </CustomPopover>
                              </div>
                            ) : column.id === "name" ? (
                              <div>
                                {row?.first_name + " " + row?.last_name}
                              </div>
                            ) : column.id === "status" ? (
                              displayStatus(
                                row?.status,
                                currentTab === 1 ? row?.user_id : row?.admin_id
                              )
                            ) : (column.id === "phone_number" ||
                              column.id === "address") && currentTab === 1 ? (
                              <div>...</div>
                            ) : (
                              column.id === "stt"?
                              index + 1:
                              column.id === "avatar"?
                              <img src={value || PlaceholderImage} alt='user-avatar' width={50} height={50}/>:
                              value
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={tableData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {visibleUserDrawer && (
        <SwipeableTemporaryDrawer
          visible={visibleUserDrawer}
          initData={viewUserData}
          onClose={() => setVisibleUserDrawer(false)}
          role={currentTab}
        />
      )}

      {visibleAddModal && (
        <AddManagerModal
          visible={visibleAddModal}
          onClose={() => setVisibleAddModal(false)}
          handleSubmit={(managerData) => handleCreateManager(managerData)}
        />
      )}

      <ToastContainer />
    </>
  );
}
