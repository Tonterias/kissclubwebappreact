import {faUser, faHouseUser, faHeart, faFaceSmileWink} from '@fortawesome/free-solid-svg-icons';
import {useNavigate, useLocation} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import SwipeSelected from '../assets/images/home_selected.png'
import SwipeUnSelected from '../assets/images/home_unselected.png'
import LikeSelected from '../assets/images/heart_selected.png'
import LikeUnselected from '../assets/images/heart_unselected.png'
import MatchesSelected from '../assets/images/mouth_selected.png'
import MatchesUnselected from '../assets/images/mouth_unselected.png'
import ProfileSelected from '../assets/images/user_selected.png'
import ProfileUnselected from '../assets/images/user_unselected.png'
import {logEvent} from "firebase/analytics";
import {analytics} from "../services/firebaseConfig.tsx";


const BottomNav = () => {
    const navigate = useNavigate();
    const {t} = useTranslation();
    const location = useLocation();

    const navItems = [
        {id: 1, icon: faHouseUser, label: 'swipes', route: '/swipe',selected: SwipeSelected ,unselected: SwipeUnSelected},
        {id: 2, icon: faHeart, label: t('likes'), route: '/like',selected: LikeSelected ,unselected: LikeUnselected},
        {id: 3, icon: faFaceSmileWink, label: t('matches'), route: '/matches',selected: MatchesSelected ,unselected: MatchesUnselected},
        {id: 4, icon: faUser, label: t('profile'), route: '/profile',selected: ProfileSelected ,unselected: ProfileUnselected},
    ];

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            width: '100%',
            backgroundColor: '#fff',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            height: '5rem',
            boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
            borderTop: '1px solid #eaeaea',
            zIndex: 99999,
            color: "black",
            userSelect: 'none'
        }}>
            {navItems.map(item => {
                const isActive = location.pathname === item.route;
                // @ts-ignore
                return (
                    <div
                        key={item.id}
                        style={{
                            padding: "1rem",
                            borderRadius: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.2rem',
                            cursor: 'pointer',
                            backgroundColor: isActive ? '#e1dede' : "transparent",
                            userSelect: 'none'
                        }}
                        onClick={() => {
                            navigate(item.route)
                            logEvent(analytics, 'screen_view', {
                                firebase_screen: item.label,
                                firebase_screen_class: 'NavigationMenu',
                            });
                        }}
                    >
                        {
                            isActive ? <img src={item.selected} alt={"icon"} style={{height:"1.5rem",width:"1.5rem"}}/> :
                                <img src={item.unselected} alt={"icon"} style={{height:"1.5rem",width:"1.5rem"}}/>
                        }
                        <p style={{
                            margin: 0, fontSize: '0.8rem', fontFamily: "Poppins", color: "#FF0000", userSelect: 'none'
                        }}>
                            {item.label}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

export default BottomNav;
