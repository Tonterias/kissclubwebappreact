import {Route, Routes} from "react-router-dom";
import SplashScreen from "../pages/auth/SplashScreen";
import WelcomeScreen from "../pages/auth/WelcomeScreen";
import LoginScreen from "../pages/auth/LoginScreen.tsx";
import SignUpScreen from "../pages/auth/SignupScreen.tsx";
import VerificationScreen from "../pages/auth/VerificationScreen.tsx";
import PhoneInputScreen from "../pages/onBoarding/PhoneInputScreen.tsx";
import NameScreen from "../pages/onBoarding/NameScreen.tsx";
import BirthdayScreen from "../pages/onBoarding/BirthdayScreen.tsx";
import GenderScreen from "../pages/onBoarding/GenderScreen.tsx";
import MeetingOptions from "../pages/onBoarding/MeetingOptions.tsx";
import RelationshipGoals from "../pages/onBoarding/RelationGoal.tsx";
import SwipeScreen from "../pages/main/SwipeScreen.tsx";
import LikeScreen from "../pages/main/LikeScreen.tsx";
import MatchesScreen from "../pages/main/MatchScreen.tsx";
import ProfileScreen from "../pages/main/ProfileScreen.tsx";
import SettingsScreen from "../pages/main/SettingsScreen.tsx";
import PartyList from "../pages/party/PartyList.tsx";
import PartyDetail from "../pages/party/PartyDetail.tsx";
import SelfieScreen from "../pages/selfie/SelfieScreen.tsx";
import ProtectedRoute from "../components/ProtectedRoute.tsx";
import EditScreen from "../pages/main/EditScreen.tsx";
import CommonProfile from "../pages/main/CommonProfile.tsx";
import BlockedUsersPage from "../pages/main/BlockedUsers.tsx";


const RouterScreen = () => {

    return (
        <Routes>
            <Route path="/" element={<SplashScreen/>}/>
            <Route path="/welcome" element={<WelcomeScreen/>}/>
            <Route path="/signin" element={<LoginScreen/>}/>
            <Route path="/signup" element={<SignUpScreen/>}/>
            <Route
                path="/verification"
                element={
                    <ProtectedRoute>
                        <VerificationScreen/>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/phone"
                element={
                    <ProtectedRoute>
                        <PhoneInputScreen/>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/name"
                element={
                    <ProtectedRoute>
                        <NameScreen/>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/birthday"
                element={
                    <ProtectedRoute>
                        <BirthdayScreen/>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/gender"
                element={
                    <ProtectedRoute>
                        <GenderScreen/>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/options"
                element={
                    <ProtectedRoute>
                        <MeetingOptions/>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/goals"
                element={
                    <ProtectedRoute>
                        <RelationshipGoals/>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/swipe"
                element={
                    <ProtectedRoute>
                        <SwipeScreen/>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/like"
                element={
                    <ProtectedRoute>
                        <LikeScreen/>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/matches"
                element={
                    <ProtectedRoute>
                        <MatchesScreen/>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <ProfileScreen/>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/settings"
                element={
                    <ProtectedRoute>
                        <SettingsScreen/>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/party"
                element={
                    <ProtectedRoute>
                        <PartyList/>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/party/details/:id"
                element={
                    <ProtectedRoute>
                        <PartyDetail/>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/selfie/:id"
                element={
                    <ProtectedRoute>
                        <SelfieScreen/>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/edit"
                element={
                    <ProtectedRoute>
                        <EditScreen/>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/common/:id"
                element={
                    <ProtectedRoute>
                        <CommonProfile/>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/blocked/users"
                element={
                    <ProtectedRoute>
                        <BlockedUsersPage/>
                    </ProtectedRoute>
                }
            />


        </Routes>
    )
}

export default RouterScreen;
