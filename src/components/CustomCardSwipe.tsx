    import {useRef, useState} from "react";
    import '../styles/buttons.css'
    import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
    import {faHeart, faXmark} from "@fortawesome/free-solid-svg-icons";
    import {useNavigate} from "react-router-dom";

    type CustomCardSwipeProps = {
        data: { name: string; image: string, id: string };
        index: number;
        removeCardLeft: () => void;
        removeCardRight: () => void;
        isTopCard: boolean;
        userId?: string[];
        partyId?: string;
    };

    const CustomCardSwipe = ({
                                 data,
                                 index,
                                 removeCardLeft,
                                 removeCardRight,
                                 isTopCard,

                             }: CustomCardSwipeProps) => {
        const cardRef = useRef<HTMLDivElement>(null);
        const [position, setPosition] = useState({x: 0, y: 0});
        const [isDragging, setDragging] = useState(false);
        const start = useRef({x: 0, y: 0});
        const [right, setRight] = useState(false);
        const [left, setLeft] = useState(false);
        const navigate = useNavigate();

        const handleMouseDown = (event: React.MouseEvent<HTMLElement>) => {
            if (!isTopCard) return;
            setDragging(true);
            start.current = {x: event.clientX, y: event.clientY};
        };

        const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
            if (!isDragging || !isTopCard) {
                setPosition({x: 0, y: 0})
                setRight(false);
                setLeft(false);
                return;
            }

            const dx = event.clientX - start.current.x;
            if (dx > 50) {
                setRight(true)
            } else if (dx < -50) setLeft(true)
            setPosition({x: dx, y: 0});
        };

        const handleMouseUp = () => {
            if (!isTopCard) return;
            setDragging(false);
            setLeft(false);
            setRight(false);
            finishSwipe();
        };

        // Touch Events
        const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
            if (!isTopCard) return;
            const touch = event.touches[0];
            start.current = {x: touch.clientX, y: touch.clientY};
            setDragging(true);
        };

        const handleTouchMove = (event: React.TouchEvent<HTMLElement>) => {
            if (!isDragging || !isTopCard) {
                setPosition({x: 0, y: 0})
                setRight(false);
                setLeft(false);
                return;
            }
            const touch = event.touches[0];
            const dx = touch.clientX - start.current.x;
            if (dx > 50) {
                setRight(true)
            } else if (dx < -50) {
                setLeft(true)
            }
            setPosition({x: dx, y: 0});

        };

        const handleTouchEnd = () => {
            if (!isTopCard) return;
            setDragging(false);
            finishSwipe();
            setLeft(false);
            setRight(false);
        };

        const finishSwipe = () => {
            if (position.x > 200) {
                setPosition({
                    x: position.x > 0 ? window.innerWidth : -window.innerWidth,
                    y: 0,
                });
                setTimeout(() => {
                    setPosition({x: 0, y: 0});
                    removeCardRight();
                }, 100);
            } else if (position.x < -200) {
                setPosition({
                    x: position.x > 0 ? window.innerWidth : -window.innerWidth,
                    y: 0,
                });

                setTimeout(() => {
                    setPosition({x: 0, y: 0});
                    removeCardLeft();
                }, 100);
            } else {
                setPosition({x: 0, y: 0});
            }
        };
        const onSwipeRightButton = () => {
            removeCardRight();
        }

        const onSwipeLeftButton = () => {
            removeCardLeft();
        }
        return (
            <div
                ref={cardRef}
                className="card-swipe"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                    position: 'absolute',
                    width: '80%',
                    height: '60%',
                    boxShadow: '0 2px 2px rgba(0,0,0,0.2)',
                    borderRadius: '16px',
                    backgroundColor: 'white',
                    zIndex: 990 - index,
                    transform: `translate(${position.x}px, ${position.y}px) rotate(${position.x * 0.05}deg)`,
                    transition: isDragging ? 'none' : 'transform 0.3s ease',
                    overflow: 'hidden',
                    userSelect: 'none',
                    touchAction: 'none',
                    cursor: isTopCard ? (isDragging ? 'grabbing' : 'grab') : 'default',
                }}


            >
                {
                    right ?

                        <div style={{
                            position: "absolute",
                            zIndex: 1000,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            height: "100%"
                        }}>
                            <FontAwesomeIcon icon={faHeart} size={'3x'} color="white" style={{
                                backgroundColor: "green",
                                borderRadius: "50%",
                                padding: "1.5rem",
                            }}/>
                        </div> : null

                }

                {
                    left ?

                        <div style={{
                            position: "absolute",
                            zIndex: 1000,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            height: "100%"
                        }}>
                            <FontAwesomeIcon icon={faXmark} size={'3x'} color="white" style={{
                                backgroundColor: "red",
                                borderRadius: "50%",
                                padding: "1.5rem",
                            }}/>
                        </div> : null

                }

                <div style={{
                    width: '100%',
                    display: 'flex',
                    height: '100%',
                    objectFit: 'contain',
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px',
                    alignItems: 'center',
                    flexDirection: 'column',
                    zIndex: 88,
                    gap: "0.5rem"
                }}
                     onClick={() => {
                         navigate(`/common/${data.id}`)
                     }
                     }
                >

                    <img
                        src={data.image}
                        alt={data.name}
                        style={{
                            height: "100%",
                            width: "100%",
                            zIndex: 1,
                            userSelect: "none",
                            pointerEvents: "none",
                        }}
                        draggable={false}
                    />
                    <div style={{
                        position: "absolute",
                        bottom: 0,
                        zIndex: 9999,
                        backgroundColor: "black",
                        width: "100%",
                        height: "20%",
                        opacity: 0.8,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column"
                    }}>
                        <p style={{
                            fontFamily: "Poppins",
                            color: "white",
                            fontSize: "1.5rem",
                            fontWeight: "bold"
                        }}>{data.name}</p>
                        <p style={{fontFamily: "Poppins", color: "white", fontSize: "1rem", fontWeight: "200"}}>Dating</p>
                        <div style={{
                            position: "absolute", left: 20, opacity: 1, zIndex: 1000
                        }} className={"forgot-password-btn"}
                             onClick={(e)=>{
                                e.stopPropagation();
                                onSwipeLeftButton()
                             }}>
                            <FontAwesomeIcon icon={faXmark} color="red" style={{
                                backgroundColor: "white",
                                borderRadius: "50%",
                                padding: "1rem",
                                zIndex: 1000
                            }}/>
                        </div>
                        <div style={{
                            position: "absolute", right: 20, opacity: 1, zIndex: 1000
                        }} className={"forgot-password-btn"}
                             onClick={(e)=>{
                                 e.stopPropagation();
                                 onSwipeRightButton()
                             }}>
                            <FontAwesomeIcon icon={faHeart} color="red" style={{
                                backgroundColor: "white",
                                borderRadius: "50%",
                                padding: "1rem",
                            }}/>
                        </div>
                    </div>

                </div>
            </div>
        );
    };

    export default CustomCardSwipe;
