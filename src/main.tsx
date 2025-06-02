import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import MainPage from "./components/MainPage.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import Login from "./components/auth/Login.tsx";
import Profile from "./components/profile/Profile.tsx";
import { App, ConfigProvider } from "antd";
import FillUpForm from "./components/profile/FillUpForm.tsx";
import MonthlySummary from "./components/monthlySummary/MonthlySummary.tsx";
import HrPolicies from "./components/hrPolicies/HrPolicies.tsx";
import ProgressReports from "./components/reports/ProgressReports.tsx";
import ReportUserDetail from "./components/reports/ReportUserDetail.tsx";
import ReportTable from "./components/reports/ReportTable.tsx";
import ProgressReportPDF from "./components/reports/ProgressReportPDF.tsx";
import ReportEvaluation from "./components/reports/ReportEvaluation.tsx";
import ReportSubmitted from "./components/reports/ReportSubmitted.tsx";
import InternList from "./components/admin/InternList.tsx";
import Team from "./components/developingTeam/Team.tsx";
import TermsAndConditions from "./components/privacyPolicy/TermsAndConditions.tsx";
import PrivacyPolicy from "./components/privacyPolicy/PrivacyPolicy.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <MainPage />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/monthlySummary",
        element: <MonthlySummary />,
      },
      {
        path: "/hrPolicy",
        element: <HrPolicies />,
      },
      {
        path: "/report",
        element: <ProgressReports />,
      },
      {
        path: "/reportuser",
        element: <ReportUserDetail />,
      },
      {
        path: "/reportuser/:reportId",
        element: <ReportUserDetail />,
      },
      {
        path: "/reporttable",
        element: <ReportTable />,
      },
      {
        path: "/reporttable/:reportId",
        element: <ReportTable />,
      },
      {
        path: "/reportevaluation/:reportId",
        element: <ReportEvaluation />,
      },
      {
        path: "/report/pdf/:reportId",
        element: <ProgressReportPDF />,
      },
      {
        path: "/report/submit",
        element: <ReportSubmitted />,
      },
      {
        path: "/intern/list",
        element: <InternList />,
      },
      {
        path: "/developing/team",
        element: <Team />,
      },
    ],
  },
  {
    path: "/fillUpForm",
    element: <FillUpForm />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },

  {
    path: "/terms-and-conditions",
    element: <TermsAndConditions />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <App>
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#474787",
            borderRadius: 16,
            fontFamily: "Rubik",
            colorPrimaryBg: "#ebf2ed",
            colorBgLayout: "White",
          },
        }}
      >
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={true} />
        </QueryClientProvider>
      </ConfigProvider>
    </Provider>
  </App>
);
