import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import AdminAccount from "../pages/Admin/Account";
import AdminContact from "../pages/Admin/Contact";
import AdminDashboard from "../pages/Admin/Dashboard";
import AdminHelp from "../pages/Admin/Help";
import AdminBlog from "../pages/Admin/Post";
import AdminQuestion from "../pages/Admin/Question";
import QuestionTopic from "../pages/Admin/Topic";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import PersonalPage from "../pages/User/ PersonalPage";
import AboutMe from "../pages/User/AboutMe";
import Blog from "../pages/User/Blog";
import BlogDetail from "../pages/User/BlogDetail";
import Contact from "../pages/User/Contact";
import HelperPage from "../pages/User/HelperPage";
import HomePage from "../pages/User/HomePage";
import Member from "../pages/User/Member";
import MemberDetail from "../pages/User/MemberDetail";
import QuestionDetail from "../pages/User/QuestionDetail";
import Tag from "../pages/User/Tag";
import Topic from "../pages/User/Topic";
import AdminPrivateRouter from "./AdminPrivateRouter";

export default function MainRouter() {
  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <UserLayout page="homepage">
              <HomePage />
            </UserLayout>
          }
        />

        <Route
          exact
          path="/question/:questionId"
          element={
            <UserLayout page="homepage">
              <QuestionDetail />
            </UserLayout>
          }
        />

        <Route
          exact
          path="/topic"
          element={
            <UserLayout page="homepage">
              <Topic />
            </UserLayout>
          }
        />

        <Route
          exact
          path="/tag"
          element={
            <UserLayout page="homepage">
              <Tag />
            </UserLayout>
          }
        />

        <Route
          exact
          path="/member"
          element={
            <UserLayout page="homepage">
              <Member />
            </UserLayout>
          }
        />

        <Route
          exact
          path="/helper"
          element={
            <UserLayout page="homepage">
              <HelperPage />
            </UserLayout>
          }
        />

        <Route
          exact
          path="/member/:memberId"
          element={
            <UserLayout page="homepage">
              <MemberDetail />
            </UserLayout>
          }
        />

        <Route
          exact
          path="/aboutme"
          element={
            <UserLayout>
              <AboutMe />
            </UserLayout>
          }
        />

        <Route
          exact
          path="/contact"
          element={
            <UserLayout>
              <Contact />
            </UserLayout>
          }
        />

        <Route
          exact
          path="/blog"
          element={
            <UserLayout>
              <Blog />
            </UserLayout>
          }
        />

        <Route
          exact
          path="/blog/:blogId"
          element={
            <UserLayout>
              <BlogDetail />
            </UserLayout>
          }
        />

        <Route
          exact
          path="/info/:userId"
          element={
            <UserLayout>
              <PersonalPage />
            </UserLayout>
          }
        />

        <Route
          exact
          path="/admin"
          element={
            <AdminPrivateRouter>
              <AdminDashboard />
            </AdminPrivateRouter>
          }
        />

        <Route
          exact
          path="/admin/account"
          element={
            <AdminPrivateRouter>
              <AdminAccount />
            </AdminPrivateRouter>
          }
        />

        <Route
          exact
          path="/admin/topic"
          element={
            <AdminPrivateRouter>
              <QuestionTopic />
            </AdminPrivateRouter>
          }
        />
        <Route
          exact
          path="/admin/blog"
          element={
            <AdminPrivateRouter>
              <AdminBlog />
            </AdminPrivateRouter>
          }
        />

        <Route
          exact
          path="/admin/question"
          element={
            <AdminPrivateRouter>
              <AdminQuestion />
            </AdminPrivateRouter>
          }
        />

        <Route
          exact
          path="/admin/help"
          element={
            <AdminPrivateRouter>
              <AdminHelp />
            </AdminPrivateRouter>
          }
        />

        <Route
          exact
          path="/admin/contact"
          element={
            <AdminPrivateRouter>
              <AdminContact />
            </AdminPrivateRouter>
          }
        />

        <Route exact path="/login" element={<Login />} />
        <Route exact path="/sign-up" element={<Register />} />
      </Routes>
    </Router>
  );
}
