import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from '../layouts/Layout';
import { NotFound } from '../not-found/NotFound';
import { DashboardWrapper } from "../dashboard/DashboardWrapper";
import CandidateSearchWrapper from '../candidate-inventory/search/CandidateSearchWrapper';
import { RequestDetails } from '../request-details/RequestDetails';
import { ResumeReviewWrapper } from "../resume-review/ResumeReviewWrapper";
import { PanelReview } from '../panel-review/PanelReview';
import { AnnouncementReview } from '../announcement-review/AnnouncementReview';
import { ApplicantListReview } from '../applicant-list-review/ApplicantListReview';
import { PositionReview } from '../position-review/PositionReview';
import { UnexpectedError } from "../unexpected-error/UnexpectedError";
import UserProfile from "../user-profile/UserProfile";
import Loader from "../../components/loader/Loader";
import TimeoutModal from "./TimeoutModal";
import CandidateDetailsPage from "../candidate-inventory/candidate-details/CandidateDetailsPage";
import LandingPage from "../candidate-inventory/home/LandingPage";
import ComponentsPage from "../ui-component-list/ComponentsPage";
 
export default function App() {
    let sessionTimer = null;
    const [appState, setAppState] = useState({
        loading: true,
        showSessionWarning: false,
    });
  const clearSessionTimer = () => {
    if (sessionTimer) clearTimeout(sessionTimer);
  };
  const renewSessionTimer = async () => {
    setSessionTimer();
    setAppState({ loading: false, showSessionWarning: false });
  };
  const setSessionTimer = () => {
    if (sessionTimer) clearSessionTimer();
    sessionTimer = setTimeout(() => {
      setAppState({ loading: false, showSessionWarning: true });
      }, (process.env.REACT_APP_SESSION_LENGTH - 1) * (60 * 1800));
  };
    useEffect(() => {
        setSessionTimer();
        setAppState({ loading: false, showSessionWarning: false });
        return clearSessionTimer;
    }, []);
    return (
        <>
            <Loader loading={appState.loading}>
                <BrowserRouter basename={"/"}>
                    <Routes>
                        <Route path="/" element={<Layout><DashboardWrapper /></Layout>} />
                        <Route path="/dashboard" element={<Layout><DashboardWrapper /></Layout>} />
                        <Route path="/dashboard/:summaryType" element={<Layout><DashboardWrapper /></Layout>} />
                        <Route path="/requests/create/*" element={<Layout><RequestDetails key="request-details" /></Layout>} />
                        <Route path="/requests/edit/:id/*" element={<Layout><RequestDetails key="request-details" /></Layout>} />
                        <Route path="/reviews/position-description/edit/:id/*" element={<Layout><PositionReview /></Layout>} />
                        <Route path="/reviews/announcement/edit/:id/*" element={<Layout><AnnouncementReview /></Layout>} />
                        <Route path="/reviews/applicant-list/edit/:id" element={<Layout><ApplicantListReview /></Layout>} />
                        <Route path="/reviews/panel/edit/:id" element={<Layout><PanelReview /></Layout>} />
                        <Route path="/reviews/sme-resume/edit/:id" element={<Layout><ResumeReviewWrapper /></Layout>} />
                        <Route path="/user/profile" element={<Layout><UserProfile /></Layout>} />
                        <Route path="/components/*" element={<ComponentsPage />} />
                        <Route path="/error" element={<Layout><UnexpectedError /></Layout>} />
                        <Route path="*" element={<Layout><NotFound /></Layout>} />
                        {window.ENABLE_CANDIDATE_INVENTORY === "true" && (
                            <>
                                <Route path="/candidates" element={<Layout><LandingPage /></Layout>} />
                                <Route path="/candidates/browse/*" element={<Layout><CandidateSearchWrapper /></Layout>} />
                                <Route path="/candidates/:id" element={<Layout><CandidateDetailsPage /></Layout>} />
                            </>
                        )}
                        {window.ENABLE_CANDIDATE_INVENTORY === "false" && (
                            <>
                                <Route path="/candidates" element={<Layout><UnexpectedError /></Layout>} />
                                <Route path="/candidates/browse/*" element={<Layout><UnexpectedError /></Layout>} />
                                <Route path="/candidates/:id" element={<Layout><UnexpectedError /></Layout>} />
                            </>
                        )}
                    </Routes>
                </BrowserRouter>
            </Loader>
            {appState.showSessionWarning && (
                <TimeoutModal
                    onContinueWorking={renewSessionTimer}
                    onLogout={() => {
                        if (sessionTimer) clearSessionTimer();
                        window.location.assign('/account/logout');
                    }
                    } />
            )}
        </>
    );
}
